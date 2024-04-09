package assets

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"wdd/api/internal/types"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewReadFactoryAssetHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadAssetsByFactoryRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryID := request.QueryStringParameters["factoryId"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if factoryID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       "Missing factoryId query parameter",
		}, nil
	}

	input := &dynamodb.QueryInput{
		TableName:              aws.String(TABLENAME),
		IndexName:              aws.String("factoryId"),
		KeyConditionExpression: aws.String("factoryId = :factoryId"),
		ExpressionAttributeValues: map[string]ddbtypes.AttributeValue{
			":factoryId": &ddbtypes.AttributeValueMemberS{Value: factoryID},
		},
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
	err = AssetUnmarshalListOfMaps(result.Items, &assets)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to unmarshal assets: %v", err),
		}, nil
	}

	assetsJSON, err := json.Marshal(assets)
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
