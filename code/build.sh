# backend
cd ./backend/api
go get ./...
go build -o build/main -v cmd/main.go
go test ./...

# frontend
cd ../../manufacturing-sim
npm ci
npm run lint:fix
npm run test:coverage
