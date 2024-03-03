go clean -cache
[ $? -eq 0 ] || exit 1

go build -o build -v ./cmd/...
[ $? -eq 0 ] || exit 1

golangci-lint run ./...
[ $? -eq 0 ] || exit 1

go test -v ./internal/... -coverprofile="build/coverage.out"
[ $? -eq 0 ] || exit 1

go tool cover -func="build/coverage.out"
[ $? -eq 0 ] || exit 1
