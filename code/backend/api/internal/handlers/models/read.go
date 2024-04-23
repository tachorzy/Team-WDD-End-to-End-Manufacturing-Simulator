package models

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/wrappers"

	"wdd/api/internal/types"

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

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if ModelID == "" {
		input := &dynamodb.ScanInput{
			TableName: aws.String(TABLENAME),
		}
		result, err := h.DynamoDB.Scan(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error fetching models: %s", err),
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
			Body:       fmt.Sprintf("Error fetching models: %s", err),
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
			Body:       fmt.Sprintf("Error unmarshalling results: %s", err),
		}, nil
	}
	modelJSON, err := wrappers.JSONMarshal(model)
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
		Body:       string(modelJSON),
	}, nil
}
