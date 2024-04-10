package models

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewUpdateModelHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleUpdateModelRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var model types.Model
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if err := json.Unmarshal([]byte(request.Body), &model); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	key := map[string]ddbtypes.AttributeValue{
		"modelId": &ddbtypes.AttributeValueMemberS{Value: model.ModelID},
	}

	var updateBuilder expression.UpdateBuilder

	if model.Attributes != nil {
		// Dereference the pointer to access the underlying slice
		for _, attr := range *model.Attributes {
			updateBuilder = updateBuilder.Add(expression.Name("attributes"), expression.Value(attr))
		}
	}

	if model.Properties != nil {
		for _, prop := range *model.Properties {
			updateBuilder = updateBuilder.Add(expression.Name("properties"), expression.Value(prop))
		}
	}

	expr, err := wrappers.UpdateExpressionBuilder(updateBuilder)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Failed to build update expression: %s", err.Error()),
		}, nil
	}

	input := &dynamodb.UpdateItemInput{
		Key:                       key,
		TableName:                 aws.String(TABLENAME),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		UpdateExpression:          expr.Update(),
	}

	if _, err = h.DynamoDB.UpdateItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error updating item into DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       fmt.Sprintf("Model with ID %s updated successfully", model.ModelID),
	}, nil
}
