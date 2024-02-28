package factories

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
)

func NewDeleteFactoryHandler(db DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleDeleteRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryId := request.QueryStringParameters["id"]

	if factoryId == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Missing factory 'id' in query string parameters.",
		}, nil
	}

	key := map[string]types.AttributeValue{
		"factoryId": &types.AttributeValueMemberS{Value: factoryId},
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
		Body:       fmt.Sprintf("factoryId %s deleted successfully", factoryId),
	}, nil
}
