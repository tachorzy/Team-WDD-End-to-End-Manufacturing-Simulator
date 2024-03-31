package floorplan

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const TABLENAME = "Floorplan"

type Floorplan struct {
	FloorplanID string `json:"floorplanId" dynamodbav:"floorplanId"`
	FactoryID   string `json:"factoryId" dynamodbav:"factoryId"`
	DateCreated string `json:"dateCreated" dynamodbav:"Date Created"`
	ImageRef    string `json:"ImageRef" dynamodbav:"ImageRef"`
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
