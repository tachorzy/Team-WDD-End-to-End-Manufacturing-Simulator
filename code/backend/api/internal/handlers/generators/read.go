package generators

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	ddbtypes "github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func NewPropertyValuesHandler(db types.DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleReadCalculationsRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	PropertyID := request.QueryStringParameters["propertyId"]
	headers := standardHeaders()

	property, err := fetchProperty(ctx, h.DynamoDB, PropertyID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error(), headers)
	}

	measurement, err := fetchMeasurement(ctx, h.DynamoDB, property.MeasurementID)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error(), headers)
	}

	value, err := generateMeasurementValue(property, measurement)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, err.Error(), headers)
	}

	return jsonResponse(map[string]interface{}{"value": value}, headers)
}

func fetchProperty(ctx context.Context, db types.DynamoDBClient, propertyID string) (*types.Property, error) {
	getPropertyInput := &dynamodb.GetItemInput{
		TableName: aws.String(PROPERTYTABLE),
		Key: map[string]ddbtypes.AttributeValue{
			"propertyId": &ddbtypes.AttributeValueMemberS{Value: propertyID},
		},
	}

	getPropertyOutput, err := db.GetItem(ctx, getPropertyInput)
	if err != nil {
		return nil, fmt.Errorf("error finding property: %s", err)
	}
	if getPropertyOutput.Item == nil {
		return nil, fmt.Errorf("property with ID %s not found", propertyID)
	}

	var property types.Property
	err = wrappers.UnmarshalMap(getPropertyOutput.Item, &property)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling property: %s", err)
	}

	return &property, nil
}

func fetchMeasurement(ctx context.Context, db types.DynamoDBClient, measurementID string) (*types.Measurement, error) {
	getMeasurementInput := &dynamodb.GetItemInput{
		TableName: aws.String(MEASUREMENTTABLE),
		Key: map[string]ddbtypes.AttributeValue{
			"measurementId": &ddbtypes.AttributeValueMemberS{Value: measurementID},
		},
	}

	getMeasurementOutput, err := db.GetItem(ctx, getMeasurementInput)
	if err != nil {
		return nil, fmt.Errorf("error finding measurement: %s", err)
	}
	if getMeasurementOutput.Item == nil {
		return nil, fmt.Errorf("measurement with ID %s not found", measurementID)
	}

	var measurement types.Measurement
	err = wrappers.UnmarshalMap(getMeasurementOutput.Item, &measurement)
	if err != nil {
		return nil, fmt.Errorf("error marshalling measurement: %s", err)
	}

	return &measurement, nil
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

func standardHeaders() map[string]string {
	return map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}
}

func errorResponse(statusCode int, msg string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers:    headers,
		Body:       msg,
	}, nil
}

func jsonResponse(data interface{}, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	responseBody, err := json.Marshal(data)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Headers: headers, Body: fmt.Sprintf("Error marshalling response: %s", err)}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       string(responseBody),
	}, nil
}
func getDefaultFloat(value *float64, defaultVal float64) float64 {
	if value != nil {
		return *value
	}
	return defaultVal
}
