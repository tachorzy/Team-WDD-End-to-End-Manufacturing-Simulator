package assets

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func TestHandleCreateAssetRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId":1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleCreateAssetRequest_Base64DecodeStringError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{}

	originalBase64DecodeString := wrappers.Base64DecodeString

	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()

	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return nil, errors.New("base64 decode error")
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for base64 decode string, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleCreateAssetRequest_UploadImageError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return nil, errors.New("upload error")
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for upload image, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleCreateAssetRequest_UploadModelError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return nil, errors.New("upload error")
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for upload model, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateAssetRequest_MarshalMapError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	originalMarshalMap := wrappers.MarshalMap
	defer func() { wrappers.MarshalMap = originalMarshalMap }()
	wrappers.MarshalMap = func(interface{}) (map[string]ddbtypes.AttributeValue, error) {
		return nil, errors.New("mock marshalmap error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling asset to DynamoDB format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateAssetRequest_PutItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for DynamoDB put item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateAssetRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	originalFactoryJSONMarshal := wrappers.JSONMarshal
	defer func() { wrappers.JSONMarshal = originalFactoryJSONMarshal }()
	wrappers.JSONMarshal = func(_ interface{}) ([]byte, error) {
		return nil, errors.New("mock marshal error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling asset in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleCreateAssetRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		PutItemFunc: func(_ context.Context, _ *dynamodb.PutItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	handler := NewCreateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleCreateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d for successful creation, got %d", http.StatusOK, response.StatusCode)
	}
}
