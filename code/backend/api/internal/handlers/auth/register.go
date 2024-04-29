package auth

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	ctypes "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"net/http"
	"os"
	"wdd/api/internal/types"
	"wdd/api/internal/wrappers"
)

func NewRegisterHandler(cognito types.Cognito) *Handler {
	return &Handler{
		Cognito: cognito,
	}
}

func (h Handler) HandleRegisterRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var user types.User
	if err := wrappers.JSONUnmarshal([]byte(request.Body), &user); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	signUpInput := &cognitoidentityprovider.SignUpInput{
		ClientId: aws.String(COGNITOAPPCLIENTID),
		Username: aws.String(user.Username),
		Password: aws.String(user.Password),
		UserAttributes: []ctypes.AttributeType{
			{
				Name:  aws.String("name"),
				Value: aws.String(user.Name),
			},
		},
		SecretHash: aws.String(computeSecretHash(os.Getenv("CLIENT_SECRET"), user.Username, COGNITOAPPCLIENTID)),
	}

	if _, err := h.Cognito.SignUp(ctx, signUpInput); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error creating user in Cognito: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       "Register successfully",
	}, nil
}
