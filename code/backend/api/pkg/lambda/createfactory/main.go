package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

type Location struct {
	Longitude float64 `json:"longitude" dynamodbav:"longitude"`
	Latitude  float64 `json:"latitude" dynamodbav:"latitude"`
}

type Factory struct {
	FactoryId   string   `json:"factoryId" dynamodbav:"factoryId"`
	Name        string   `json:"name" dynamodbav:"name"`
	Location    Location `json:"location" dynamodbav:"location"`
	Description string   `json:"description" dynamodbav:"description"`
}

const (
	AWSREGION = "us-east-2"
	TABLENAME = "Factory"
)

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var factory Factory
	err := json.Unmarshal([]byte(request.Body), &factory)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	factory.FactoryId = uuid.NewString()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(AWSREGION))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Error loading AWS configuration: %s", err.Error()),
		}, nil
	}

	svc := dynamodb.NewFromConfig(cfg)

	av, err := attributevalue.MarshalMap(factory)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Error marshalling factory to DynamoDB format: %s", err.Error()),
		}, nil
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(TABLENAME),
	}

	_, err = svc.PutItem(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf("Error putting item into DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       fmt.Sprintf("factoryId %s created successfully", factory.FactoryId),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
