package attributes

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

func NewCreateAttributeHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h *Handler) HandleCreateAttributeRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var attribute types.Attribute

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
	if err := wrappers.JSONUnmarshal([]byte(request.Body), &attribute); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}
	attribute.AttributeID = uuid.NewString()

	av, error := wrappers.MarshalMap(attribute)
	if error != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling attribute: %s", error.Error()),
		}, nil
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(TABLENAME),
	}

	if _, err := h.DynamoDB.PutItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error inserting attribute: %s", err.Error()),
		}, nil
	}
	responseBody, err := wrappers.JSONMarshal(attribute)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling asset: %s", err.Error()),
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusCreated,
		Headers:    headers,
		Body:       string(responseBody),
	}, nil

}
