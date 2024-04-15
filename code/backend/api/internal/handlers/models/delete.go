package models

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/types"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewDeleteModelHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleDeleteModelRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	modelID := request.QueryStringParameters["id"]

	if modelID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Missing model 'id' in query string parameters.",
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"modelId": &ddbtypes.AttributeValueMemberS{Value: modelID},
	}

	input := &dynamodb.DeleteItemInput{
		TableName: aws.String(TABLENAME),
		Key:       key,
	}

	if _, err := h.DynamoDB.DeleteItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error deleting item in DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       fmt.Sprintf("modelId %s deleted successfully", modelID),
	}, nil
}
