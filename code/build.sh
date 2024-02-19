# backend
cd code/backend/api
go get ./...
go build -o build/main -v cmd/main.go
go test ./...

# frontend|
npm install
npm ci
cd code/manufacturing-sim
npm run lint:fix
npm run test:coverage
