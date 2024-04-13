package types

type Location struct {
	Longitude *float64 `json:"longitude,omitempty" dynamodbav:"longitude"`
	Latitude  *float64 `json:"latitude,omitempty" dynamodbav:"latitude"`
}

type Factory struct {
	FactoryID   string    `json:"factoryId" dynamodbav:"factoryId"`
	Name        *string   `json:"name,omitempty" dynamodbav:"name"`
	Location    *Location `json:"location,omitempty" dynamodbav:"location"`
	Description *string   `json:"description,omitempty" dynamodbav:"description"`
	DateCreated string    `json:"dateCreated" dynamodbav:"Date Created"`
}

type FloorplanCoords struct {
	Longitude *float64 `json:"longitude,omitempty" dynamodbav:"longitude"`
	Latitude  *float64 `json:"latitude,omitempty" dynamodbav:"latitude"`
}

type Asset struct {
	AssetID         string           `json:"assetId" dynamodbav:"assetId"`
	FactoryID       *string          `json:"factoryId,omitempty" dynamodbav:"factoryId"`
	Name            *string          `json:"name,omitempty" dynamodbav:"name"`
	FloorplanCoords *FloorplanCoords `json:"floorplanCoords,omitempty" dynamodbav:"floorplanCoords"`
	ModelID         *string          `json:"modelId,omitempty" dynamodbav:"modelId"`
	FloorplanID     *string          `json:"floorplanId,omitempty" dynamodbav:"floorplanId"`
	DateCreated     string           `json:"dateCreated" dynamodbav:"dateCreated"`
	ImageData       string           `json:"imageData" dynamodbav:"imageData"`
	ModelURL        *string          `json:"modelUrl,omitempty" dynamodbav:"modelUrl"`
	Type            *string          `json:"type,omitempty" dynamodbav:"type"`
	Description     *string          `json:"description,omitempty" dynamodbav:"description"`
}

type Floorplan struct {
	FloorplanID string `json:"floorplanId" dynamodbav:"floorplanId"`
	FactoryID   string `json:"factoryId" dynamodbav:"factoryId"`
	DateCreated string `json:"dateCreated" dynamodbav:"dateCreated"`
	ImageData   string `json:"imageData" dynamodbav:"imageData"`
}

type Model struct {
	ModelID     string    `json:"modelId" dynamodbav:"modelId"`
	Attributes  *[]string `json:"attributes,omitempty" dynamobdav:"attributes"`
	Properties  *[]string `json:"properties,omitempty" dynamodbav:"properties"`
	DateCreated string    `json:"dateCreated" dynamodbav:"dateCreated"`
}
