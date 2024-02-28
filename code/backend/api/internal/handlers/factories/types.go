package factories

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const TABLENAME = "Factory"

type Location struct {
	Longitude float64 `json:"longitude" dynamodbav:"longitude"`
	Latitude  float64 `json:"latitude" dynamodbav:"latitude"`
}

type Factory struct {
	FactoryId   string   `json:"factoryId" dynamodbav:"factoryId"`
	Name        string   `json:"name" dynamodbav:"name"`
	Location    Location `json:"location" dynamodbav:"location"`
	Description string   `json:"description" dynamodbav:"description"`
}

type DynamoDBClient interface {
	PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error)
}

type Handler struct {
	DynamoDB DynamoDBClient
}
