package properties

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Property"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
