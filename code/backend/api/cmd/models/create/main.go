package main

import (
	"context"
	"fmt"
	"wdd/api/internal/handlers/models"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	dbClient := dynamodb.NewFromConfig(cfg)
	handler := models.NewCreateModelHandler(dbClient)

	lambda.Start(handler.HandleCreateModelRequest)
}
