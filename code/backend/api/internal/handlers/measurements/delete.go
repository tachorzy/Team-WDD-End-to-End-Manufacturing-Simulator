package measurements

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

func NewDeleteMeasurementHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleDeleteMeasurementRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	measurementID := request.QueryStringParameters["id"]

	if measurementID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Missing measurement 'id' in query string parameters.",
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"measurementId": &ddbtypes.AttributeValueMemberS{Value: measurementID},
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
		Body:       fmt.Sprintf("measurementId %s deleted successfully", measurementID),
	}, nil
}
