package assets

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewUpdateAssetHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleUpdateAssetRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var asset types.Asset
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if err := wrappers.JSONUnmarshal([]byte(request.Body), &asset); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"assetId": &ddbtypes.AttributeValueMemberS{Value: asset.AssetID},
	}

	var updateBuilder expression.UpdateBuilder

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

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       fmt.Sprintf("Asset with ID %s updated successfully", asset.AssetID),
	}, nil
}
