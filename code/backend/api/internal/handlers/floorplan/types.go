package floorplan

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Floorplan"

type Floorplan struct {
	FloorplanID string `json:"floorplanId" dynamodbav:"floorplanId"`
	FactoryID   string `json:"factoryId" dynamodbav:"factoryId"`
	DateCreated string `json:"dateCreated" dynamodbav:"Date Created"`
	ImageData   string `json:"imageData" dynamodbav:"imageData"`
}

type Handler struct {
	DynamoDB types.DynamoDBClient
}
