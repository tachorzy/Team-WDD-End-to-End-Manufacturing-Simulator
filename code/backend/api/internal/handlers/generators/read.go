package generators

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"wdd/api/internal/wrappers"

	"wdd/api/internal/types"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewReadCalculations(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadCalculationsRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	PropertyID := request.QueryStringParameters["propertyId"]

	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
	getProperty := &dynamodb.GetItemInput{
		TableName: aws.String(PROPERTYTABLE),
		Key: map[string]ddbtypes.AttributeValue{
			"propertyId": &ddbtypes.AttributeValueMemberS{Value: PropertyID},
		},
	}

	result, err := h.DynamoDB.GetItem(ctx, getProperty)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error finding property: %s", err),
		}, nil
	}

	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Property with ID %s not found", PropertyID),
		}, nil
	}

	var property types.Property
	if err := wrappers.UnmarshalMap(result.Item, &property); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling property: %s", err),
		}, nil
	}
	if property.MeasurementID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Property with ID %s has no measurement", PropertyID),
		}, nil
	}
	getMeasurement := &dynamodb.GetItemInput{
		TableName: aws.String(MEASUREMENTTABLE),
		Key: map[string]ddbtypes.AttributeValue{
			"measurementId": &ddbtypes.AttributeValueMemberS{Value: property.MeasurementID},
		},
	}
	result, err = h.DynamoDB.GetItem(ctx, getMeasurement)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error finding measurement: %s", err),
		}, nil
	}
	if result.Item == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Measurement with ID %s not found", property.MeasurementID),
		}, nil
	}
	var measurement types.Measurement
	if err := wrappers.UnmarshalMap(result.Item, &measurement); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling measurement: %s", err),
		}, nil
	}
	if measurement.GeneratorFunction == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    headers,
			Body:       fmt.Sprintf("Measurement with ID %s has no generator function", property.MeasurementID),
		}, nil
	}

	value, error := generateMeasurementValue(&property, &measurement)
	if error != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error generating measurement value: %s", error),
		}, nil
	}
	responseData := map[string]interface{}{"value": value}
	responseBody, err := wrappers.JSONMarshal(responseData)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Headers: headers, Body: fmt.Sprintf("Error marshalling response: %s", err)}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(responseBody),
	}, nil

}
func generateMeasurementValue(property *types.Property, measurement *types.Measurement) (float64, error) {
	gen, err := NewGenerator(property.GeneratorType)
	if err != nil {
		return 0, fmt.Errorf("error creating generator: %v", err)
	}

	params := GeneratorParams{
		Frequency:        getDefaultFloat(measurement.Frequency, 1.0),
		LowerBound:       getDefaultFloat(measurement.LowerBound, 0.0),
		UpperBound:       getDefaultFloat(measurement.UpperBound, 1.0),
		Precision:        getDefaultFloat(measurement.Precision, 0.01),
		Amplitude:        getDefaultFloat(measurement.Amplitude, 1.0),
		AngularFrequency: getDefaultFloat(measurement.AngularFrequency, 2*math.Pi),
		Phase:            getDefaultFloat(measurement.Phase, 0),
		SequenceValues:   measurement.SequenceValues,
	}

	value := gen.Generate(*property.Value, params)
	return value, nil
}

func getDefaultFloat(value *float64, defaultVal float64) float64 {
	if value != nil {
		return *value
	}
	return defaultVal
}
