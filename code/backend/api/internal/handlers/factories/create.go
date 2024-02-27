package factories

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
	"net/http"
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

const TABLENAME = "Factory"

type DynamoDBClient interface {
	PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
}

type Handler struct {
	DynamoDB DynamoDBClient
}

func NewCreateFactoryHandler(db DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

var FactoryMarshalMap = attributevalue.MarshalMap

func (h Handler) HandleCreateRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var factory Factory
	if err := json.Unmarshal([]byte(request.Body), &factory); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	factory.FactoryId = uuid.NewString()

	av, err := FactoryMarshalMap(factory)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error marshalling factory to DynamoDB format: %s", err.Error()),
		}, nil
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(TABLENAME),
	}

	if _, err := h.DynamoDB.PutItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error putting item into DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       fmt.Sprintf("factoryId %s created successfully", factory.FactoryId),
	}, nil
}
