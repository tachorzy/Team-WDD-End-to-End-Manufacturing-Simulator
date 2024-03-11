package factories

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"testing"
)

func TestHandleUpdateFactoryRequest_BadJSON(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{}

	handler := NewUpdateFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"name":"Name", "location": "Invalid", "description":"Description"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateFactoryRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}
