# Overview

The TSA component provides a signing and verification service which is able to create an verify JSON LD Proofs. In this exercise, the service will be used to create simple json ld proofs and verify them against a created ECDSA key pair. 

# Exercise Goal

The goal of this exercise is to learn how to use an hashicorp vault in combination with the TSA Signer Service to sign credentials and verify them. 

# Exercise

## Signing

For testing the Signer Service a simple VC is used: 

```

{
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/jws-2020/v1",
      "https://schema.org"
    ],
    "type": "VerifiableCredential",
    "issuer": "did:web:integration.gxfs.dev:api:dynamic:did:workshop",
    "issuanceDate": "2010-01-01T19:23:24.651387237Z",
    "credentialSubject": {
      "name": "Alice",
      "allow": true
    }
  },
  "key": "key-1",
  "namespace": "did-management.did-web-integration.gxfs.dev-api-dynamic-did-workshop"
}

```
<b>Note</b>: Please be aware to use the namespace did-management.did-web-integration.gxfs.dev-api-dynamic-did-workshop and the did did:web:integration.gxfs.dev:api:dynamic:did:workshop, because they are already prepared and publicly hosted.

The VC is copied as payload in the call for signing (/credential/proof). The response is a signed VC. 

![](media/Signing.mp4 "Signing with TSA Signing Service")

## Verification

The result of the signing response can be copied directly into the verification request body to verify it. If you modify the data, the response is an verification error. So long as the key is not rotated, the VC is valid:) 


![](media/Verify.mp4 "Verification with TSA Signing Service")