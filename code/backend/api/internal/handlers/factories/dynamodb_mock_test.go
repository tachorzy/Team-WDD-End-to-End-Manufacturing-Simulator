package factories

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type MockDynamoDBClient struct {
	PutItemFunc    func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	DeleteItemFunc func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error)
}

func (m *MockDynamoDBClient) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return m.PutItemFunc(ctx, params, optFns...)
}

func (m *MockDynamoDBClient) DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	return m.DeleteItemFunc(ctx, params, optFns...)
}
