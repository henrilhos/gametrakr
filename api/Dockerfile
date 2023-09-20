# Building the binary
FROM golang:1.21-alpine as build

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /go/src/gametrakr

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -a -installsuffix cgo -o main .

# Creating the final Image
FROM alpine:latest as release

WORKDIR /gametrakr

COPY --from=build /go/src/gametrakr/main .

RUN apk -U upgrade \
    && apk add --no-cache dumb-init ca-certificates \
    && chmod +x /gametrakr/main

EXPOSE 80

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
