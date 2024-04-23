package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"wdd/api/internal/handlers/assets"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

const AWSREGION = "us-east-2"

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	dynamoDBClient := dynamodb.NewFromConfig(cfg)
	s3Client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(s3Client)

	handler := assets.NewUpdateAssetHandler(dynamoDBClient, uploader)
	lambda.Start(handler.HandleUpdateAssetRequest)
}
