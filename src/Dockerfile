# Set up Go server
FROM golang:latest
RUN mkdir /app
ADD . /app
WORKDIR /app

RUN go mod download
RUN go build -o app .
EXPOSE 8081
CMD ./app