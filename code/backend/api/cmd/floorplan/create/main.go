package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"wdd/api/internal/handlers/floorplan"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const AWSREGION = "us-east-2"

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	dbClient := dynamodb.NewFromConfig(cfg)
	s3Client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(s3Client)

	handler := floorplan.NewCreateFloorPlanHandler(dbClient, uploader)

	lambda.Start(handler.HandleCreateFloorPlanRequest)
}
