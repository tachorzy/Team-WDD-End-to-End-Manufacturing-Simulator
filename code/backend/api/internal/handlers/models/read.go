package models

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

func NewReadModelHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadModelRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	ModelID := request.QueryStringParameters["id"]
	factoryID := request.QueryStringParameters["factoryId"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if ModelID != "" {
		key := map[string]ddbtypes.AttributeValue{
			"modelId": &ddbtypes.AttributeValueMemberS{Value: ModelID},
		}
		input := &dynamodb.GetItemInput{
			TableName: aws.String(TABLENAME),
			Key:       key,
		}
		result, err := h.DynamoDB.GetItem(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error fetching model: %s", err),
			}, nil
		}
		if result.Item == nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusNotFound,
				Headers:    headers,
				Body:       fmt.Sprintf("Model with ID %s not found", ModelID),
			}, nil
		}
		var model types.Model
		if err = wrappers.UnmarshalMap(result.Item, &model); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error unmarshalling model: %s", err),
			}, nil
		}
		modelJSON, err := wrappers.JSONMarshal(model)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error marshalling model: %s", err),
			}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusOK,
			Headers:    headers,
			Body:       string(modelJSON),
		}, nil
	} else if factoryID != "" {
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
				Body:       fmt.Sprintf("Error querying models by factory ID: %s", err),
			}, nil
		}
		var models []types.Model
		if err = wrappers.UnmarshalListOfMaps(result.Items, &models); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error unmarshalling results: %s", err),
			}, nil
		}
		modelsJSON, err := wrappers.JSONMarshal(models)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error marshalling results: %s", err),
			}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusOK,
			Headers:    headers,
			Body:       string(modelsJSON),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusBadRequest,
		Headers:    headers,
		Body:       "Required parameters are missing",
	}, nil
}
