package factories

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"net/http"
	"testing"
)

func TestHandleDeleteFactoryRequest_MissingFactoryId(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}
	handler := NewDeleteFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for missing factoryId, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleDeleteFactoryRequest_ErrorDeletingItem(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		DeleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return nil, errors.New("mock DynamoDB error")
		},
	}
	handler := NewDeleteFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "testID",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleDeleteFactoryRequest_Success(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		DeleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return &dynamodb.DeleteItemOutput{}, nil
		},
	}
	handler := NewDeleteFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "someFactoryId",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful deletion, got %d", http.StatusOK, response.StatusCode)
	}
}
