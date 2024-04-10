package factories

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"
)

func TestHandleUpdateFactoryRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Name", "location": "Invalid", "description":"Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateFactoryRequest_UpdateExpressionBuilderError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder

	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"factoryId": "1", "name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for building update expression, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateFactoryRequest_UpdateItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"factoryId": "1", "name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for DynamoDB update item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateFactoryRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"factoryId": "1", "name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusOK, response.StatusCode)
	}
}
