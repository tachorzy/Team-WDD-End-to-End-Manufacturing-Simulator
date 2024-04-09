package factories

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Factory"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
