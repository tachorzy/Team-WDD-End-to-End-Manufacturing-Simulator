package factories

import (
	"wdd/api/internal/types"
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

type Handler struct {
	DynamoDB types.DynamoDBClient
}
