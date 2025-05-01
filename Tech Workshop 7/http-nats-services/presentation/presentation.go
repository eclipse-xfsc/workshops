package presentation

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"gitlab.eclipse.org/eclipse/xfsc/libraries/messaging/cloudeventprovider"
	"gitlab.eclipse.org/eclipse/xfsc/libraries/ssi/oid4vip/model/presentation"
	"gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/libraries/messaging"
	"gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/libraries/messaging/common"
	pluginSdk "gitlab.eclipse.org/eclipse/xfsc/personal-credential-manager-cloud/plugins/core"
)

const (
	PresentationAuthorizationType       = "verifier.presentation.authorization"
	PresentationAuthorizationErrorType  = "verifier.presentation.authorization.error"
	PresentationAuthorizationRemoteType = "verifier.presentation.authorization.remote"

	PresentationRequestNotification = "presentationRequest"

	PresentationRequestTTL = 604800 // 1 week in seconds

	TenantId    = "tenant_space"
	ServiceName = "presentation-nats-wrapper-service"

	AuthorizationTopic = "presentation.authorisation"
)

//const userId = "2eec8abb-c0e2-4e9a-87a6-88c8fdadeed4"

//const userId = "4c216ab0-a91a-413f-8e97-a32eee7a4ef4"

type PresentationAuthorizationCreationRequest struct {
	common.Request
	PresentationDefinition presentation.PresentationDefinition `json:"presentationDefinition"`
	Ttl                    int                                 `json:"ttl"`
	TenantUri              string                              `json:"tenant_uri"`
	TargetUri              string                              `json:"target_uri"`
	RequestObjectUri       string                              `json:"requestobject_uri"`
	Nonce                  []byte                              `json:"nonce"`
}

type PresentationAuthorizationCreationReply struct {
	BaseReply      common.Reply
	PresentationId string `json:"presentation_id"`
	RequestUri     string `json:"request_uri"`
}

type PresentationAuthorizationRemoteRequest struct {
	common.Request
	ClientId   string `json:"clientId"`
	RequestUri string `json:"request_uri"`
	Ttl        int    `json:"ttl"`
	Key        string `json:"key"`
	Did        string `json:"did"`
}

type PresentationRequestRecord struct {
	messaging.HistoryRecord
	TTL int `json:"ttl"`
}

func createPresentation(name string, userId string, broker pluginSdk.EventBus) (string, error) {
	reply, err := requestPresentation(broker, name)
	if err != nil {
		return "", err
	}
	err = handleRedirect(reply.RequestUri, broker)
	if err != nil {
		fmt.Printf("could not handle redirect: %t", err)
		return "", err
	}
	return notifyHolder(reply.PresentationId, userId, broker)
}

func handleRedirect(requestUri string, broker pluginSdk.EventBus) error {
	data := PresentationAuthorizationRemoteRequest{
		Request: common.Request{
			TenantId:  TenantId,
			RequestId: uuid.NewString(),
		},

		ClientId:   "https://cloud-wallet.xfsc.dev",
		RequestUri: requestUri,
		Ttl:        PresentationRequestTTL,
		Key:        "eckey",
		Did:        "did:web:cloud-wallet.xfsc.dev",
	}
	bdata, _ := json.Marshal(data)

	ev, _ := cloudeventprovider.NewEvent(ServiceName, PresentationAuthorizationRemoteType, bdata)
	return broker.Publish(context.Background(), AuthorizationTopic, ev)
}

func requestPresentation(broker pluginSdk.EventBus, name string) (*PresentationAuthorizationCreationReply, error) {
	req := PresentationAuthorizationCreationRequest{
		Request: common.Request{
			TenantId:  TenantId,
			RequestId: uuid.NewString(),
		},
		PresentationDefinition: getDefinitionWithConstraints("A", name),
		Ttl:                    PresentationRequestTTL, // one week
		TenantUri:              "cloud-wallet.xfsc.dev",
		RequestObjectUri:       "cloud-wallet.xfsc.dev/api/presentation/proof",
		TargetUri:              "cloud-wallet.xfsc.dev/api/presentation",
		Nonce:                  []byte{34, 34, 11},
	}
	data, _ := json.Marshal(req)
	ev, _ := cloudeventprovider.NewEvent(ServiceName, PresentationAuthorizationType, data)
	rep, err := broker.Request(context.Background(), "request", ev)
	if err != nil {
		fmt.Printf("Received error from nats: %s", err.Error())
		return nil, err
	}
	var reply PresentationAuthorizationCreationReply
	_ = rep.DataAs(&reply)

	json.Unmarshal(rep.DataEncoded, &reply)
	if reply.BaseReply.Error != nil {
		fmt.Printf(reply.BaseReply.Error.Msg)
	}

	return &reply, err
}

func notifyHolder(presentationId string, userId string, broker pluginSdk.EventBus) (string, error) {
	notification :=
		PresentationRequestRecord{
			HistoryRecord: messaging.HistoryRecord{
				Reply: common.Reply{
					TenantId:  TenantId,
					RequestId: presentationId,
					Error:     nil,
				},
				UserId:  userId,
				Message: "presentation request received",
			},
			TTL: PresentationRequestTTL,
		}
	nb, _ := json.Marshal(notification)
	accEv, _ := cloudeventprovider.NewEvent(ServiceName, PresentationRequestNotification, nb)
	err := broker.Publish(context.Background(), "accounts.record", accEv)
	if err != nil {
		return "", err
	} else {
		return presentationId, nil
	}
}

func getDefinitionWithConstraints(searchValue string, name string) presentation.PresentationDefinition {
	searchString := fmt.Sprintf("$.credentialSubject[?(@ =~ /%s/)]", searchValue)
	field := presentation.Field{
		Path: []string{searchString},
	}
	constraints := presentation.Constraints{
		LimitDisclosure: "",
		Fields:          []presentation.Field{field},
	}
	inputDescriptor := presentation.InputDescriptor{
		Description: presentation.Description{
			Id:         uuid.NewString(),
			FormatType: "ldp_vp",
		},
		Format:      presentation.Format{LDPVP: &presentation.FormatSpecification{}},
		Constraints: constraints,
		Group:       []string{},
	}
	result := presentation.PresentationDefinition{
		Description: presentation.Description{
			Id:         uuid.NewString(),
			Name:       name,
			Purpose:    "I wanna see it!",
			FormatType: "ldp_vp",
		},
		InputDescriptors: []presentation.InputDescriptor{inputDescriptor},
		Format:           presentation.Format{LDPVP: &presentation.FormatSpecification{}},
	}
	return result
}
