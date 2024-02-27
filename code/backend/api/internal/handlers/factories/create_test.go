package factories

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"testing"
)

type MockDynamoDBClient struct {
	PutItemFunc func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
}

func (m *MockDynamoDBClient) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	if m.PutItemFunc != nil {
		return m.PutItemFunc(ctx, params, optFns...)
	}
	return nil, errors.New("PutItem method not implemented")
}

func TestHandleCreateRequest_BadJSON(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}

	handler := NewCreateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Name", "location": "Invalid", "description":"Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != 400 {
		t.Errorf("Expected StatusCode 400 for bad JSON, got %d", response.StatusCode)
	}
}

func TestHandleCreateRequest_DynamoDBPutItemError(t *testing.T) {
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
	response, err := handler.HandleCreateRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != 500 {
		t.Errorf("Expected StatusCode 500 for DynamoDB put item error, got %d", response.StatusCode)
	}

	expectedBodyPrefix := "Error putting item into DynamoDB"
	if response.Body[:len(expectedBodyPrefix)] != expectedBodyPrefix {
		t.Errorf("Expected error message to start with '%s', got '%s'", expectedBodyPrefix, response.Body)
	}
}

func TestHandleCreateRequest_Success(t *testing.T) {
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
	response, err := handler.HandleCreateRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != 200 {
		t.Errorf("Expected StatusCode 200 for successful creation, got %d", response.StatusCode)
	}
}
