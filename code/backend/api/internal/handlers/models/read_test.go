package models

import (
	"context"
	"errors"
	"net/http"
	"testing"

	"wdd/api/internal/mocks"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestHandleReadModelRequest_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)
	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "model123"},
	}
	mockDDBClient.On("Query", mock.Anything).Return(mockQuerySuccess())
	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)
	assert.Nil(t, err)
	assert.Equal(t, http.StatusOK, response.StatusCode)
	assert.Contains(t, response.Body, "model123")
}

func TestHandleReadModelRequest_MissingParameters(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)
	request := events.APIGatewayProxyRequest{}
	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)
	assert.Nil(t, err)
	assert.Equal(t, http.StatusBadRequest, response.StatusCode)
	assert.Contains(t, response.Body, "Required parameters are missing")
}

func mockQuerySuccess() *dynamodb.QueryOutput {
	return &dynamodb.QueryOutput{
		Items: []map[string]types.AttributeValue{
			{"modelId": &types.AttributeValueMemberS{Value: "model123"}},
		},
	}
}
func TestHandleReadModelRequest_DynamoDBQueryError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "model123"},
	}

	mockDDBClient.QueryFunc = func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
		return nil, errors.New("mock DynamoDB query error")
	}

	ctx := context.Background()
	response, err := handler.HandleReadModelRequest(ctx, request)

	assert.Nil(t, err, "Expected no error to be returned from the handler")
	assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Expected HTTP status 500 due to DynamoDB error")
	assert.Contains(t, response.Body, "Error querying model by ID", "Expected DynamoDB error message")
}

func TestHandleModelsByFactoryID_Success(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	mockDDBClient.QueryFunc = func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
		items := []map[string]types.AttributeValue{
			{
				"modelId":     &types.AttributeValueMemberS{Value: "model1"},
				"factoryId":   &types.AttributeValueMemberS{Value: "factory123"},
				"dateCreated": &types.AttributeValueMemberS{Value: "2021-07-15"},
				"attributes":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Size"}, &types.AttributeValueMemberS{Value: "Color"}}},
				"properties":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Property1"}, &types.AttributeValueMemberS{Value: "Property2"}}},
			},
			{
				"modelId":     &types.AttributeValueMemberS{Value: "model2"},
				"factoryId":   &types.AttributeValueMemberS{Value: "factory123"},
				"dateCreated": &types.AttributeValueMemberS{Value: "2022-01-01"},
				"attributes":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Weight"}, &types.AttributeValueMemberS{Value: "Material"}}},
				"properties":  &types.AttributeValueMemberL{Value: []types.AttributeValue{&types.AttributeValueMemberS{Value: "Property3"}, &types.AttributeValueMemberS{Value: "Property4"}}},
			},
		}
		return &dynamodb.QueryOutput{Items: items}, nil
	}

	ctx := context.Background()
	response, err := handler.handleModelsByFactoryID(ctx, "factory123", request.Headers)

	assert.Nil(t, err, "Expected no error to be returned")
	assert.Equal(t, http.StatusOK, response.StatusCode, "Expected HTTP status 200 for successful data retrieval")
	assert.Contains(t, response.Body, "model1", "Expected data to include model information for model1")
	assert.Contains(t, response.Body, "model2", "Expected data to include model information for model2")
	assert.Contains(t, response.Body, "Size", "Expected attribute Size to be included in the model details")
	assert.Contains(t, response.Body, "Property1", "Expected property Property1 to be included in the model details")
}

func TestHandleModelsByFactoryID_DynamoDBError(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	mockDDBClient.QueryFunc = func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
		return nil, errors.New("mock DynamoDB error")
	}

	ctx := context.Background()
	response, err := handler.handleModelsByFactoryID(ctx, "factory123", request.Headers)

	assert.Nil(t, err)
	assert.Equal(t, http.StatusInternalServerError, response.StatusCode)
	assert.Contains(t, response.Body, "Error querying models by factory ID")
}

func TestHandleModelsByFactoryID_NoModelsFound(t *testing.T) {
	mockDDBClient := &mocks.DynamoDBClient{}
	handler := NewReadModelHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"factoryId": "factory123"},
	}

	mockDDBClient.QueryFunc = func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
		return &dynamodb.QueryOutput{Items: []map[string]types.AttributeValue{}}, nil
	}

	ctx := context.Background()
	response, err := handler.handleModelsByFactoryID(ctx, "factory123", request.Headers)

	assert.Nil(t, err)
	assert.Equal(t, http.StatusNotFound, response.StatusCode)
	assert.Contains(t, response.Body, "No models found")
}
