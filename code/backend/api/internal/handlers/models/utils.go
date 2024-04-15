package models

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Model"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
