package measurements

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

func TestHandleUpdateMeasurementRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":"invalid","generatorFunction": "Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateMeasurementRequest_UpdateExpressionBuilderError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewUpdateMeasurementHandler(mockDDBClient)

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder

	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"measurementId": "1", "frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for building update expression, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateMeasurementRequest_UpdateItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewUpdateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"measurementId": "1", "frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for DynamoDB update item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateMeasurementRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	handler := NewUpdateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"measurementId": "1", "frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusOK, response.StatusCode)
	}
}
