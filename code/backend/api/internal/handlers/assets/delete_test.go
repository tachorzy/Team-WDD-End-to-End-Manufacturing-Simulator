package assets

//nolint:all
import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func TestHandleDeleteAssetRequest_MissingAssetId(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewDeleteAssetHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleDeleteAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for missing assetId, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleDeleteAssetRequest_DeleteItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(_ context.Context, _ *dynamodb.DeleteItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return nil, errors.New("mock DynamoDB error")
		},
	}
	handler := NewDeleteAssetHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "testID",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB delete item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleDeleteAssetRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(_ context.Context, _ *dynamodb.DeleteItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return &dynamodb.DeleteItemOutput{}, nil
		},
	}
	handler := NewDeleteAssetHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "testID",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful deletion, got %d", http.StatusOK, response.StatusCode)
	}
}
