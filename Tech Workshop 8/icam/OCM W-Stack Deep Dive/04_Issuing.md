# Setup

Install the [docker compose](./docker/) for the environment with docker compose up. After that start the second docker compose for the pre auth bridge (ensure to remove the tsa docker compose before)

Install nodejs, or golang or any other language which supports nats.

Open the issuing [docu](https://gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/credential-issuance/issuance-service) for a better understanding.

# Creating a Issuing plugin

## Credential Request Endpoint

The credential request endpoint stores credential data inside the issuing plugin for a later pick up. E.g. some user relevant data. The answer to this call is a OID4VC offering link. 

Check first http://localhost:8084/v1/tenants/tenant_space/.well-known/openid-credential-issuer there should be null. If you enable the plugin there should be the metadata.

## Start Issuing

Call the GET url localhost:5000/offerlink/WorkshopCredential, you should get back the link:

![Offer Link Result](./images/offerlinkresult.png)

Feel free to open a second console and start the plugin with another metadata file:)

# Retrieval of Credential

For retrieve a credential you need to copy and paste the credential_offer link. e.g.: 

![Offering Link](./images/offeringlink.png)

Put then the link in the following PUT call: 

```
 localhost:8000/v1/tenants/tenant_space/offering/retrieve/default 
```

Payload(replace your link): 

```
{
	"credential_offer":"openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22http%3A%2F%2Fhost.docker.internal%3A8084%2Fv1%2Ftenants%2Ftenant_space%22%2C%22credential_configuration_ids%22%3A%5B%22WorkshopCredential%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22it4fbhTmR2UQadBln0fd%22%2C%22interval%22%3A5%7D%7D%7D"
}
```
You get back an guid which must be used for the offering clearing DELETE call (acceptance):

```
localhost:8000/v1/tenants/tenant_space/offering/clear/default/{guid}
```

As payload there must be an definition who is the holder of the credential and if the credential is excepted.

```
{
  "accept": true,
  "holderGroup": "",
  "holderKey": "eckey",
  "holderNamespace": "tenant_space"
}
```

# Pick it from the storage

The storage provides some [calls](https://gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/storage-service/-/blob/main/docs/swagger.json?ref_type=heads) to send an presentation definition for query the credentials. 

If you have cqlsh installed, just open a shell by using: 

```
cqlsh -u cassandra -p cassandra
```

and then query the storage content: 

```
select* from tenant_space.credentials;
```

Over the api please us the 'pick credential call from the collection. You should see the credentials.

Let's filter for John Doe! Paste this one in the Body

```
{
	  "id": "32f54163-7166-48f1-93d8-ff217bdb0653",
	  "input_descriptors": [
		{
		  "id": "namePresentation",
		  "name": "namePres",
		  "purpose": "Show me your Name!",
		  "constraints": {
			"fields": [
			  {
				"path": [
				  "$.family_name"
				],
				"filter": {
                "type": "string",
                "pattern": "^doe"
              }
					}
				]
		  }
		}
	  ]
  }

```

