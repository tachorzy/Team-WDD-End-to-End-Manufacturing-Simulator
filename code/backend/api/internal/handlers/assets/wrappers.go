package assets

import (
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"

	"encoding/json"
)

var AssetMarshalMap = attributevalue.MarshalMap
var AssetUnmarshalMap = attributevalue.UnmarshalMap
var AssetUnmarshalListOfMaps = attributevalue.UnmarshalListOfMaps
var AssetJSONMarshal = json.Marshal
