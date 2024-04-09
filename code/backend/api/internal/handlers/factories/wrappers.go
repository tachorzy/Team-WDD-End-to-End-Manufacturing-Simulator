package factories

import (
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
)

var FactoryMarshalMap = attributevalue.MarshalMap
var FactoryUnmarshalMap = attributevalue.UnmarshalMap
var FactoryUnmarshalListOfMaps = attributevalue.UnmarshalListOfMaps
