package floorplan

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Floorplan"

type Handler struct {
	DynamoDB   types.DynamoDBClient
	S3Uploader types.S3Uploader
}
