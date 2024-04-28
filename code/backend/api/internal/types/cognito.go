package types

import (
	"context"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
)

type Cognito interface {
	InitiateAuth(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error)
	SignUp(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error)
}
