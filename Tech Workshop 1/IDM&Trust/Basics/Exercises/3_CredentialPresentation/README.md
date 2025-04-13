# Overview

The presentation of credentials can happen in hyperledger aries in multiple ways. Restricted by schema, by fieldnames, by queries or by credential definitions. Doesnt matter which way is chosen, the user has always the feasbility to allow or deny it. More detailed information in [Aries RFC 0037](https://github.com/hyperledger/aries-rfcs/tree/main/features/0037-present-proof)

# Exercise Goal

In this exercise, the credential presentation by schema and credential definition is used to request data from the users pcm. It will be trained how to send a request, how to do selective disclosure and how to pickup/process the results.

# Exercise

Start an presentation request by using 3.1 from the postman collection with the following body:

```
{
   "comment":"Any issuer.",
   "connectionId":"{connectionId}",
   "attributes":[
       {
           "attributeName":"userName",
           "schemaId":"8y8oycXjnQCRT2t3mRuzbP:2:GXFS-Workshop-Credential:1.0.0"
       }
   ]
}


```

Now you should see a presentation request in the PCM. Confirm this request. 

[![](media/poster.png)](media/PresentationRequest.mp4 "Presentation Request")



After confirmation you can pickup the results by the call 3 of the postman collection.

```
{{proofManager}}/v1/find-by-presentation-id?presentationId=719751fe-a28e-4db4-a49f-f4e5e1eca8c1

```
You can pick up then the fields in the response body.

[![](media/poster3.png)](media/GetPresentationResult.mp4 "Get Presentation Result")




