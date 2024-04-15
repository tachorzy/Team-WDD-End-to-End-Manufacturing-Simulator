package properties

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

func NewReadPropetyHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadPropertyRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	PropertyID := request.QueryStringParameters["id"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if PropertyID == "" {
		input := &dynamodb.ScanInput{
			TableName: aws.String(TABLENAME),
		}
		result, err := h.DynamoDB.Scan(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error fetching properties: %s", err),
			}, nil
		}
		var properties []types.Property
		if err = wrappers.UnmarshalListOfMaps(result.Items, &properties); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error unmarshalling results: %s", err),
			}, nil
		}

		propertiesJSON, err := wrappers.JSONMarshal(properties)
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
			Body:       string(propertiesJSON),
		}, nil
	}
	key := map[string]ddbtypes.AttributeValue{
		"propertyId": &ddbtypes.AttributeValueMemberS{Value: PropertyID},
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
			Body:       fmt.Sprintf("Error fetching properties: %s", err),
		}, nil
	}
	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Property with ID %s not found", PropertyID),
		}, nil
	}
	var property types.Property
	if err = wrappers.UnmarshalMap(result.Item, &property); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error unmarshalling results: %s", err),
		}, nil
	}
	propertyJSON, err := wrappers.JSONMarshal(property)
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
		Body:       string(propertyJSON),
	}, nil
}
