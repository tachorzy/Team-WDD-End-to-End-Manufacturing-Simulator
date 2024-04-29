package measurements

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

func TestHandleCreateMeasurementRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewCreateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":"1.0", "generatorFunction": "Function 1", "lowerBound":"0.0", "upperBound":"10.0", "precision":"0.1"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleCreateMeasurementRequest_MarshalMapError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewCreateMeasurementHandler(mockDDBClient)

	originalMarshalMap := wrappers.MarshalMap

	defer func() { wrappers.MarshalMap = originalMarshalMap }()

	wrappers.MarshalMap = func(interface{}) (map[string]types.AttributeValue, error) {
		return nil, errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for marshalling measurement to DynamoDB format, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleCreateMeasurementRequest_PutItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewCreateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB put item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateMeasurementRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":"cairo","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	originalJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalJSONMarshal }()

	wrappers.JSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	ctx := context.Background()
	response, err := handler.HandleCreateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling measurement in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateMeasurementRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"frequency":1.0,"generatorFunction":"Function 1","lowerBound":0.0,"upperBound":10.0,"precision":0.1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful creation, got %d", http.StatusOK, response.StatusCode)
	}
}
