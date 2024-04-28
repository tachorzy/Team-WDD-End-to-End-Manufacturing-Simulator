package generators

import (
	"wdd/api/internal/types"
)

const PROPERTYTABLE = "Property"
const MEASUREMENTTABLE = "Measurement"
const PROPERTYDATA = "PropertyData"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
