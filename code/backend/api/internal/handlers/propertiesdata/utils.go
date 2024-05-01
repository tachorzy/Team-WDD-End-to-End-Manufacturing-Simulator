package propertiesdata

import (
	"wdd/api/internal/types"
)

const TABLENAME = "PropertyData"
const PROPERTYTABLE = "Property"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
