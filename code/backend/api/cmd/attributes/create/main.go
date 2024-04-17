package main

import (
	"context"
	"fmt"
	"wdd/api/internal/handlers/attributes"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const AWSREGION = "us-east-2"

func main() {
	ctx := context.TODO()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	dynamoDBClient := dynamodb.NewFromConfig(cfg)

	handler := attributes.NewCreateAttributeHandler(dynamoDBClient)

	lambda.Start(handler.HandleCreateAttributeRequest)

}
