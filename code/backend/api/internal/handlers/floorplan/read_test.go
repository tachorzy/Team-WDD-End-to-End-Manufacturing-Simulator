package floorplan

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

func TestHandleReadFloorPlanRequest_WithoutId_ScanError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		ScanFunc: func(_ context.Context, _ *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB scan error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithoutId_UnmarshalListOfMapsError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		ScanFunc: func(_ context.Context, _ *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"floorplanId": &types.AttributeValueMemberS{Value: "Test ID"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	originalUnmarshalListOfMaps := wrappers.UnmarshalListOfMaps

	defer func() { wrappers.UnmarshalListOfMaps = originalUnmarshalListOfMaps }()

	wrappers.UnmarshalListOfMaps = func([]map[string]types.AttributeValue, interface{}) error {
		return errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for unmarshalling list of floorplans in DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithoutId_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		ScanFunc: func(_ context.Context, _ *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"floorplanId": &types.AttributeValueMemberS{Value: "Test ID"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	originalFactoryJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalFactoryJSONMarshal }()

	wrappers.JSONMarshal = func(_ interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling floorplan in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithoutId_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		ScanFunc: func(_ context.Context, _ *dynamodb.ScanInput, _ ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"factoryId": &types.AttributeValueMemberS{Value: "Test ID"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read without id, got %d", http.StatusOK, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithId_GetItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		GetItemFunc: func(_ context.Context, _ *dynamodb.GetItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB get item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithId_ItemNotFound(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		GetItemFunc: func(_ context.Context, _ *dynamodb.GetItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: nil,
			}, nil
		},
	}

	handler := NewReadFloorPlanHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusNotFound {
		t.Errorf("Expected status code %d for DynamoDb get item not found, got %d", http.StatusNotFound, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithId_UnmarshalMapError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		GetItemFunc: func(_ context.Context, _ *dynamodb.GetItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			item := map[string]types.AttributeValue{
				"floorplanId": &types.AttributeValueMemberS{Value: "1"},
			}
			return &dynamodb.GetItemOutput{Item: item}, nil
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	originalFactoryUnmarshalMap := wrappers.UnmarshalMap

	defer func() { wrappers.UnmarshalMap = originalFactoryUnmarshalMap }()

	wrappers.UnmarshalMap = func(map[string]types.AttributeValue, interface{}) error {
		return errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for unmarshalling floorplan from DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithId_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		GetItemFunc: func(_ context.Context, _ *dynamodb.GetItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			item := map[string]types.AttributeValue{
				"floorplanId": &types.AttributeValueMemberS{Value: "1"},
			}
			return &dynamodb.GetItemOutput{Item: item}, nil
		},
	}
	handler := NewReadFloorPlanHandler(mockDDBClient)

	originalFactoryJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalFactoryJSONMarshal }()

	wrappers.JSONMarshal = func(_ interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling floorplan in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFloorPlanRequest_WithId_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		GetItemFunc: func(_ context.Context, _ *dynamodb.GetItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			item := map[string]types.AttributeValue{
				"floorplanId": &types.AttributeValueMemberS{Value: "1"},
			}
			return &dynamodb.GetItemOutput{Item: item}, nil
		},
	}

	handler := NewReadFloorPlanHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFloorPlanRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read with id, got %d", http.StatusOK, response.StatusCode)
	}
}
