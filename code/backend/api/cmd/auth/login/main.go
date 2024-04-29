package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"wdd/api/internal/handlers/auth"
)

const AWSREGION = "us-east-2"

func main() {
	ctx := context.TODO()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(AWSREGION))
	if err != nil {
		panic(fmt.Sprintf("Failed loading config, %v", err))
	}

	cognitoClient := cognitoidentityprovider.NewFromConfig(cfg)

	handler := auth.NewLoginHandler(cognitoClient)

	lambda.Start(handler.HandleLoginRequest)
}
