FROM golang:1.22.5-alpine as builder

WORKDIR /app

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY . .

FROM golang:1.22.5-alpine as runner

WORKDIR /app

COPY --from=builder /app /app

RUN go install github.com/githubnemo/CompileDaemon@latest

ENTRYPOINT CompileDaemon --build="go build cmd/main.go" --command=./main
