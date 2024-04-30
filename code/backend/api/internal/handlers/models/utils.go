package models

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Model"
const PROPERTYTABLE = "Property"
const ATTRIBUTETABLE = "Attribute"
const MEASUREMENTTABLE = "Measurement"

type Handler struct {
	DynamoDB types.DynamoDBClient
}
