package factories

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"net/http"
	"testing"
)

func TestHandleReadFactoryRequest_WithoutId_Success(t *testing.T) {
	mockDDBClient := &MockDynamoDBClient{
		ScanFunc: func(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error) {
			items := []map[string]types.AttributeValue{
				{
					"factoryId":   &types.AttributeValueMemberS{Value: "Test ID"},
					"name":        &types.AttributeValueMemberS{Value: "Test Name"},
					"description": &types.AttributeValueMemberS{Value: "Test Description"},
				},
			}
			return &dynamodb.ScanOutput{Items: items}, nil
		},
	}
	handler := NewReadFactoryHandler(mockDDBClient)

	request := events.APIGatewayProxyRequest{}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, response.StatusCode)
	}
}

func TestHandleReadFactoryRequest_WithId_Success(t *testing.T) {
	mockDB := &MockDynamoDBClient{
		GetItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			item := map[string]types.AttributeValue{
				"factoryId":   &types.AttributeValueMemberS{Value: "1"},
				"name":        &types.AttributeValueMemberS{Value: "Factory 1"},
				"description": &types.AttributeValueMemberS{Value: "Description 1"},
			}
			return &dynamodb.GetItemOutput{Item: item}, nil
		},
	}

	handler := NewReadFactoryHandler(mockDB)

	request := events.APIGatewayProxyRequest{
		QueryStringParameters: map[string]string{"id": "1"},
	}

	ctx := context.Background()
	response, err := handler.HandleReadFactoryRequest(ctx, request)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if response.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, response.StatusCode)
	}
}
