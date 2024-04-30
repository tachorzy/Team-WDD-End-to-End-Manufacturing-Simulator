package models

import (
	"context"
	"fmt"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

func NewCreateModelHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleCreateModelRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var model types.Model
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	if err := wrappers.JSONUnmarshal([]byte(request.Body), &model); err != nil {
		return responseWithError(http.StatusBadRequest, headers, fmt.Sprintf("Error unmarshalling: %v", err))
	}
	model.ModelID = uuid.NewString()

	if err := insertItem(ctx, h.DynamoDB, model, TABLENAME); err != nil {
		return responseWithError(http.StatusInternalServerError, headers, fmt.Sprintf("Error inserting model: %v", err))
	}

	if result, err := handleAttributes(ctx, h, model); err != nil {
		return result, err
	}

	if result, err := handlePropertiesAndMeasurements(ctx, h, model); err != nil {
		return result, err
	}

	return marshalAndRespond(model, headers)
}

func handleAttributes(ctx context.Context, h Handler, model types.Model) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
	for _, attribute := range *model.Attributes {
		attribute.ModelID = model.ModelID
		attribute.AttributeID = uuid.NewString()
		if err := insertItem(ctx, h.DynamoDB, attribute, ATTRIBUTETABLE); err != nil {
			return responseWithError(http.StatusInternalServerError, headers, fmt.Sprintf("Error inserting attribute: %v", err))
		}
	}
	return events.APIGatewayProxyResponse{}, nil
}

func handlePropertiesAndMeasurements(ctx context.Context, h Handler, model types.Model) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
	if model.Properties != nil && model.Measurements != nil {
		for index, property := range *model.Properties {
			property.ModelID = &model.ModelID
			property.PropertyID = uuid.NewString()
			one := 1.0
			property.Value = &one
			if index < len(*model.Measurements) {
				measurement := (*model.Measurements)[index]
				measurement.MeasurementID = property.PropertyID
				if err := insertItem(ctx, h.DynamoDB, measurement, MEASUREMENTTABLE); err != nil {
					return responseWithError(http.StatusInternalServerError, headers, fmt.Sprintf("Error inserting measurement: %v", err))
				}
			}
			if err := insertItem(ctx, h.DynamoDB, property, PROPERTYTABLE); err != nil {
				return responseWithError(http.StatusInternalServerError, headers, fmt.Sprintf("Error inserting property: %v", err))
			}
		}
	}
	return events.APIGatewayProxyResponse{}, nil
}

func responseWithError(statusCode int, headers map[string]string, message string) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers:    headers,
		Body:       message,
	}, nil
}

func marshalAndRespond(model types.Model, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	responseBody, err := wrappers.JSONMarshal(model)
	if err != nil {
		return responseWithError(http.StatusInternalServerError, headers, fmt.Sprintf("Error marshalling: %v", err))
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(responseBody),
	}, nil
}

func insertItem(ctx context.Context, db types.DynamoDBClient, item interface{}, tableName string) error {
	av, err := wrappers.MarshalMap(item)
	if err != nil {
		return err
	}
	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}
	if _, err = db.PutItem(ctx, input); err != nil {
		return err
	}
	return nil
}
