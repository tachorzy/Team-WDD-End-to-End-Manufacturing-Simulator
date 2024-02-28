package factories

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
	"testing"
)

func TestHandleCreateFactoryRequest_BadJSON(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}

	handler := NewCreateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Name", "location": "Invalid", "description":"Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_MarshalMapError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}

	handler := NewCreateFactoryHandler(mockDDBClient)

	originalMarshalMap := FactoryMarshalMap

	defer func() { FactoryMarshalMap = originalMarshalMap }()

	FactoryMarshalMap = func(interface{}) (map[string]types.AttributeValue, error) {
		return nil, errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for marshalling factory to DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_DynamoDBPutItemError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewCreateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for DynamoDB put item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_Success(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		PutItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful creation, got %d", http.StatusOK, response.StatusCode)
	}
}
