package measurements

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

func TestHandleDeleteMeasurementRequest_MissingMeasurementId(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewDeleteMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for missing measurementId, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleDeleteMeasurementRequest_DeleteItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(_ context.Context, _ *dynamodb.DeleteItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return nil, errors.New("mock DynamoDB error")
		},
	}
	handler := NewDeleteMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "testID",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleDeleteMeasurementRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		DeleteItemFunc: func(_ context.Context, _ *dynamodb.DeleteItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return &dynamodb.DeleteItemOutput{}, nil
		},
	}
	handler := NewDeleteMeasurementHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{
			"id": "someMeasurementId",
		},
	}

	ctx := context.Background()
	response, err := handler.HandleDeleteMeasurementRequest(ctx, request)

	if err != nil {
		t.Fatalf("Did not expect an error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful deletion, got %d", http.StatusOK, response.StatusCode)
	}
}
