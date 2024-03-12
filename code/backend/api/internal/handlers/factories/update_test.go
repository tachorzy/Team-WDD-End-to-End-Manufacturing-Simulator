package factories

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"net/http"
	"testing"
)

func TestHandleUpdateFactoryRequest_BadJSON(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}

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
	mockDDBClient := &MockDynamoDBClient{}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	originalUpdateExpressionBuilder := UpdateExpressionBuilder

	defer func() { UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
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
		t.Errorf("Expected StatusCode %d for , got %d", http.StatusInternalServerError, response.StatusCode)
	}
}
