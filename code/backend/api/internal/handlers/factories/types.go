package factories

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const TABLENAME = "Factory"

type Location struct {
	Longitude *float64 `json:"longitude,omitempty" dynamodbav:"longitude"`
	Latitude  *float64 `json:"latitude,omitempty" dynamodbav:"latitude"`
}

type Factory struct {
	FactoryID   string    `json:"factoryId" dynamodbav:"factoryId"`
	Name        *string   `json:"name,omitempty" dynamodbav:"name"`
	Location    *Location `json:"location,omitempty" dynamodbav:"location"`
	Description *string   `json:"description,omitempty" dynamodbav:"description"`
	DateCreated string    `json:"dateCreated" dynamodbav:"Date Created"`
}

type DynamoDBClient interface {
	DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error)
	GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error)
	PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	Scan(ctx context.Context, params *dynamodb.ScanInput, optFns ...func(*dynamodb.Options)) (*dynamodb.ScanOutput, error)
	UpdateItem(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error)
}

type Handler struct {
	DynamoDB DynamoDBClient
}
