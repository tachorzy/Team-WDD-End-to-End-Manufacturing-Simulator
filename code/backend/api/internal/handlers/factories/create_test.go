package factories

//nolint:all
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

func TestHandleCreateFactoryRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

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
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_MarshalMapError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewCreateFactoryHandler(mockDDBClient)

	originalMarshalMap := wrappers.MarshalMap

	defer func() { wrappers.MarshalMap = originalMarshalMap }()

	wrappers.MarshalMap = func(interface{}) (map[string]types.AttributeValue, error) {
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
		t.Errorf("Expected status code %d for marshalling factory to DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_PutItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
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
		t.Errorf("Expected status code %d for DynamoDB put item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	handler := NewCreateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Test Factory","location":{"longitude":10,"latitude":20},"description":"Test Description"}`,
	}

	originalFactoryJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalFactoryJSONMarshal }()

	wrappers.JSONMarshal = func(_ interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	ctx := context.Background()
	response, err := handler.HandleCreateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling factory in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateFactoryRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
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
		t.Errorf("Expected status code %d for successful creation, got %d", http.StatusOK, response.StatusCode)
	}
}
