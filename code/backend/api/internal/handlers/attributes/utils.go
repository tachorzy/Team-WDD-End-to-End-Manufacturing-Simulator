package attributes

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Attribute"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
