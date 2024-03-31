package floorplan

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

func NewCreateFloorPlanHandler(db DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleCreateFloorPlanRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"Content-Type":                 "application/json",
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "*",
	}

	var requestBody map[string]interface{}
	if err := json.Unmarshal([]byte(request.Body), &requestBody); err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
		}, nil
	}

	imageData, hasImage := requestBody["imageData"].(string)
	if !hasImage {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       "Missing imageData field in request body",
		}, nil
	}

	delete(requestBody, "imageData")
	floorplanData, err := FloorPlanJSONMarshal(requestBody)
	if err != nil {
		return events.APIGatewayProxyResponse{}, fmt.Errorf("error re-preparing floorplan data: %w", err)
	}

	var floorplan Floorplan
	if err := json.Unmarshal(floorplanData, &floorplan); err != nil {
		return events.APIGatewayProxyResponse{}, fmt.Errorf("error unmarshalling floorplan data: %w", err)
	}

	floorplan.FloorplanID = uuid.NewString()
	floorplan.DateCreated = time.Now().Format(time.RFC3339)

	decodedImageData, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    headers,
			Body:       fmt.Sprintf("Error decoding image data: %s", err.Error()),
		}, nil
	}

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return events.APIGatewayProxyResponse{}, fmt.Errorf("error loading AWS config: %w", err)
	}
	s3Client := s3.NewFromConfig(cfg)

	imageFileName := fmt.Sprintf("floorplans/%s.jpg", floorplan.FloorplanID)
	uploader := manager.NewUploader(s3Client)
	_, err = uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String("wingstopdrivenbucket"),
		Key:         aws.String(imageFileName),
		Body:        bytes.NewReader(decodedImageData),
		ContentType: aws.String("image/jpeg"),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error uploading image to S3: %s", err.Error()),
		}, nil
	}

	floorplan.ImageData = fmt.Sprintf("https://%s.s3.amazonaws.com/%s", "wingstopdrivenbucket", imageFileName)

	av, err := FloorPlanMarshalMap(floorplan)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error marshalling floorplan to DynamoDB format: %s", err.Error()),
		}, nil
	}

	_, err = h.DynamoDB.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String("Floorplan"),
		Item:      av,
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    headers,
			Body:       fmt.Sprintf("Error inserting floorplan into DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    headers,
		Body:       fmt.Sprintf("Floorplan created successfully with image. ID: %s", floorplan.FloorplanID),
	}, nil
}
