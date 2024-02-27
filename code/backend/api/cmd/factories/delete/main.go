package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"wdd/api/internal/handlers/factories"
)

const AWSREGION = "us-east-2"

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	svc := dynamodb.NewFromConfig(cfg)
	handler := factories.NewDeleteFactoryHandler(svc)

	lambda.Start(handler.HandleDeleteRequest)
}
