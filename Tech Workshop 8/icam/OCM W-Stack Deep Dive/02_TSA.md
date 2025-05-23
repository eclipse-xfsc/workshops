# Setup

Install with docker compose up the [compose file](./docker/tsa-compose.yml) and open the [TSA API Swagger](https://gitlab.eclipse.org/eclipse/xfsc/tsa/signer/-/blob/main/gen/http/openapi3.json)

# Key Management

## Engines and Keys

If the key management is based on vault (standard), we can use the vault to manually add keys: 

1. Open the browser and open http://localhost:8200/
2. Enter token "test"
3. Create a transit engine with a key

In TSA the transit engines appear then by calling http://localhost:8080/v1/namespaces

If you create "transit2" you should see the following: 

![Vault](./images/vault.png)
![API](./images/namespaceResult.png)

If you see this, you can query the new keys as well by using http://localhost:8080/v1/namespaces/{name}/keys you should see then the keys from the engine: 

![namespaceKeysResult.png](./images/namespaceKeysResult.png)

You can use this information for signing, by using the /v1/sign : 

![Sign Endpoint](./images/signResult.png)

Alternativly you can integrate in go code the signer plugin directly:) 

## Key Usage

The TSA supports some ways to provide keys to a consumer. This could be a did document, a jwks and did lists. In addition, this function support multiple key engines. In the case of vault key value engine and transit. For trying this out just add a new engine or use the standard one (secret) and add a k/v with a PEM string in it. Standard is trustanchor.

### Did Document

A did document can be generated by calling /v1/did/document with the correct headers: 

x-engine: transit;kv
x-namespace: transit;secret

This looks like the following picture: 

![Did Doc Result](./images/diddocresult.png)

Play arround! You can exclude engines, create new one or rotate the namespaces.

### JWKS

Same works with JWKS by using /v1/jwks: 

![Jwks](./images/jwksResult.png)

### Did List

Same works with DID by using /v1/did/list: 

![Did List](./images/didlistResult.png)

## Constructing Well Knowns

For using the routes in the [Did Resolver](https://gitlab.eclipse.org/eclipse/xfsc/dev-ops/helm-charts/-/tree/main/universalresolver/deployment/helm) or during token verification the urls must be encapsulated by [ingress rules](https://gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/deployment/-/blob/main/Well%20Known%20Ingress%20Rules/templates/ingress.yaml?ref_type=heads#L75) or any proxy to use it like in this example[go example](https://github.com/lestrrat-go/jwx/blob/develop/v3/examples/jwk_fetch_example_test.go) or in this [nodejs](https://dev.to/mojoauth/jwt-validation-with-jwks-in-nodejs-3nj4) example.

Example Procedure: 

Pull nginx docker: 

```
    docker pull nginx
```

Create config file ("nginx.conf") with the routes: 
```
events { }
http {
    server {
        listen 80;
        server_name localhost;

        location /.well-known/jwks.json {
            proxy_pass http://signer-service:8080/v1/jwks;
            proxy_set_header x-engine "transit";
            proxy_set_header x-namespace "transit";
        }

        location /.well-known/did.json {
            proxy_pass http://signer-service:8080/v1/did/document;
            proxy_set_header x-engine "transit";
            proxy_set_header x-namespace "transit";
        }
    }
}
```

Insert into docker compose file: 

```
nginx:
    image: nginx:latest
    networks:
      - internal
    container_name: nginx_container
    ports:
      - "8085:80"
    environment:
      - SERVER_NAME=my-nginx.local
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.template.conf:ro
    command: /bin/sh -c "envsubst < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
```

After that the routes http://localhost:8085/.well-known/did.json and /jwks.json should be available. Note: if you do that under a public domain, the did:web is then resolvable via https://dev.uniresolver.io/

# Credential Signing

For sign a credential in various formats the call for: /v1/credential can be used 

Credential Signing LDP VC Format:

```
{
    "namespace" :"transit",
    "signatureType":"ed25519signature2020",
    "group" : "",
    "key":"edkey",
    "status":false,
    "credentialSubject": {
        "hello":"world", "testXY":"1234"
    },
    "issuanceDate": "2022-06-02T17:24:05.032533+03:00",
    "type": ["VerifiableCredential"]
}

```

Credential Signing SD-JWT Format (dont forget to replace the issuer by the right key from did list): 
```
{
    "namespace" :"transit",
    "group" : "",
    "key":"edkey",
    "status":false,
    "issuer":"did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia2lkIjoiZWRrZXkiLCJrdHkiOiJPS1AiLCJ4IjoiVC1icFFSbGdoN0tzekxKbXFKUml3dzNJQzZkMFpVaTRwWGhqdXV5ajIwdyJ9",
    "format":"vc+sd-jwt",
    "credentialSubject": {
        "vct":"test",
        "cnf":{
            "jwk":{
                    "crv": "P-256",
                    "kid": "eckey",
                    "kty": "EC",
                    "x": "XMDE_t9EhR9uKWSDZonBQaHnFNKSEyuzFBzAGm4F4rE",
                    "y": "qagueQ05UfMPYNUYY07LMrjXuw3d2Mr3ZlvKQJ46iT4"
                }
        }, 
            "email":"world", 
            "givenName":"jack"
    },
    "issuanceDate": "2022-06-02T17:24:05.032533+03:00",
    "type": ["123"],
    "disclosureFrame":["email"]
}
```

You can cross check the content via https://www.sdjwt.co/decode

## Verification

The verification works over /credential/verify (for both types in base64 encoding): 

```
{
    "credential":"ZXlKMGVYQWlPaUp6WkMxcWQzUWlMQ0poYkdjaU9pSkZaRVJUUVNJc0ltdHBaQ0k2SW1ScFpEcHFkMnM2WlhsS2FtTnVXV2xQYVVwR1drUkpNVTVVUlRWSmFYZHBZVEpzYTBscWIybGFWMUp5V2xocmFVeERTbkprU0d0cFQybEtVRk14UVdsTVEwbzBTV3B2YVZaRE1XbGpSa1pUWWtka2IwNHdkSHBsYTNoTFlsaEdTMVZ0YkROa2VrNUtVWHBhYTAxR2NGWmhWRkozVjBkb2NXUllWalZoYWtsM1pIbEtPU013SW4wLmV5SjBaWE4wV0ZraU9pSXhNak0wSWl3aWRtTjBJam9pTVRJeklpd2lZMjVtSWpwN0ltcDNheUk2ZXlKcWQyc2lPbnNpWTNKMklqb2lVQzB5TlRZaUxDSnJhV1FpT2lKbFkydGxlU0lzSW10MGVTSTZJa1ZESWl3aWVDSTZJbGhOUkVWZmREbEZhRkk1ZFV0WFUwUmFiMjVDVVdGSWJrWk9TMU5GZVhWNlJrSjZRVWR0TkVZMGNrVWlMQ0o1SWpvaWNXRm5kV1ZSTURWVlprMVFXVTVWV1Zrd04weE5jbXBZZFhjelpESk5jak5hYkhaTFVVbzBObWxVTkNKOWZYMHNJbWx6Y3lJNkltUnBaRHBxZDJzNlpYbEthbU51V1dsUGFVcEdXa1JKTVU1VVJUVkphWGRwWVRKc2EwbHFiMmxhVjFKeVdsaHJhVXhEU25Ka1NHdHBUMmxLVUZNeFFXbE1RMG8wU1dwdmFWWkRNV2xqUmtaVFlrZGtiMDR3ZEhwbGEzaExZbGhHUzFWdGJETmtlazVLVVhwYWEwMUdjRlpoVkZKM1YwZG9jV1JZVmpWaGFrbDNaSGxLT1NJc0ltbGhkQ0k2TVRjek1qWXpPVEV6TlN3aVgzTmtJanBiSWxkaE5HNWZjREZCVkZVMlFuTllPVFZDZGpSV2QyaEtha2RoUlVaZlRVNUVTRWM0TFdzM1dVSmZSa0VpWFN3aVgzTmtYMkZzWnlJNklsTklRUzB5TlRZaWZRLjhsaXZHZW1MVEd1bTA1OFFjY3FwSlg4akFHUm5CZjVYRzJiclVTUGdzbUk5cFdzanNqWktlTENremRkSjJ5bnNkSU1NZWVYSDY3dzRIdThDdG0zekNnfld5Sm1Oek16TldNeE0yVTFaRGxoT0RGbUlpd2lhR1ZzYkc4aUxDSjNiM0pzWkNKZH4=",
    "disclosureFrame":["email"]
}
```













