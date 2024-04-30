package mocks

import (
	"context"
	cognito "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"wdd/api/internal/types"
)

type CognitoClient struct {
	types.Cognito
	InitiateAuthFunc func(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error)
	SignUpFunc       func(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error)
}

func (m *CognitoClient) InitiateAuth(ctx context.Context, params *cognito.InitiateAuthInput, optFns ...func(*cognito.Options)) (*cognito.InitiateAuthOutput, error) {
	return m.InitiateAuthFunc(ctx, params, optFns...)
}

func (m *CognitoClient) SignUp(ctx context.Context, params *cognito.SignUpInput, optFns ...func(*cognito.Options)) (*cognito.SignUpOutput, error) {
	return m.SignUpFunc(ctx, params, optFns...)
}
