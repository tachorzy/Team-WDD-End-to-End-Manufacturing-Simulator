package assets

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func TestHandleUpdateAssetRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId":1}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected StatusCode %d for bad JSON, got %d", http.StatusBadRequest, response.StatusCode)
	}
}

func TestHandleUpdateAssetRequest_WithImage_Base64DecodeStringError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{}

	originalBase64DecodeString := wrappers.Base64DecodeString

	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()

	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return nil, errors.New("base64 decode error")
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for base64 decode string, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateAssetRequest_WithModel_Base64DecodeStringError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{}

	originalBase64DecodeString := wrappers.Base64DecodeString

	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()

	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return nil, errors.New("base64 decode error")
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for base64 decode string, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleUpdateAssetRequest_UploadImageError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return nil, errors.New("upload error")
		},
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for upload image, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleUpdateAssetRequest_UploadModelError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return nil, errors.New("upload error")
		},
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for upload model, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateAssetRequest_UpdateExpressionBuilderError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder
	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()
	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for building update expression, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateAssetRequest_UpdateItemError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}, "imageData": "image", "modelUrl": "url"}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected StatusCode %d for DynamoDB update item error, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

func TestHandleUpdateAssetRequest_JSONMarshalError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

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

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)
	request := events.APIGatewayProxyRequest{
		Body: `{
			"assetId": "1", 
			"name": "test", 
			"modelId": "test", 
			"floorplanId": "test", 
			"floorplanCoords": {
				"longitude": 1.0, 
				"latitude": 1.0
			}, 
			"imageData": "image", 
			"modelUrl": "url", 
			"attributes": {
				"attribute1": {
					"value":"test" 
				},
				"attribute2": {
					"value":"test",
					"unit":"test" 
				}
			}
		}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusInternalServerError {
		t.Errorf("Expected status code %d for marshalling asset in JSON format, got %d", http.StatusInternalServerError, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleUpdateAssetRequest_WithImagePrefix_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{
			"assetId": "1", 
			"name": "test", 
			"modelId": "test", 
			"floorplanId": "test", 
			"floorplanCoords": {
				"longitude": 1.0, 
				"latitude": 1.0
			}, 
			"imageData": "https://image", 
			"attributes": {
				"attribute1": {
					"value":"test" 
				},
				"attribute2": {
					"value":"test",
					"unit":"test" 
				}
			}
		}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusOK, response.StatusCode)
	}
}

//nolint:dupl
func TestHandleUpdateAssetRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(_ context.Context, _ *dynamodb.UpdateItemInput, _ ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	mockS3Uploader := &mocks.S3Uploader{
		UploadFunc: func(_ context.Context, _ *s3.PutObjectInput, _ ...func(*manager.Uploader)) (*manager.UploadOutput, error) {
			return &manager.UploadOutput{}, nil
		},
	}

	originalBase64DecodeString := wrappers.Base64DecodeString
	defer func() { wrappers.Base64DecodeString = originalBase64DecodeString }()
	wrappers.Base64DecodeString = func(_ string) ([]byte, error) {
		return []byte(""), nil
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Uploader)

	request := events.APIGatewayProxyRequest{
		Body: `{
			"assetId": "1", 
			"name": "test", 
			"modelId": "test", 
			"floorplanId": "test", 
			"floorplanCoords": {
				"longitude": 1.0, 
				"latitude": 1.0
			}, 
			"imageData": "image", 
			"modelUrl": "url", 
			"attributes": {
				"attribute1": {
					"value":"test" 
				},
				"attribute2": {
					"value":"test",
					"unit":"test" 
				}
			}
		}`,
	}

	ctx := context.Background()
	response, err := handler.HandleUpdateAssetRequest(ctx, request)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected StatusCode %d for successful update, got %d", http.StatusOK, response.StatusCode)
	}
}
