package assets

import (
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"wdd/api/internal/types"
)

const TABLENAME = "Asset"

type Handler struct {
	DynamoDB types.DynamoDBClient
	S3Client *s3.Client
}
