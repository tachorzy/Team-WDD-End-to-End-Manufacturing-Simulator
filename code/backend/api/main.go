package main

import (
    "github.com/aws/aws-lambda-go/lambda"
    "wdd/api/routes"
)

func main() {
    handler := routes.InitializeRoutes()
    lambda.Start(handler)
}
