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

func NewLoginHandler(cognito types.Cognito) *Handler {
	return &Handler{
		Cognito: cognito,
	}
}

func (h Handler) HandleLoginRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var user types.User
	if err := wrappers.JSONUnmarshal([]byte(request.Body), &user); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       fmt.Sprintf("Error parsing JSON body: %s", err.Error()),
		}, nil
	}

	authInput := &cognitoidentityprovider.InitiateAuthInput{
		AuthFlow: ctypes.AuthFlowTypeUserPasswordAuth,
		AuthParameters: map[string]string{
			"USERNAME":    user.Username,
			"PASSWORD":    user.Password,
			"SECRET_HASH": computeSecretHash(os.Getenv("CLIENT_SECRET"), user.Username, COGNITOAPPCLIENTID),
		},
		ClientId: aws.String(COGNITOAPPCLIENTID),
	}

	result, err := h.Cognito.InitiateAuth(ctx, authInput)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error login: %s", err.Error()),
		}, nil
	}

	responseBody, err := wrappers.JSONMarshal(map[string]interface{}{
		"message": "User login successfully",
		"userId":  result,
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf("Error marshalling response body: %s", err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(responseBody),
	}, nil
}
