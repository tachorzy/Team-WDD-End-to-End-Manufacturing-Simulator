package models

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestHandleCreateModel_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewCreateModelHandler(mockDDBClient)
	request := events.APIGatewayProxyRequest{
		Body: `{
			"modelId":123,
			 "factoryId":456, 
			 "dateCreated":"2024-04-25T14:48:00Z",
			  "attributes":["blah", "blah", "idk"}},
			   "properties"}`,
	}
	ctx := context.Background()
	response, err := handler.HandleCreateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}
func TestHandleCreateModelRequest_MarshalMapError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewCreateModelHandler(mockDDBClient)

	originalMarshalMap := wrappers.MarshalMap

	defer func() { wrappers.MarshalMap = originalMarshalMap }()

	wrappers.MarshalMap = func(interface{}) (map[string]types.AttributeValue, error) {
		return nil, errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{
            "modelId": "test-id",
            "factoryId": "factory-id",
            "dateCreated": "2024-04-25T14:48:00Z",
            "attributes": ["Size", "Color", "Weight"],
            "properties": ["Property1", "Property2"]
        }`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling model to DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateModelRequest_PutItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewCreateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{
		    "modelId": "unique-id",
		    "factoryId": "factory-id",
		    "dateCreated": "2021-10-01T12:00:00Z",
		    "attributes": ["Size", "Color"],
		    "properties": ["Durability", "Design"]
		}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB put item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateModelRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{
		    "modelId": "unique-id",
		    "factoryId": "factory-id",
		    "dateCreated": "2021-10-01T12:00:00Z",
		    "attributes": ["Size", "Color"],
		    "properties": ["Durability", "Design"]
		}`,
	}

	originalModelJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalModelJSONMarshal }()

	wrappers.JSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	ctx := context.Background()
	response, err := handler.HandleCreateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling model in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateModelRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{
		    "modelId": "unique-id",
		    "factoryId": "factory-id",
		    "dateCreated": "2021-10-01T12:00:00Z",
		    "attributes": ["Size", "Color"],
		    "properties": ["Durability", "Design"]
		}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful creation, got %d", http.StatusOK, response.StatusCode)
	}
}
