import requests
import curlify2
from pynats import NATSClient
import uuid
import json
from cloudevents.http import CloudEvent
from cloudevents.conversion import to_dict

baseurl = "https://cloud-wallet.xfsc.dev"
user_id = "4c216ab0-a91a-413f-8e97-a32eee7a4ef4"
userCryptoKeyNamespace="accountSpace"
userCryptoKeyGroup=user_id
userCryptoKeyId="23dedadb-ac64-45b0-870c-460778098c3a"
credTopic = "issuer.dummycontentsigner"
vc_payload = dict(name="Leonardo", last_name="Da Vinci")



def schemas():
    url = f"{baseurl}/.well-known/openid-credential-issuer"
    response = requests.get(url, verify=False)
    with open("commands.txt", "w") as f:
        f.write("\nGet Credential Schemas:\n\t")
        f.write(curlify2.Curlify(response.request).to_curl())

    if response.ok:
        return response.json()
    else:
        return {"error": response.text}
def issue(credType, credTopic, payload):
    nats_command = """nats req <credTopic>.request '{"type": "issuer.request", "source": "demo", "contenttype": "application/json", "data": {"tenant_id": "tenant_space", "request_id": "<UUID>", "payload": <payload>, "identifier": <credType>}}'
    """
    with open("commands.txt", "a") as f:
        f.write("\n\nIssue Credential by sending Nats Request using Nats cli:\n\t")
        # f.write("#Please substitute variable <credTopic>, <UUID>, <payload>, <credType> with appropriate values\n")
        f.write(nats_command.replace("<credTopic>", credTopic).replace("<UUID>", str(uuid.uuid4())).replace("<payload>", json.dumps(payload)).replace("<credType>", credType))

    with NATSClient(url="nats://localhost:4222") as client:
        client.connect()
        topic = credTopic+".request"
        req = dict(tenant_id="tenant_space", request_id=str(uuid.uuid4()), payload=payload, identifier=credType)
        attrs = {"type": "issuer.request", "source": "demo", "contenttype": "application/json"}
        event = CloudEvent(attributes=attrs, data=req)
        data = to_dict(event)
        reply = client.request(topic, payload=json.dumps(data).encode("utf-8"))
        return json.loads(reply.payload).get("data")

def createOffer(cred_offer):
    url = f"{baseurl}/api/offering/retrieve/{user_id}"
    response = requests.put(url, data=json.dumps(cred_offer), verify=False)
    with open("commands.txt", "a") as f:
        f.write("\n\nCreate Offer:\n\t")
        f.write(curlify2.Curlify(response.request).to_curl())
    return response.ok

def acceptOffer(offer_id, accepted = True):
    url = f"{baseurl}/api/offering/clear/{user_id}/{offer_id}"
    acceptance = dict(
        accept=accepted,
        holderKey=userCryptoKeyId,
        holderNamespace=userCryptoKeyNamespace,
        holderGroup=user_id
    )
    response = requests.delete(url, data=json.dumps(acceptance), verify=False)
    with open("commands.txt", "a") as f:
        f.write("\n\nAccept Offer:\n\t")
        f.write(curlify2.Curlify(response.request).to_curl())

    if response.ok:
        return response.json()
    else:
        return {"error": response.text}

def getOffers():
    url = f"{baseurl}/api/offering/list/{user_id}"
    response = requests.get(url, verify=False)
    with open("commands.txt", "a") as f:
        f.write("\n\nList Offers:\n\t")
        f.write(curlify2.Curlify(response.request).to_curl())
    if response.ok:
        return response.json()
    else:
        return []


def main():
    credSchemas = schemas()
    credType = list(credSchemas["credential_configurations_supported"])[0]
    offer = issue(credType, credTopic, vc_payload)
    print(offer)
    ok = createOffer(offer.get("offer"))
    if ok:
        last_offer = sorted(getOffers(), key=lambda x: x.get("timestamp"), reverse=True)[0]
        requestId = last_offer.get("requestId")
        result = acceptOffer(requestId, True)
        print(result)


if __name__ == "__main__":
    main()
