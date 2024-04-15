package factories

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
	"wdd/api/internal/types"
)

func NewDeleteFactoryHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleDeleteFactoryRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryID := request.QueryStringParameters["id"]

	if factoryID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Missing factory 'id' in query string parameters.",
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"factoryId": &ddbtypes.AttributeValueMemberS{Value: factoryID},
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
		Body:       fmt.Sprintf("factoryId %s deleted successfully", factoryID),
	}, nil
}
