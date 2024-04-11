package wrappers

import (
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
)

var MarshalMap = attributevalue.MarshalMap
var UnmarshalMap = attributevalue.UnmarshalMap
var UnmarshalListOfMaps = attributevalue.UnmarshalListOfMaps

var UpdateExpressionBuilder = func(update expression.UpdateBuilder) (expression.Expression, error) {
	return expression.NewBuilder().WithUpdate(update).Build()
}
