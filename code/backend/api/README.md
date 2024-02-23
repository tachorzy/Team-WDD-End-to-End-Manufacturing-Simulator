# wdd api

This is our serverless REST API.

## Technologies

- Go - [Documentation](https://go.dev/doc/)
- AWS Lambda - [Documentation](https://docs.aws.amazon.com/lambda/)
- AWS API Gateway - [Documentation](https://docs.aws.amazon.com/apigateway/)

## Requirements

Make sure you have the following on your machine:
- Go - [Download & Install](https://go.dev/dl/)

## Usage

Generate code coverage report:
```bash
go test ./pkg/... -coverprofile="build/coverage.out"
go tool cover -html="build/coverage.out" -o build/coverage.html
```

TBA ( SAM for local testing )

## Manual Deployment

On Windows, follow these steps:

1. Build the Go application
```bash
$env:GOOS = "linux"; $env:GOARCH = "amd64"; go build -o build/bootstrap <PATH_TO_LAMBDA_FUNCTION>/main.go
```

2. Zip the binary with a third party tool, 7z
```bash
7z a ./build/main.zip ./build/bootstrap
```

3. Upload the zip file to the target lambda function

4. Test the endpoint on API Gateway

## Folder Structure

`/cmd`: project entry

`/pkg`: source code folder

`/build`: any compiled or generated files

`/pkg/lambda`: temporarily for manual deployment

`/pkg/handlers`: describes the logic for each endpoint 

`/pkg/routes`: describes what each endpoint are
