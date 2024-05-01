package properties

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

func TestHandleUpdatePropertyRequest_BadJSON(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdatePropertyHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"propertyId": "1", "measurementId":"1", "name":"test", "value":"invalid", "unit":"feet"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdatePropertyRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdatePropertyRequest_UpdateExpressionBuilderError(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdatePropertyHandler(mockDDBClient)

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder

	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"propertyId": "1", "measurementId":"1", "name":"test", "value":1.0, "unit":"feet"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdatePropertyRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for building update expression, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdatePropertyRequest_UpdateItemError(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewUpdatePropertyHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"propertyId": "1", "measurementId":"1", "name":"test", "value":1.0, "unit":"feet"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdatePropertyRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for DynamoDB update item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdatePropertyRequest_Success(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	handler := NewUpdatePropertyHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"propertyId": "1", "measurementId":"1", "name":"test", "value":1.0, "unit":"feet"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdatePropertyRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusOK, response.StatusCode)
	}
}
