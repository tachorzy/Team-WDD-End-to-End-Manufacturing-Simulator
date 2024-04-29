package assets

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Asset"

type Handler struct {
	DynamoDB   types.DynamoDBClient
	S3Uploader types.S3Uploader
}
