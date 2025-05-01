package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"http-nats-services/presentation"
	"os"
)

// service usage example
//
//	curl -X POST -d '{"userId":"2eec8abb-c0e2-4e9a-87a6-88c8fdadeed4"}' https://cloud-wallet.xfsc.dev/presentation-demo/request
const (
	ServicePort = ":8080"
	NatsUrl     = "localhost:4222"
)

func main() {
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = NatsUrl
	}
	port := os.Getenv("PORT")
	var servicePort string
	if port == "" {
		servicePort = ServicePort
	} else {
		servicePort = fmt.Sprintf(":%s", port)
	}
	server := gin.Default()
	presentation.RequestPresentationRoute(server, natsURL)
	server.Run(servicePort)
}
