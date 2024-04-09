package models

import (
	"wdd/api/internal/types"
)

const TABLENAME = "Model"

type Model struct {
	ModelID     string    `json:"modelId" dynamodbav:"modelId"`
	Attributes  *[]string `json:"attributes,omitempty" dynamobdav:"attributes"`
	Properties  *[]string `json:"properties,omitempty" dynamodbav:"properties"`
	DateCreated string    `json:"dateCreated" dynamodbav:"Date Created"`
}

type Handler struct {
	DynamoDB types.DynamoDBClient
}
