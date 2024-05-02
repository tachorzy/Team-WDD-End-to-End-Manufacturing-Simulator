package models

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func TestHandleUpdateModelRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"modelId": "test", "factoryId": "test", "attributes": "invalid", "properties": "invalid", "measurements": "invalid"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateModelRequest_UpdateExpressionBuilderError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateModelHandler(mockDDBClient)

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder

	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"modelId": "test", "factoryId": "test", "attributes": ["attribute1"], "properties": ["property1"], "measurements": ["measurement1"]}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for building update expression, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateModelRequest_UpdateItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewUpdateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"modelId": "test", "factoryId": "test", "attributes": ["attribute1"], "properties": ["property1"], "measurements": ["measurement1"]}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for DynamoDB update item error, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateModelRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	handler := NewUpdateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"modelId": "test", "factoryId": "test", "attributes": ["attribute1"], "properties": ["property1"], "measurements": ["measurement1"]}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusBadRequest, response.StatusCode)
	}
}
