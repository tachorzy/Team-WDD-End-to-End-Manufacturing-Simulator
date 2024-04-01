package models

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const TABLENAME = "Model"

type Model struct {
	ModelID     string    `json:"modelId" dynamodbav:"modelId"`
	Attributes  *[]string `json:"attributes,omitempty" dynamobdav:"attributes"`
	Properties  *[]string `json:"properties,omitempty" dynamodbav:"properties"`
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