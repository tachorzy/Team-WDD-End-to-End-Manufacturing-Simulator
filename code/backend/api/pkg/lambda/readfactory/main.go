package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Factory struct {
	FactoryId   string   `json:"factoryId"`
	Name        string   `json:"name"`
	Location    Location `json:"location"`
	Description string   `json:"description"`
}

type Location struct {
	Longitude float64 `json:"longitude"`
	Latitude  float64 `json:"latitude"`
}

func ReadFactory(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	factoryId := request.QueryStringParameters["factoryId"]

	if factoryId == "" {
		sess := session.Must(session.NewSessionWithOptions(session.Options{
			SharedConfigState: session.SharedConfigEnable,
		}))
		svc := dynamodb.New(sess)

		result, err := svc.Scan(&dynamodb.ScanInput{
			TableName: aws.String("Factory"),
		})
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error fetching factories: %s", err),
			}, nil
		}

		var factories []Factory
		err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &factories)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Failed to unmarshal factories: %v", err),
			}, nil
		}

		factoriestoJSON, err := json.Marshal(factories)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error marshalling response: %s", err),
			}, nil
		}

		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Content-Type":                     "application/json",
				"Access-Control-Allow-Origin":      "*",                                                                    // Ideally, replace * with your domain
				"Access-Control-Allow-Methods":     "GET,POST,OPTIONS",                                                     // The methods you want to allow
				"Access-Control-Allow-Headers":     "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", // The headers you want to allow
				"Access-Control-Allow-Credentials": "true",                                                                 // If your frontend includes credentials with requests. Use "false" otherwise.
			},
			Body: string(factoriestoJSON),
		}, nil
	} else {
		sess := session.Must(session.NewSessionWithOptions(session.Options{
			SharedConfigState: session.SharedConfigEnable,
		}))
		svc := dynamodb.New(sess)

		result, err := svc.GetItem(&dynamodb.GetItemInput{
			TableName: aws.String("Factory"),
			Key: map[string]*dynamodb.AttributeValue{
				"factoryId": {
					S: aws.String(factoryId),
				},
			},
		})
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error finding factory: %s", err),
			}, nil
		}

		if result.Item == nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 404,
				Body:       fmt.Sprintf("Factory with ID %s not found", factoryId),
			}, nil
		}

		var factory Factory
		err = dynamodbattribute.UnmarshalMap(result.Item, &factory)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Failed to unmarshal Record, %v", err),
			}, nil
		}

		factoryJSON, err := json.Marshal(factory)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       fmt.Sprintf("Error marshalling response: %s", err),
			}, nil
		}

		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Content-Type":                     "application/json",
				"Access-Control-Allow-Origin":      "*",
				"Access-Control-Allow-Methods":     "GET,POST,OPTIONS",
				"Access-Control-Allow-Credentials": "true",
			},
			Body: string(factoryJSON),
		}, nil
	}
}

func main() {
	lambda.Start(ReadFactory)
}
