package assets

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"
)

func TestHandleReadFactoryAssetsRequest_MissingIdError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for missing factoryId or assetId, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleReadFactoryAssetsRequest_QueryError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "Factory 1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB query error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryAssetsRequest_UnmarshalListOfMapsError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			items := []map[string]ddbtypes.AttributeValue{
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "1"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "2"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
			}
			return &dynamodb.QueryOutput{Items: items}, nil
		},
	}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	originalFactoryAssetsUnmarshalListOfMap := wrappers.UnmarshalListOfMaps

	defer func() { wrappers.UnmarshalListOfMaps = originalFactoryAssetsUnmarshalListOfMap }()

	wrappers.UnmarshalListOfMaps = func([]map[string]ddbtypes.AttributeValue, interface{}) error {
		return errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "Factory 1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for unmarshalling list of factory assets from DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleReadFactoryAssetsRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			items := []map[string]ddbtypes.AttributeValue{
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "1"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "2"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
			}
			return &dynamodb.QueryOutput{Items: items}, nil
		},
	}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	originalJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalJSONMarshal }()

	wrappers.JSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock error")
	}

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "Factory 1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshal factory assets to DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleReadFactoryAssetsRequest_WithFactoryId_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			items := []map[string]ddbtypes.AttributeValue{
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "1"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "2"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
			}
			return &dynamodb.QueryOutput{Items: items}, nil
		},
	}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "Factory 1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read, got %d", http.StatusOK, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleReadFactoryAssetsRequest_WithAssetId_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		QueryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			items := []map[string]ddbtypes.AttributeValue{
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "1"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
				{
					"assetId":   &ddbtypes.AttributeValueMemberS{Value: "2"},
					"factoryId": &ddbtypes.AttributeValueMemberS{Value: "Factory 1"},
				},
			}
			return &dynamodb.QueryOutput{Items: items}, nil
		},
	}

	handler := NewReadFactoryAssetsHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"assetId": "Asset 1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryAssetsRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful read, got %d", http.StatusOK, response.StatusCode)
	}
}
