# OCM W-Stack Exercise

## TSA DIDS/Signing Hands On
### Bootstrap Docker Compose for Statuslist, Tsa Signer Service, Nats and Vault
- clone the repo `git clone -b workshop7 git@gitlab.eclipse.org:eclipse/xfsc/tsa/signer.git && cd signer`
- run docker-compse by `docker-compose -f ./deployment/docker/docker-compose.yml up`
### Checking keys in Vault
- Open `localhost:8200` in the browser
- Enter `test` in the Token field    
### DID document
See the did document
```
curl --location 'http://localhost:8080/v1/did/list' --header 'x-namespace: transit'
```
### Credential Create with Status List Entry (LDP_VC)
- Make credential with a status list
```
curl --header "x-origin: http://localhost:8081/v1/tenants/transit" 'http://localhost:8080/v1/credential' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
  "context": [
    "https://w3id.org/security/suites/jws-2020/v1",
    "https://schema.org"
  ],
  "credentialSubject": {
    "hello": "world2"
  },
  "format": "ldp_vc",
  "group": "",
  "key": "edkey",
  "namespace": "transit",
  "signatureType": "ed25519signature2020",
  "status": true
}'
```
Note: You can as well generate a credential without the status list by using `"status": false`
```
(if you change format from "ldp_vc" "to vc+sd-jwt", you will be able to manipulate with creds in vc+sd-jwt format)

- Then get the status list by following the url in "statusListCredential" object
- Then try to revoke credential by 
```
curl --request POST \
  --url http://localhost:8081/v1/tenants/transit/status/1/revoke/<statusListIndex>
```

## Offering and credentials issuing
### Credential offering
Prepare credential for the user
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "last_name": "Doe"}' \
  "https://cloud-wallet.xfsc.dev/issuing-demo/issue"

Then make your offering:
curl -X PUT  -H "Accept-Encoding: gzip, deflate" -H "Accept: */*" -H "Connection: keep-alive" -d '{"credential_offer": "<credential offer you have got from the previous request>"}' https://cloud-wallet.xfsc.dev/api/offering/retrieve/95cf3e8f-5f57-4ee0-a895-fa4c4f9f078c


### Issuance the credential for the user
To issue the credential we need to accept the offering. To find the offering, we need to get it's   requestId to accept it. For that, please make this request

curl -X GET -H "User-Agent: python-requests/2.32.3" -H "Accept-Encoding: gzip, deflate" -H "Accept: */*" -H "Connection: keep-alive" -d 'None' https://cloud-wallet.xfsc.dev/api/offering/list/95cf3e8f-5f57-4ee0-a895-fa4c4f9f078c

and try to find the offering (for example the last one) and accept it with the following command. Before executing it, please put your offering id into the curl request

curl -X DELETE -H "Accept-Encoding: gzip, deflate" -H "Accept: */*" -H "Connection: keep-alive" -d '{"accept": true, "holderKey": "e32f4b78-3bc1-44e4-bb61-a64545597e7e", "holderNamespace": "accountSpace", "holderGroup": "95cf3e8f-5f57-4ee0-a895-fa4c4f9f078c"}' https://cloud-wallet.xfsc.dev/api/offering/clear/95cf3e8f-5f57-4ee0-a895-fa4c4f9f078c/<put your offering request id>

In the response you will find the credential. 