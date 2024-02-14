package routes

import (
	"context"
	"github.com/aws/aws-lambda-go/events"
	"wdd/api/handlers"
)

func InitializeRoutes() func(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return func(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		switch request.Path {
		case "/hello":
			return handlers.HelloHandler(ctx, request)
		default:
			return events.APIGatewayProxyResponse{
				StatusCode: 404,
				Body:       "Not Found",
			}, nil
		}
	}
}
