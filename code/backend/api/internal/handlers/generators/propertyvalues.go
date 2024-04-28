package generators

import (
	"context"
	"fmt"
	"log"
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
		newValue, err := generateNewValue(ctx, &prop, h.DynamoDB)
		if err != nil {
			log.Printf("Error generating new value for property %s: %v", prop.PropertyID, err)
			continue
		}

		propertyData, err := fetchOrCreatePropertyData(ctx, h.DynamoDB, prop)
		if err != nil {
			log.Printf("Error fetching or creating property data for property %s: %v", prop.PropertyID, err)
			continue
		}

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
		return nil, fmt.Errorf("failed to get item: %v", err)
	}
	var propertyData types.PropertyData
	if result.Item == nil {
		propertyData = types.PropertyData{
			PropertyID:     property.PropertyID,
			Values:         make(map[string]types.Value),
			LastCalculated: property.Value,
		}
	} else {
		if marsherr := wrappers.UnmarshalMap(result.Item, &propertyData); marsherr != nil {
			return nil, fmt.Errorf("failed to unmarshal item: %v", marsherr)
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
func generateNewValue(ctx context.Context, property *types.Property, db types.DynamoDBClient) (float64, error) {
	if property.MeasurementID == "" {
		return 0, fmt.Errorf("property with ID %s has no measurement", property.PropertyID)
	}

	getMeasurement := &dynamodb.GetItemInput{
		TableName: aws.String(MEASUREMENTTABLE),
		Key: map[string]ddbtypes.AttributeValue{
			"measurementId": &ddbtypes.AttributeValueMemberS{Value: property.MeasurementID},
		},
	}

	result, err := db.GetItem(ctx, getMeasurement) //line 146
	if err != nil {
		return 0, fmt.Errorf("error finding measurement: %s", err)
	}

	if result.Item == nil {
		return 0, fmt.Errorf("measurement with ID %s not found", property.MeasurementID)
	}

	var measurement types.Measurement
	if err := wrappers.UnmarshalMap(result.Item, &measurement); err != nil {
		return 0, fmt.Errorf("error marshalling measurement: %s", err)
	}

	value, valerr := generateMeasurementValue(property, &measurement)
	if valerr != nil {
		return 0, fmt.Errorf("error generating value: %s", valerr)
	}
	return value, nil
}
