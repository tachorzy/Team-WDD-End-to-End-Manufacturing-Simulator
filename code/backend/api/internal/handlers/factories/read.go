package factories

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
)

func NewReadFactoryHandler(db DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

var FactoryUnmarshalListOfMaps = attributevalue.UnmarshalListOfMaps
var FactoryUnmarshalMap = attributevalue.UnmarshalMap
var FactoryJSONMarshal = json.Marshal

func (h Handler) HandleReadFactoryRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryId := request.QueryStringParameters["id"]

	if factoryId == "" {
		input := &dynamodb.ScanInput{
			TableName: aws.String("Factory"),
		}
		result, err := h.DynamoDB.Scan(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       fmt.Sprintf("Error fetching factories: %s", err),
			}, nil
		}

		var factories []Factory
		if err := FactoryUnmarshalListOfMaps(result.Items, &factories); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       fmt.Sprintf("Failed to unmarshal factories: %v", err),
			}, nil
		}

		factoriesJSON, err := FactoryJSONMarshal(factories)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       fmt.Sprintf("Error marshalling response: %s", err),
			}, nil
		}

		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusOK,
			Body:       string(factoriesJSON),
		}, nil
	}

	key := map[string]types.AttributeValue{
		"factoryId": &types.AttributeValueMemberS{Value: factoryId},
	}

	input := &dynamodb.GetItemInput{
		TableName: aws.String("Factory"),
		Key:       key,
	}

	result, err := h.DynamoDB.GetItem(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error finding factory: %s", err),
		}, nil
	}

	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Body:       fmt.Sprintf("Factory with ID %s not found", factoryId),
		}, nil
	}

	var factory Factory
	if err := FactoryUnmarshalMap(result.Item, &factory); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Failed to unmarshal Record, %v", err),
		}, nil
	}

	factoryJSON, err := FactoryJSONMarshal(factory)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error marshalling response: %s", err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(factoryJSON),
	}, nil
}
