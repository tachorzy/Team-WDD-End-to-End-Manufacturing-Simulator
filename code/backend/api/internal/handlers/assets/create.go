package assets

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
	"net/http"
	"time"
)

func NewCreateAssetHandler(db DynamoDBClient) *Handler {
	return &Handler{
		DynamoDB: db,
	}
}

func (h Handler) HandleCreateAssetRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var asset Asset

	if err := json.Unmarshal([]byte(request.Body), &asset); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	asset.AssetID = uuid.NewString()
	asset.DateCreated = time.Now().Format(time.RFC3339)

	av, err := AssetMarshalMap(asset)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error marshalling asset to DynamoDB format: %s", err.Error()),
		}, nil
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(TABLENAME),
	}

	if _, err = h.DynamoDB.PutItem(ctx, input); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error putting item into DynamoDB: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       fmt.Sprintf("assetID %s created successfully", asset.AssetID),
	}, nil
}
