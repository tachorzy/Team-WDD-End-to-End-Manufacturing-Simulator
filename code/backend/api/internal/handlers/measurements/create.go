package measurements

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func NewCreateMeasurementHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleCreateMeasurementRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var measurement types.Measurement

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if err := wrappers.JSONUnmarshal([]byte(request.Body), &measurement); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error unmarshalling: %v", err),
		}, nil
	}

	av, err := wrappers.MarshalMap(measurement)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling: %v", err),
		}, nil
	}
	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(TABLENAME),
	}
	if _, err = h.DynamoDB.PutItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error inserting item: %v", err),
		}, nil
	}
	responseBody, err := json.Marshal(measurement)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling: %v", err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(responseBody),
	}, nil
}
