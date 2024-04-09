package factories

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"wdd/api/internal/types"
)

func NewReadFactoryHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadFactoryRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryID := request.QueryStringParameters["id"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if factoryID == "" {
		input := &dynamodb.ScanInput{
			TableName: aws.String(TABLENAME),
		}
		result, err := h.DynamoDB.Scan(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error fetching factories: %s", err),
			}, nil
		}

		var factories []types.Factory
		if err = FactoryUnmarshalListOfMaps(result.Items, &factories); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Failed to unmarshal factories: %v", err),
			}, nil
		}

		factoriesJSON, err := FactoryJSONMarshal(factories)
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
			Body:       string(factoriesJSON),
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"factoryId": &ddbtypes.AttributeValueMemberS{Value: factoryID},
	}

	input := &dynamodb.GetItemInput{
		TableName: aws.String("Factory"),
		Key:       key,
	}

	result, err := h.DynamoDB.GetItem(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error finding factory: %s", err),
		}, nil
	}

	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Factory with ID %s not found", factoryID),
		}, nil
	}

	var factory types.Factory
	if err = FactoryUnmarshalMap(result.Item, &factory); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to unmarshal Record, %v", err),
		}, nil
	}

	factoryJSON, err := FactoryJSONMarshal(factory)
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
		Body:       string(factoryJSON),
	}, nil
}
