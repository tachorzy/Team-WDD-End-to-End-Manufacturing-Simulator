package measurements

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Measurement"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
