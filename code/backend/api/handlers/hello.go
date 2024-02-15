package handlers

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
)

func HelloHandler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       "Welcome to wdd API!",
	}, nil
}
