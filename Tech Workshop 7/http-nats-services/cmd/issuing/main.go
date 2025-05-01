package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	cloudeventprovider "gitlab.eclipse.org/eclipse/xfsc/libraries/messaging/cloudeventprovider"

	"gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/libraries/messaging"
	msgCommon "gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/libraries/messaging/common"

	logger "github.com/sirupsen/logrus"
)

// How to test
//curl -X POST \
//-H "Content-Type: application/json" \
//-d '{"name": "John", "last_name": "Doe"}' \
//"https://cloud-wallet.xfsc.dev/issuing-demo/issue"

const (
	ServicePort = ":8070"
	NatsUrl     = "localhost:4222"
)

func RequestIssuance(ctx *gin.Context) (any, error) {

	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = NatsUrl
	}

	tenantId := "tenant_space"

	var payload map[string]interface{}
	err := json.NewDecoder(ctx.Request.Body).Decode(&payload)

	if err != nil {
		logger.Error("unable to decode payload")
		ctx.AbortWithStatus(400)
		return nil, err
	}

	isValid := isValidPayload(payload)
	if !isValid {
		ctx.AbortWithStatus(400)
		return nil, errors.New("Missing required fields")
	}

	var req = messaging.IssuanceRequest{
		Request: msgCommon.Request{
			TenantId:  tenantId,
			RequestId: uuid.NewString(),
		},
		Payload:    payload,
		Identifier: "DeveloperCredential",
	}

	data, err := json.Marshal(req)
	if err != nil {
		ctx.AbortWithStatus(400)
		return nil, err
	}

	fmt.Println(string(data))

	client, err := cloudeventprovider.New(
		cloudeventprovider.Config{
			Protocol: cloudeventprovider.ProtocolTypeNats,
			Settings: cloudeventprovider.NatsConfig{
				Url:          natsURL,
				QueueGroup:   "demo-nats-http",
				TimeoutInSec: 0,
			},
		},
		cloudeventprovider.ConnectionTypeReq,
		"issuer.dummycontentsigner.request",
	)

	if err != nil {
		logger.Error(err, "error during client creation")
		ctx.AbortWithStatus(400)
		return nil, err
	}

	event, err := cloudeventprovider.NewEvent("issuance-client", messaging.EventTypeGetIssuerMetadata, data)
	if err != nil {
		ctx.AbortWithStatus(400)
		return nil, err
	}
	logger.Debug(string(data))
	repl, err := client.RequestCtx(ctx, event)
	if err != nil || repl == nil {
		logger.Error(err, "error during issue request")
		ctx.AbortWithStatus(400)
		return nil, err
	}
	var metadata messaging.IssuanceReply
	err = json.Unmarshal(repl.DataEncoded, &metadata)
	logger.Debug(string(repl.DataEncoded))
	if err != nil || metadata.Error != nil {
		if err == nil {
			logger.Error(errors.New("issuance reply error"), metadata.Error.Msg)
		} else {
			logger.Error(err, "Error during issue reply")
		}

		ctx.AbortWithStatus(400)
		return nil, err
	}

	return metadata.Offer, nil
}

func main() {
	port := os.Getenv("PORT")
	var servicePort string
	if port == "" {
		servicePort = ServicePort
	} else {
		servicePort = fmt.Sprintf(":%s", port)
	}
	server := gin.Default()
	server.POST("/issue", func(ctx *gin.Context) {
		v, err := RequestIssuance(ctx)
		if err == nil {
			ctx.JSON(http.StatusOK, v)
		} else {
			ctx.JSON(http.StatusBadRequest, fmt.Sprintf("err: %v", err))
		}
	})
	serverPort := os.Getenv("PORT")
	if serverPort == "" {
		serverPort = "8080"
	}
	server.Run(fmt.Sprintf(":%s", serverPort))
}

func isValidPayload(payload map[string]interface{}) bool {
	// Check if "name" and "last_name" fields are present
	_, nameExists := payload["name"]
	_, lastNameExists := payload["last_name"]

	// Return true if both fields are present, otherwise false
	return nameExists && lastNameExists
}
