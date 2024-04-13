package assets

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

func NewUpdateAssetHandler(db types.DynamoDBClient, s3Client *s3.Client) *Handler {
	return &Handler{
		DynamoDB: db,
		S3Client: s3Client,
	}
}

func (h Handler) HandleUpdateAssetRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var asset types.Asset
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if err := json.Unmarshal([]byte(request.Body), &asset); err != nil {
		return h.responseBadRequest(headers, err)
	}

	if err := h.updateAsset(ctx, &asset); err != nil {
		return h.responseInternalServerError(headers, err)
	}

	return h.responseUpdatedAsset(headers, &asset)
}

func (h Handler) updateAsset(ctx context.Context, asset *types.Asset) error {
	if err := h.processAssetUpdates(ctx, asset); err != nil {
		return err
	}

	if err := h.updateDynamoDBRecord(ctx, asset); err != nil {
		return err
	}

	return nil
}

func (h Handler) processAssetUpdates(ctx context.Context, asset *types.Asset) error {
	if asset.ImageData != "" {
		if err := processAssetImageUpdate(ctx, asset, h.S3Client); err != nil {
			return err
		}
	}
	if asset.ModelURL != nil {
		if err := processAssetModelUpdate(ctx, asset, h.S3Client); err != nil {
			return err
		}
	}
	return nil
}

func (h Handler) updateDynamoDBRecord(ctx context.Context, asset *types.Asset) error {
	updateBuilder := h.createUpdateBuilder(asset)
	expr, err := wrappers.UpdateExpressionBuilder(updateBuilder)
	if err != nil {
		return err
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       map[string]ddbtypes.AttributeValue{"assetId": &ddbtypes.AttributeValueMemberS{Value: asset.AssetID}},
		TableName:                 aws.String(TABLENAME),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	if _, err = h.DynamoDB.UpdateItem(ctx, input); err != nil {
		return err
	}

	return nil
}

func (h Handler) responseBadRequest(headers map[string]string, err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusBadRequest,
		Headers:    headers,
		Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
	}, nil
}

func (h Handler) responseInternalServerError(headers map[string]string, err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Headers:    headers,
		Body:       fmt.Sprintf("Error during processing: %s", err.Error()),
	}, nil
}

func (h Handler) responseUpdatedAsset(headers map[string]string, asset *types.Asset) (events.APIGatewayProxyResponse, error) {
	updatedAssetJSON, err := json.Marshal(asset)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to serialize updated asset: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(updatedAssetJSON),
	}, nil
}

func processAssetImageUpdate(ctx context.Context, asset *types.Asset, s3Client *s3.Client) error {
	uploader := manager.NewUploader(s3Client)

	decodedData, err := base64.StdEncoding.DecodeString(asset.ImageData)
	if err != nil {
		return fmt.Errorf("Base64 decode error: %w", err)
	}

	_, err = uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String("wingstopdrivenbucket"),
		Key:         aws.String(fmt.Sprintf("assets/%s.jpg", asset.AssetID)),
		Body:        bytes.NewReader(decodedData),
		ContentType: aws.String("image/jpeg"),
	})
	if err != nil {
		return fmt.Errorf("failed to upload image to S3: %w", err)
	}

	asset.ImageData = fmt.Sprintf("https://%s.s3.amazonaws.com/assets/%s.jpg", "wingstopdrivenbucket", asset.AssetID)

	return nil
}

func processAssetModelUpdate(ctx context.Context, asset *types.Asset, s3Client *s3.Client) error {
	uploader := manager.NewUploader(s3Client)

	decodedData, err := base64.StdEncoding.DecodeString(*asset.ModelURL)
	if err != nil {
		return fmt.Errorf("Base64 decode error: %w", err)
	}
	modelID := uuid.NewString()
	asset.ModelID = &modelID

	_, err = uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String("wingstopdrivenbucket"),
		Key:         aws.String(fmt.Sprintf("models/%s.glb", *asset.ModelID)),
		Body:        bytes.NewReader(decodedData),
		ContentType: aws.String("model/gltf-binary"),
	})
	if err != nil {
		return fmt.Errorf("failed to upload model to S3: %w", err)
	}

	modelURL := fmt.Sprintf("https://%s.s3.amazonaws.com/assets/%s.glb", "wingstopdrivenbucket", modelID)
	asset.ModelURL = &modelURL

	return nil
}

func (h Handler) createUpdateBuilder(asset *types.Asset) expression.UpdateBuilder {
	var updateBuilder expression.UpdateBuilder

	if asset.FactoryID != nil {
		updateBuilder = updateBuilder.Set(expression.Name("factoryId"), expression.Value(asset.FactoryID))
	}
	if asset.Name != nil {
		updateBuilder = updateBuilder.Set(expression.Name("name"), expression.Value(asset.Name))
	}
	if asset.ModelID != nil {
		updateBuilder = updateBuilder.Set(expression.Name("modelId"), expression.Value(asset.ModelID))
	}
	if asset.FloorplanID != nil {
		updateBuilder = updateBuilder.Set(expression.Name("floorplanId"), expression.Value(asset.FloorplanID))
	}
	if asset.FloorplanCoords != nil {
		if asset.FloorplanCoords.Longitude != nil {
			updateBuilder = updateBuilder.Set(expression.Name("floorplanCoords.longitude"), expression.Value(*asset.FloorplanCoords.Longitude))
		}
		if asset.FloorplanCoords.Latitude != nil {
			updateBuilder = updateBuilder.Set(expression.Name("floorplanCoords.latitude"), expression.Value(*asset.FloorplanCoords.Latitude))
		}
	}
	if asset.ModelURL != nil {
		updateBuilder = updateBuilder.Set(expression.Name("modelUrl"), expression.Value(asset.ModelURL))
	}
	if asset.Type != nil {
		updateBuilder = updateBuilder.Set(expression.Name("type"), expression.Value(asset.Type))
	}
	if asset.Description != nil {
		updateBuilder = updateBuilder.Set(expression.Name("description"), expression.Value(asset.Description))
	}

	return updateBuilder
}
