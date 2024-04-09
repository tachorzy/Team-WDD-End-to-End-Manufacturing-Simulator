package floorplan

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

func NewReadFloorPlanHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadFloorPlanRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	floorplanID := request.QueryStringParameters["id"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if floorplanID == "" {
		input := &dynamodb.ScanInput{
			TableName: aws.String(TABLENAME),
		}
		result, err := h.DynamoDB.Scan(ctx, input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Error fetching floorplans: %s", err),
			}, nil
		}

		var floorplans []Floorplan
		if err = FloorPlanUnmarshalListOfMaps(result.Items, &floorplans); err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Headers:    headers,
				Body:       fmt.Sprintf("Failed to unmarshal floorplans: %v", err),
			}, nil
		}

		floorplansJSON, err := FloorPlanJSONMarshal(floorplans)
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
			Body:       string(floorplansJSON),
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"floorplanId": &ddbtypes.AttributeValueMemberS{Value: floorplanID},
	}

	input := &dynamodb.GetItemInput{
		TableName: aws.String("Floorplan"),
		Key:       key,
	}

	result, err := h.DynamoDB.GetItem(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error finding floorplan: %s", err),
		}, nil
	}

	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Floorplan with ID %s not found", floorplanID),
		}, nil
	}

	var floorplan Floorplan
	if err = FloorPlanUnmarshalMap(result.Item, &floorplan); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to unmarshal floorplan, %v", err),
		}, nil
	}

	floorplanJSON, err := FloorPlanJSONMarshal(floorplan)
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
		Body:       string(floorplanJSON),
	}, nil
}
