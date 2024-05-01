package auth

import (
	"context"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"
)

func TestHandleRegisterRequest_BadJSON(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{}

	handler := NewRegisterHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleRegisterRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleRegisterRequest_SignUpError(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		SignUpFunc: func(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error) {
			return nil, errors.New("mock cognito error")
		},
	}

	handler := NewRegisterHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleRegisterRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for Cognito sign up error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleRegisterRequest_JSONMarshalError(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		SignUpFunc: func(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error) {
			return &cognito.SignUpOutput{}, nil
		},
	}

	handler := NewRegisterHandler(mockCognitoClient)

	originalJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalJSONMarshal }()

	wrappers.JSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleRegisterRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling user in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleRegisterRequest_Success(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		SignUpFunc: func(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error) {
			return &cognito.SignUpOutput{}, nil
		},
	}

	handler := NewRegisterHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleRegisterRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful register, got %d", http.StatusOK, response.StatusCode)
	}
}
