# wdd api

This is our serverless REST API.

## Technologies

- Go - [Documentation](https://go.dev/doc/)
- AWS Lambda - [Documentation](https://docs.aws.amazon.com/lambda/)
- AWS API Gateway - [Documentation](https://docs.aws.amazon.com/apigateway/)

## Requirements

Make sure you have the following on your machine:
- Go - [Download & Install](https://go.dev/dl/)

Make sure you have the golangci tool, here is the command:
```bash
go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.51.0
```

Make sure you have a zip tool, here is the recommended:
```bash
go install github.com/aws/aws-lambda-go/cmd/build-lambda-zip@latest
```

## Usage

Lint:
```bash
golangci-lint run ./...
```

Generate code coverage report:
```bash
go test -v ./internal/... -coverprofile="build/coverage.out"
go tool cover -html="build/coverage.out" -o build/coverage.html
```

TBA ( SAM for local testing )

## Manual Deployment (Windows)

Follow these steps and run the commands in Powershell:

1. Set environment variables for Linux build
```bash
$env:GOOS = "linux"
$env:GOARCH = "amd64"
$env:CGO_ENABLED = "0"
```

2. Replace `<PATH_TO_LAMBDA_FUNCTION>`, and build the Go application
```bash
go build -o build/bootstrap <PATH_TO_LAMBDA_FUNCTION>/main.go
```

3. Zip the binary with a zip tool
```bash
~\Go\Bin\build-lambda-zip.exe -o build/bootstrap.zip build/bootstrap
```

4. Upload the zip file to the target lambda function

5. Test the endpoint on API Gateway

## Folder Structure

`/cmd`: project entry

`/internal`: source code folder

`/pkg`: old source code folder

`/build`: any compiled or generated files

`/pkg/lambda`: temporarily for manual deployment

`/pkg/handlers`: describes the logic for each endpoint 

`/pkg/routes`: describes what each endpoint are

## Debugging

1. AttributeValue Marshaling Error

### Problem
Unable to find primary key in item

### Solution
Add `dynamodbav` to Go struct types

### Example
```go
FactoryId   string   `json:"factoryId" dynamodbav:"factoryId"`
```

### Reference
- https://stackoverflow.com/questions/56827932/one-or-more-parameter-values-were-invalid-missing-the-key-id-in-the-item-status
- https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue
