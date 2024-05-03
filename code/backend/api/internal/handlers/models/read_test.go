package models

//nolint:all
import (
	"context"
	"errors"
	"net/http"
	"strings"
	"testing"
	"wdd/api/internal/wrappers"

	"wdd/api/internal/mocks"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func ValidQueryItems() []map[string]types.AttributeValue {
	return []map[string]types.AttributeValue{
		{
			"modelId":     &types.AttributeValueMemberS{Value: "model1"},
			"factoryId":   &types.AttributeValueMemberS{Value: "test123"},
			"dateCreated": &types.AttributeValueMemberS{Value: "2021-07-15"},
			"attributes":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Size"}, &types.AttributeValueMemberS{Value: "Color"}}},
			"properties":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Property1"}, &types.AttributeValueMemberS{Value: "Property2"}}},
		},
		{
			"modelId":     &types.AttributeValueMemberS{Value: "model2"},
			"factoryId":   &types.AttributeValueMemberS{Value: "factory123"},
			"dateCreated": &types.AttributeValueMemberS{Value: "2022-01-01"},
			"attributes":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Weight"}, &types.AttributeValueMemberS{Value: "Material"}}},
			"properties":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Property3"}, &types.AttributeValueMemberS{Value: "Property4"}}},
		},
	}
}

func TestHandleReadModelRequest_Success(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)
	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "model123"},
	}

	mockDDBClient.QueryFunc = func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
		items := []map[string]types.AttributeValue{
			{
				"modelId":     &types.AttributeValueMemberS{Value: "model123"},
				"factoryId":   &types.AttributeValueMemberS{Value: "factory1"},
				"dateCreated": &types.AttributeValueMemberS{Value: "2021-07-15"},
				"attributes":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Size"}, &types.AttributeValueMemberS{Value: "Color"}}},
				"properties":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Property1"}, &types.AttributeValueMemberS{Value: "Property2"}}},
			},
		}
		return &dynamodb.QueryOutput{Items: items}, nil
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected HTTP status 200, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "model123") {
		t.Errorf("Expected response body to contain 'model123'")
	}
}

func TestHandleReadModelRequest_MissingParameters(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)
	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected HTTP status 400 for missing parameters, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "Required parameters are missing") {
		t.Errorf("Expected error message about missing parameters in response body")
	}
}

func TestHandleReadModelRequest_DynamoDBQueryError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return nil, errors.New("Error querying model by ID")
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "model123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error from the handler, got %v", err)
	}
	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected HTTP status 500 due to DynamoDB error, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "Error querying model by ID") {
		t.Errorf("Expected DynamoDB error message in response body")
	}
}

func TestHandleReadModelRequest_UnmarshalListOfMapsError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: ValidQueryItems()}, nil
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	originalUnmarshalListOfMaps := wrappers.UnmarshalListOfMaps

	defer func() { wrappers.UnmarshalListOfMaps = originalUnmarshalListOfMaps }()

	wrappers.UnmarshalListOfMaps = func([]map[string]types.AttributeValue, interface{}) error {
		return errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for unmarshalling list of models in DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadModelRequest_JSONMarshal(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: ValidQueryItems()}, nil
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	originalFactoryJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalFactoryJSONMarshal }()

	wrappers.JSONMarshal = func(_ interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling model in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadModelRequest_WithFactoryID_Success(t *testing.T) {
	t.SkipNow()
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: ValidQueryItems()}, nil
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error to be returned")
	}
	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected HTTP status 200 for successful data retrieval, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "model1") {
		t.Errorf("Expected data to include model information for model1")
	}
}

func TestHandleReadModelRequest_WithFactoryID_DynamoDBError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}
	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected HTTP status 500 for a DynamoDB error, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "Error querying models by factory ID") {
		t.Errorf("Expected error message about DynamoDB failure in response body")
	}
}

func TestHandleReadModelRequest_WithFactoryID_NoModelsFound(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(_ context.Context, _ *dynamodb.QueryInput, _ ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: []map[string]types.AttributeValue{}}, nil
		},
	}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}
	if response.StatusCode != http.StatusNotFound {
		t.Errorf("Expected HTTP status 404 for no models found, got %d", response.StatusCode)
	}
	if !strings.Contains(response.Body, "No models found") {
		t.Errorf("Expected 'No models found' message in response body")
	}
}
