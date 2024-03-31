package floorplan

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
)

var FloorPlanMarshalMap = attributevalue.MarshalMap
var FloorPlanUnmarshalMap = attributevalue.UnmarshalMap
var FloorPlanUnmarshalListOfMaps = attributevalue.UnmarshalListOfMaps
var FloorPlanJSONMarshal = json.Marshal
