package generators

import (
	"context"
	"fmt"
	"log"
	"math"
	"net/http"
	"time"
	"wdd/api/internal/wrappers"

	"wdd/api/internal/types"

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
func (h *Handler) HandlePropertyValue(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json",
	}

	input := &dynamodb.ScanInput{
		TableName: aws.String(PROPERTYTABLE),
	}
	result, err := h.DynamoDB.Scan(ctx, input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Error scanning property data: %v", err),
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
		}, nil
	}

	var allProperties []types.Property
	err = wrappers.UnmarshalListOfMaps(result.Items, &allProperties)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to unmarshal properties: %v", err),
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
		}, nil
	}

	for _, property := range allProperties {
		prop := property
		log.Printf("Attempting to fetch/create PropertyData for property ID: %s", prop.PropertyID)
		propertyData, err1 := fetchOrCreatePropertyData(ctx, h.DynamoDB, prop)
		if err1 != nil {
			log.Printf("Error fetching or creating property data for property %s: %v", prop.PropertyID, err1)
			continue
		}
		log.Printf("PropertyData fetched/created: %+v", propertyData)

		newValue, valerr := generateNewValue(ctx, &prop, propertyData, h.DynamoDB)
		if valerr != nil {
			log.Printf("Error generating new value for property %s: %v", prop.PropertyID, valerr)
			continue
		}

		log.Printf("Updating PropertyData with new value: %f", newValue)
		err = updatePropertyData(ctx, h.DynamoDB, propertyData, newValue)
		if err != nil {
			log.Printf("Error updating property data for property %s: %v", prop.PropertyID, err)
			continue
		}
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       "Processed all properties successfully",
	}, nil
}

func fetchOrCreatePropertyData(ctx context.Context, db types.DynamoDBClient, property types.Property) (*types.PropertyData, error) {
	key := map[string]ddbtypes.AttributeValue{"propertyId": &ddbtypes.AttributeValueMemberS{Value: property.PropertyID}}
	input := &dynamodb.GetItemInput{
		TableName: aws.String(PROPERTYDATA),
		Key:       key,
	}
	result, err := db.GetItem(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("failed to get item for PropertyID %s: %v", property.PropertyID, err)
	}
	var propertyData types.PropertyData
	if result.Item == nil {
		propertyData = types.PropertyData{
			PropertyID:     property.PropertyID,
			Values:         make(map[string]types.Value),
			LastCalculated: property.Value,
		}
		av, marshalErr := wrappers.MarshalMap(propertyData)
		if marshalErr != nil {
			return nil, fmt.Errorf("failed to marshal new PropertyData: %v", marshalErr)
		}
		putInput := &dynamodb.PutItemInput{
			TableName: aws.String(PROPERTYDATA),
			Item:      av,
		}
		_, putErr := db.PutItem(ctx, putInput)
		if putErr != nil {
			return nil, fmt.Errorf("failed to create new PropertyData for PropertyID %s: %v", property.PropertyID, putErr)
		}
	} else {
		if unmarshalErr := wrappers.UnmarshalMap(result.Item, &propertyData); unmarshalErr != nil {
			return nil, fmt.Errorf("failed to unmarshal existing PropertyData: %v", unmarshalErr)
		}
	}

	return &propertyData, nil
}
func updatePropertyData(ctx context.Context, db types.DynamoDBClient, propertyData *types.PropertyData, newValue float64) error {
	timestamp := time.Now().Format(time.RFC3339)
	propertyData.Values[timestamp] = types.Value{
		Date:  timestamp,
		Value: newValue,
	}
	propertyData.LastCalculated = &newValue

	updatedPropertyData, err := wrappers.MarshalMap(propertyData)
	if err != nil {
		return fmt.Errorf("failed to marshal property data: %v", err)
	}
	input := &dynamodb.PutItemInput{
		TableName: aws.String(PROPERTYDATA),
		Item:      updatedPropertyData,
	}
	_, err = db.PutItem(ctx, input)
	if err != nil {
		return fmt.Errorf("failed to put item: %v", err)
	}
	return nil
}
func generateNewValue(ctx context.Context, property *types.Property, propertyData *types.PropertyData, db types.DynamoDBClient) (float64, error) {
	measurement, err := fetchMeasurement(ctx, db, property.MeasurementID)
	if err != nil {
		return 0, fmt.Errorf("error retrieving measurement for property %s: %v", property.PropertyID, err)
	}

	generator, err := NewGenerator(property.GeneratorType)
	if err != nil {
		return 0, fmt.Errorf("error creating generator for property %s: %v", property.PropertyID, err)
	}

	lastValue := 1.0
	if propertyData.LastCalculated != nil {
		lastValue = *propertyData.LastCalculated
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

	newValue := generator.Generate(lastValue, params)
	return newValue, nil
}
