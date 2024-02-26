package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Location struct {
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}

type Factory struct {
	FactoryId   string   `json:"factoryId"`
	Name        string   `json:"name"`
	Location    Location `json:"location"`
	Description string   `json:"description"`
}

func factoryExists(factoryId string, svc *dynamodb.DynamoDB) (bool, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String("Factory"),
		Key: map[string]*dynamodb.AttributeValue{
			"FactoryId": {
				S: aws.String(factoryId),
			},
		},
	}

	result, err := svc.GetItem(input)
	if err != nil {
		return false, err
	}

	return result.Item != nil, nil
}

func HandleRequest(ctx context.Context, factory Factory) (string, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

	// Check if FactoryId exists
	exists, err := factoryExists(factory.FactoryId, svc)
	if err != nil {
		return "", err
	}

	if !exists {
		return "", fmt.Errorf("factory with ID %s does not exist", factory.FactoryId)
	}

	// Update existing item
	av, err := dynamodbattribute.MarshalMap(factory)
	if err != nil {
		return "", err
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String("Factory"),
	}

	_, err = svc.PutItem(input)
	if err != nil {
		return "", err
	}

	return factory.FactoryId, nil
}

func main() {
	lambda.Start(HandleRequest)
}
