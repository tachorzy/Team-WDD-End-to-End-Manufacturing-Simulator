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

func TestHandleLoginRequest_BadJSON(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{}

	handler := NewLoginHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleLoginRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleLoginRequest_InitiateAuthError(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		InitiateAuthFunc: func(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error) {
			return nil, errors.New("mock cognito error")
		},
	}

	handler := NewLoginHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleLoginRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for Cognito initiate auth error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleLoginRequest_JSONMarshalError(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		InitiateAuthFunc: func(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error) {
			return &cognito.InitiateAuthOutput{}, nil
		},
	}
	handler := NewLoginHandler(mockCognitoClient)

	originalJSONMarshal := wrappers.JSONMarshal

	defer func() { wrappers.JSONMarshal = originalJSONMarshal }()

	wrappers.JSONMarshal = func(v interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleLoginRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling login info in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleLoginRequest_Success(t *testing.T) {
	mockCognitoClient := &mocks.CognitoClient{
		InitiateAuthFunc: func(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error) {
			return &cognito.InitiateAuthOutput{}, nil
		},
	}
	handler := NewLoginHandler(mockCognitoClient)

	request := events.APIGatewayProxyRequest{
		Body: `{"username":"test", "password":"test", "name": "test"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleLoginRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful login, got %d", http.StatusOK, response.StatusCode)
	}
}
