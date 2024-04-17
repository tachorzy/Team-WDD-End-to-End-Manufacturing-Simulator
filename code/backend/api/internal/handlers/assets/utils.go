package assets

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Asset"

type Handler struct {
	DynamoDB types.DynamoDBClient
	S3Client types.S3Client
}
