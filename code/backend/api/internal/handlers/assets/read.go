package assets

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewReadFactoryAssetsHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadFactoryAssetsRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryID := request.QueryStringParameters["factoryId"]
	assetID := request.QueryStringParameters["assetId"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	var input *dynamodb.QueryInput
	if factoryID != "" {
		input = &dynamodb.QueryInput{
			TableName:              aws.String(TABLENAME),
			IndexName:              aws.String("FactoryIndex"),
			KeyConditionExpression: aws.String("factoryId = :factoryId"),
			ExpressionAttributeValues: map[string]ddbtypes.AttributeValue{
				":factoryId": &ddbtypes.AttributeValueMemberS{Value: factoryID},
			},
		}
	} else if assetID != "" {
		input = &dynamodb.QueryInput{
			TableName:              aws.String(TABLENAME),
			KeyConditionExpression: aws.String("assetId = :assetId"),
			ExpressionAttributeValues: map[string]ddbtypes.AttributeValue{
				":assetId": &ddbtypes.AttributeValueMemberS{Value: assetID},
			},
		}
	} else {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       "Missing factoryId or assetId query parameter",
		}, nil
	}

	result, err := h.DynamoDB.Query(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error querying assets: %s", err),
		}, nil
	}

	var assets []types.Asset
	err = wrappers.UnmarshalListOfMaps(result.Items, &assets)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to unmarshal assets: %v", err),
		}, nil
	}

	assetsJSON, err := wrappers.JSONMarshal(assets)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling response: %s", err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(assetsJSON),
	}, nil
}
