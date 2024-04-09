package floorplan

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Floorplan"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
