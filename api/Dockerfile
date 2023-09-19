FROM golang:1.21-alpine as base
RUN apk update
WORKDIR /src/gametrakr
COPY go.mod go.sum ./
COPY . .
RUN go build -mod=readonly -o gametrakr .

FROM alpine:latest as binary
COPY --from=base /src/gametrakr/gametrakr .
EXPOSE 80
CMD [ "./gametrakr" ]
