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

func TestHandleRequest_BadJSON(t *testing.T) {
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
