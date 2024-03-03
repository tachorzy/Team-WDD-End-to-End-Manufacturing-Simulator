package main

import (
	"context"
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

func HandleRequest(ctx context.Context, factory Factory) (string, error) {
	sess := session.Must(session.NewSession())
	svc := dynamodb.New(sess)

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
