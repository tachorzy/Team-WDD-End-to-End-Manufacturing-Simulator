package assets

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Asset"

type floorplanCoords struct {
	Longitude *float64 `json:"longitude,omitempty" dynamodbav:"longitude"`
	Latitude  *float64 `json:"latitude,omitempty" dynamodbav:"latitude"`
}

type Asset struct {
	AssetID         string           `json:"assetId" dynamodbav:"assetId"`
	FactoryID       *string          `json:"factoryId,omitempty" dynamodbav:"factoryId"`
	Name            *string          `json:"name,omitempty" dynamodbav:"name"`
	FloorplanCoords *floorplanCoords `json:"floorplanCoords,omitempty" dynamodbav:"floorplanCoords"`
	ModelID         *string          `json:"modelId,omitempty" dynamodbav:"modelId"`
	FloorplanID     *string          `json:"floorplanId,omitempty" dynamodbav:"floorplanId"`
	DateCreated     string           `json:"dateCreated" dynamodbav:"dateCreated"`
	ImageData       string           `json:"imageData" dynamodbav:"imageData"`
	ModelURL        *string          `json:"modelUrl,omitempty" dynamodbav:"modelUrl"`
	Type            *string          `json:"type,omitempty" dynamodbav:"type"`
	Description     *string          `json:"description,omitempty" dynamodbav:"description"`
}

type Handler struct {
	DynamoDB types.DynamoDBClient
}
