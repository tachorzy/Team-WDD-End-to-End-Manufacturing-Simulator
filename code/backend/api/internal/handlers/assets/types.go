package assets

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const TABLENAME = "Asset"

type floorplanCoords struct {
	Longitude *float64 `json:"longitude,omitempty" dynamodbav:"longitude"`
	Latitude  *float64 `json:"latitude,omitempty" dynamodbav:"latitude"`
}

type Asset struct {
	AssetID         string           `json:"assetId" dynamodbav:"assetId"`
	FactoryID       *string          `json:"factoryId,omitempty" dynamobdav:"factoryId"`
	Name            *string          `json:"name,omitempty" dynamodbav:"name"`
	FloorplanCoords *floorplanCoords `json:"floorplanCoords,omitempty" dynamodbav:"floorplanCoords"`
	ModelID         *string          `json:"modelId,omitempty" dynamobdav:"modelId"`
	FloorplanID     *string          `json:"floorplanId,omitempty" dynamobdav:"floorplanId"`
	DateCreated     string           `json:"dateCreated" dynamodbav:"Date Created"`
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
