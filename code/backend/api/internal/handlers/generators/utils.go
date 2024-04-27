package generators

import (
	"wdd/api/internal/types"
)

const PROPERTYTABLE = "Property"
const MEASUREMENTTABLE = "Measurement"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
