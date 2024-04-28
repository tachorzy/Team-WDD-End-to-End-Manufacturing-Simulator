package propertiesdata

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"wdd/api/internal/wrappers"

	"wdd/api/internal/types"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewReadPropertyDataHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}
func (h Handler) HandleReadPropertyDataRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	PropertyID := request.QueryStringParameters["id"]
	ModelID := request.QueryStringParameters["modelId"]
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
	if PropertyID == "" && ModelID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       "Required parameters are missing",
		}, nil
	} else if PropertyID != "" {
		return h.handlePropertyDataById(ctx, PropertyID, headers)
	} else if ModelID != "" {
		return h.handlePropertyDataByModelId(ctx, ModelID, headers)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusBadRequest,
		Headers:    headers,
		Body:       "Invalid parameters",
	}, nil

}
func (h Handler) handlePropertyDataById(ctx context.Context, PropertyID string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(TABLENAME),
		KeyConditionExpression: aws.String("propertyId = :propertyId"),
		ExpressionAttributeValues: map[string]ddbtypes.AttributeValue{
			":propertyId": &ddbtypes.AttributeValueMemberS{Value: PropertyID},
		},
	}
	result, reserr := h.DynamoDB.Query(ctx, input)
	if reserr != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error querying database: %v", reserr),
		}, nil
	}
	return processQueryResult(result, headers)
}
func (h Handler) handlePropertyDataByModelId(ctx context.Context, ModelID string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(PROPERTYTABLE),
		IndexName:              aws.String("ModelIdIndex"),
		KeyConditionExpression: aws.String("modelId = :modelId"),
		ExpressionAttributeValues: map[string]ddbtypes.AttributeValue{
			":modelId": &ddbtypes.AttributeValueMemberS{Value: ModelID},
		},
	}
	result, err := h.DynamoDB.Query(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error querying database: %v", err),
		}, nil
	}
	if len(result.Items) == 0 {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       "No properties found for the given model ID",
		}, nil
	}

	propertyIds := make([]string, 0)
	for _, item := range result.Items {
		propertyId := item["propertyId"].(*ddbtypes.AttributeValueMemberS).Value
		propertyIds = append(propertyIds, propertyId)
	}
	propertyDatas := make([]types.PropertyData, 0)
	for _, propertyId := range propertyIds {
		dataInput := &dynamodb.GetItemInput{
			TableName: aws.String(TABLENAME),
			Key: map[string]ddbtypes.AttributeValue{
				"propertyId": &ddbtypes.AttributeValueMemberS{Value: propertyId},
			},
		}
		dataResult, reserr := h.DynamoDB.GetItem(ctx, dataInput)
		if reserr != nil {
			log.Printf("Error retrieving property data for ID %s: %v", propertyId, reserr)
			continue
		}
		var propertyData types.PropertyData
		if propdataerr := wrappers.UnmarshalMap(dataResult.Item, &propertyData); propdataerr != nil {
			log.Printf("Error unmarshalling property data for ID %s: %v", propertyId, propdataerr)
			continue
		}
		propertyDatas = append(propertyDatas, propertyData)
	}
	propertyDatasJson, err := wrappers.JSONMarshal(propertyDatas)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling data: %v", err),
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(propertyDatasJson),
	}, nil
}

func processQueryResult(result *dynamodb.QueryOutput, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	if len(result.Items) == 0 {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       "No data found",
		}, nil

	}
	var propertyData []types.PropertyData
	if err := wrappers.UnmarshalListOfMaps(result.Items, &propertyData); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error unmarshalling data: %v", err),
		}, nil
	}
	propertyDataJson, err := wrappers.JSONMarshal(propertyData)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling data: %v", err),
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(propertyDataJson),
	}, nil
}
