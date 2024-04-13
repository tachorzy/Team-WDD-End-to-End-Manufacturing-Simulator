package assets

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
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
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"assetId": &ddbtypes.AttributeValueMemberS{Value: asset.AssetID},
	}

	// Update the image if it's provided
	if asset.ImageData != "" {
		if err := processAssetImageUpdate(ctx, &asset, h.S3Client); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error updating image: %s", err.Error()),
			}, nil
		}
	}
	if asset.ModelURL != nil {
		if err := processAssetModelUpdate(ctx, &asset, h.S3Client); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error updating model: %s", err.Error()),
			}, nil
		}
	}

	asset.DateCreated = time.Now().Format(time.RFC3339)

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

	expr, err := wrappers.UpdateExpressionBuilder(updateBuilder)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to build update expression: %s", err.Error()),
		}, nil
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       key,
		TableName:                 aws.String(TABLENAME),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	if _, err = h.DynamoDB.UpdateItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error updating item into DynamoDB: %s", err.Error()),
		}, nil
	}

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
