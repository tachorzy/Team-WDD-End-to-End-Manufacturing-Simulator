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

TBA ( SAM for local testing )

## Manual Deployment

On Windows, follow these steps:

1. Build the Go application
```bash
$env:GOOS = "linux"; $env:GOARCH = "amd64"; go build -o main ./lambda/<function>
```

2. Zip the binary with a third party tool, 7z
```bash
7z a deployment.zip .\main
```

3. Upload the binary to the target lambda function

## Folder Structure

`/lambda`: temporarily for manual deployment

`/handlers`: describes the logic for each endpoint 

`/routes`: describes what each endpoint are
