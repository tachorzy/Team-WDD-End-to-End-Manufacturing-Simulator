package main

import (
	"context"
	"fmt"
	"log"

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
	FactoryId   string   `json:"factoryId"`
	Name        string   `json:"name"`
	Location    Location `json:"location"`
	Description string   `json:"description"`
}

func DeleteFactory(ctx context.Context, factoryId string) (*Factory, error) {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := dynamodb.New(sess)

	factory := Factory{}
	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"Id": {
				S: aws.String("FactoryId"),
			},
			"Name": {
				S: aws.String("Name"),
			},
			"Location": {
				S: aws.String("Location"),
			},
			"Description": {
				S: aws.String("Description"),
			},
		},
		TableName: aws.String("Factory"),
	}

	_, err := svc.DeleteItem(input)
	if err != nil {
		log.Fatalf("Got error calling DeleteItem: %s", err)
		return nil, err
	}

	fmt.Println("Delete FactoryID:", factory.FactoryId)

	return &factory, nil
}

func main() {
	lambda.Start(DeleteFactory)
}
