package assets

import (
	"context"
	"errors"
	"net/http"
	"testing"
	"wdd/api/internal/mocks"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func TestHandleUpdateAssetRequest_BadJSON(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Client := new(mocks.S3Client)

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Client)

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

func TestHandleUpdateAssetRequest_UpdateExpressionBuilderError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	mockS3Client := new(mocks.S3Client)

	mockS3Client.PutObjectFunc = func(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
		return &s3.PutObjectOutput{}, nil
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Client)

	originalUpdateExpressionBuilder := wrappers.UpdateExpressionBuilder

	defer func() { wrappers.UpdateExpressionBuilder = originalUpdateExpressionBuilder }()

	wrappers.UpdateExpressionBuilder = func(expression.UpdateBuilder) (expression.Expression, error) {
		return expression.Expression{}, errors.New("update expression error")
	}

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}}`,
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
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return nil, errors.New("mock dynamodb error")
		},
	}
	mockS3Client := &mocks.S3Client{
		PutObjectFunc: func(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
			return &s3.PutObjectOutput{}, nil
		},
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Client)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}}`,
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

func TestHandleUpdateAssetRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{
		UpdateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			return &dynamodb.UpdateItemOutput{}, nil
		},
	}

	mockS3Client := &mocks.S3Client{
		PutObjectFunc: func(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.Options)) (*s3.PutObjectOutput, error) {
			return &s3.PutObjectOutput{}, nil
		},
	}

	handler := NewUpdateAssetHandler(mockDDBClient, mockS3Client)

	request := events.APIGatewayProxyRequest{
		Body: `{"assetId": "1", "name": "test", "modelId": "test", "floorplanId": "test", "floorplanCoords": {"longitude": 1.0, "latitude": 1.0}}`,
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
