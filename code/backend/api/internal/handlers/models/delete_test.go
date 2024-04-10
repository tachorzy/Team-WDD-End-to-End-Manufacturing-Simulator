package models

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
)

func TestHandleDeleteModelRequest_MissingFactoryId(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewDeleteModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for missing modelId, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleDeleteModelRequest_DeleteItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return nil, errors.New("mock DynamoDB error")
		},
	}
	handler := NewDeleteModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "testID",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleDeleteModelRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return &dynamodb.DeleteItemOutput{}, nil
		},
	}
	handler := NewDeleteModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "someFactoryId",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful deletion, got %d", http.StatusOK, response.StatusCode)
	}
}
