package presentation

import (
	"github.com/gin-gonic/gin"
	pluginSdk "gitlab.eclipse.org/eclipse/xfsc/personal-credential-manager-cloud/plugins/core"
	"net/http"
)

const PresentationName = "demo presentation"

func RequestPresentationRoute(s *gin.Engine, natsUrl string) {
	s.POST("/request", func(c *gin.Context) {
		res, err := CreatePresentation(c, natsUrl)
		if err == nil {
			c.JSON(http.StatusOK, res)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
	})
}

func getBroker(natsUrl string) (pluginSdk.Config, pluginSdk.EventBus) {
	config := pluginSdk.Config{
		LogLevel: "info",
		IsDev:    true,
		Name:     ServiceName,
		Tenant:   TenantId,
		Nats: struct {
			Url        string
			QueueGroup string
		}(struct {
			Url        string `envconfig:"PLUGIN_NATS_URL"`
			QueueGroup string `envconfig:"PLUGIN_NATS_QUEUEGROUP"`
		}(struct {
			Url        string
			QueueGroup string
		}{Url: natsUrl, QueueGroup: "nats-wrapper-service"})),
		Crypto: struct{ Namespace string }(struct {
			Namespace string `envconfig:"PLUGIN_CRYPTO_NAMESPACE"`
		}(struct{ Namespace string }{Namespace: ""})),
	}
	pluginSdk.SetLibConfig(config)
	broker := pluginSdk.NewEventBus()
	return config, broker
}

type CreatePresentationRequestPayload struct {
	UserId string `json:"userId" binding:"required"`
}

type CreatePresentationResponse struct {
	PresentationId string `json:"presentationId"`
}

func CreatePresentation(c *gin.Context, natsUrl string) (*CreatePresentationResponse, error) {
	var payload CreatePresentationRequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return nil, err
	}
	_, bus := getBroker(natsUrl)
	id, err := createPresentation(PresentationName, payload.UserId, bus)
	if err != nil {
		return nil, err
	}
	return &CreatePresentationResponse{
		PresentationId: id,
	}, nil
}
