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

func TestHandleReadFactoryRequest_WithoutId_ScanError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		ScanFunc: func(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB scan error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithoutId_UnmarshalListOfMapsError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		ScanFunc: func(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"factoryId":   &types.AttributeValueMemberS{Value: "Test ID"},
					"name":        &types.AttributeValueMemberS{Value: "Test Name"},
					"description": &types.AttributeValueMemberS{Value: "Test Description"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	originalUnmarshalListOfMaps := FactoryUnmarshalListOfMaps

	defer func() { FactoryUnmarshalListOfMaps = originalUnmarshalListOfMaps }()

	FactoryUnmarshalListOfMaps = func([]map[string]types.AttributeValue, interface{}) error {
		return errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for unmarshalling list of factories in DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithoutId_JSONMarshalError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		ScanFunc: func(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"factoryId":   &types.AttributeValueMemberS{Value: "Test ID"},
					"name":        &types.AttributeValueMemberS{Value: "Test Name"},
					"description": &types.AttributeValueMemberS{Value: "Test Description"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	originalFactoryJSONMarshal := FactoryJSONMarshal

	defer func() { FactoryJSONMarshal = originalFactoryJSONMarshal }()

	FactoryJSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling factory in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithoutId_Success(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		ScanFunc: func(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"factoryId":   &types.AttributeValueMemberS{Value: "Test ID"},
					"name":        &types.AttributeValueMemberS{Value: "Test Name"},
					"description": &types.AttributeValueMemberS{Value: "Test Description"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read without id, got %d", http.StatusOK, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithId_GetItemError(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		GetItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB get item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithId_Success(t *testing.T) {
	mockDB := &MockDynamoDBClient{
		GetItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			item := map[string]types.AttributeValue{
				"factoryId":   &types.AttributeValueMemberS{Value: "1"},
				"name":        &types.AttributeValueMemberS{Value: "Factory 1"},
				"description": &types.AttributeValueMemberS{Value: "Description 1"},
			}
			return &dynamodb.GetItemOutput{Item: item}, nil
		},
	}

	handler := NewReadFactoryHandler(mockDB)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read with id, got %d", http.StatusOK, response.StatusCode)
	}
}
