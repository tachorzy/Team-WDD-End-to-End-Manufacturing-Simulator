package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type Location struct {
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}

type Factory struct {
	FactoryID   string   `json:"factoryId"`
	Name        string   `json:"name"`
	Location    Location `json:"location"`
	Description string   `json:"description"`
}

func factoryExists(factoryID string, svc *dynamodb.DynamoDB) (bool, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String("Factory"),
		Key: map[string]*dynamodb.AttributeValue{
			"FactoryId": {
				S: aws.String(factoryID),
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
	exists, err := factoryExists(factory.FactoryID, svc)
	if err != nil {
		return "", err
	}

	if !exists {
		return "", fmt.Errorf("factory with ID %s does not exist", factory.FactoryID)
	}

	// Update existing item
	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			"name": {
				S: aws.String(factory.Name),
			},
			"location": {
				M: map[string]*dynamodb.AttributeValue{
					"Longitude": {
						N: aws.String(fmt.Sprintf("%f", factory.Location.Longitude)),
					},
					"Latitude": {
						N: aws.String(fmt.Sprintf("%f", factory.Location.Latitude)),
					},
				},
			},
			"description": {
				S: aws.String(factory.Description),
			},
		},
		TableName: aws.String("Factory"),
		Key: map[string]*dynamodb.AttributeValue{
			"factoryId": {
				S: aws.String(factory.FactoryID),
			},
		},
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set Name = name, Location = location, Description = description"),
	}

	_, err = svc.UpdateItem(input)
	if err != nil {
		return "", err
	}

	return factory.FactoryID, nil
}

func main() {
	lambda.Start(HandleRequest)
}
