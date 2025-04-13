
# SD-JWT Service

The sd-jwt service implements the [SD-jWT Draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/)
Basis for this is the [SD JWT Core](https://github.com/openwallet-foundation/sd-jwt-js) from open wallet foundation.

## Basic

Service contains 3 routes: 

- issue
- verify
- present

The [insomia collection](https://gitlab.eclipse.org/eclipse/xfsc/common-services/sd-jwt-service/-/raw/main/docs/Api/Insomnia_2024-09-11.json?ref_type=heads) contains all three calls. 


Example Issuing: 

```
{
	"vct":"123",
	"issuer": {
		"signer": {
				"alg": "ES256",
				"namespace":"transit",
				"key":"eckey",
				"group":"",
					"kid":"did:jwk:eyJjcnYiOiJQLTI1NiIsImtpZCI6ImVja2V5Iiwia3R5IjoiRUMiLCJ4IjoiUUFocU43QTNUdjRRYU5HWGpDWFlIVnRNenJrVUZOQlRjMGpTeGM0aHpmTSIsInkiOiJBbnZmQ1J2RzdtSWJ5YThXWFh3bFVGa0NZZEpoMzExY3J1c1c2M0ZtWFNzIn0#0"
		}
	},
	"subject": {
			"claims":{
					"email":"test",
					"givenName":"jack"
					},
			"iss":"test",
		  "iat":"12333333",
			"exp":"23232323235555"
	},
	"holder": {
			"cnf":{
				"jwk":{
					"kty": "EC"
				}
		}
	},
	"disclosureFrame":{
		 "_sd": ["email","givenName"]
	}
}
```

Example Verification: 

```
{
	"sdjwt": "eyJ0eXAiOiJzZC1qd3QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpqd2s6ZXlKamNuWWlPaUpGWkRJMU5URTVJaXdpYTJsa0lqb2laV1JyWlhraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVZDMWljRkZTYkdkb04wdHpla3hLYlhGS1VtbDNkek5KUXpaa01GcFZhVFJ3V0docWRYVjVhakl3ZHlKOSMwIn0.eyJnaXZlbk5hbWUiOiJqYWNrIiwidmN0IjoiMTIzIiwiY25mIjp7Imp3ayI6eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJraWQiOiJlY2tleSIsImt0eSI6IkVDIiwieCI6IlhNREVfdDlFaFI5dUtXU0Rab25CUWFIbkZOS1NFeXV6RkJ6QUdtNEY0ckUiLCJ5IjoicWFndWVRMDVVZk1QWU5VWVkwN0xNcmpYdXczZDJNcjNabHZLUUo0NmlUNCJ9fX0sImlzcyI6ImRpZDpqd2s6ZXlKamNuWWlPaUpGWkRJMU5URTVJaXdpYTJsa0lqb2laV1JyWlhraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVZDMWljRkZTYkdkb04wdHpla3hLYlhGS1VtbDNkek5KUXpaa01GcFZhVFJ3V0docWRYVjVhakl3ZHlKOSIsImlhdCI6MTczMjY0MDYzNSwiX3NkIjpbInVrdW9kNVVfcTNvWUU5MmpYNW1nYXRIT3lRbkNNeGlHTWh4Zi1Xb3ctcG8iXSwiX3NkX2FsZyI6IlNIQS0yNTYifQ.FjRrYpNNqKZAUIIzf49nZdm5cEpRcnatwAmF1OcdGIRKiHY9CWamGF7KRPScJtN-YMKNpkwvljkOrhY1EkaZAA~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE3MzI2NDA3MjYsInNkX2hhc2giOiJLVjZub2g2QUtsTko5dzFJZ09GdHNPUmE5Nk5xcWJ3dnNsYm5wd1ZzZ1hFIn0.O23c8kRSy8JgdLbUar0EXaZKFjTYvOzRcuB1OXonOlUCrEapD-2jIs7qch7DYpKF4r2KqXdIHjD_ZXgIaF2KrQ"
}
```

## Selective Disclosure

To use selective disclosure credentials the credential must be packed in a sd-jwt presentation by using the sd-jwt service.TSA Service/OCM-Service has currently no exchange way of creating sd-jwt presentations, because ocm w-stack supports not yet the selection of disclosures. But it can be created by using the the /present route.

Note: Replace the sdjwt field by the credential which you get from the signer service credential route. Replace the kid by a kid of the vault keys which you have created. 

Route: localhost:8082/present
Payload: 
```
{
	"sdjwt":"eyJ0eXAiOiJzZC1qd3QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpqd2s6ZXlKamNuWWlPaUpGWkRJMU5URTVJaXdpYTJsa0lqb2laV1JyWlhraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVZDMWljRkZTYkdkb04wdHpla3hLYlhGS1VtbDNkek5KUXpaa01GcFZhVFJ3V0docWRYVjVhakl3ZHlKOSMwIn0.eyJnaXZlbk5hbWUiOiJqYWNrIiwidmN0IjoiMTIzIiwiY25mIjp7Imp3ayI6eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJraWQiOiJlY2tleSIsImt0eSI6IkVDIiwieCI6IlhNREVfdDlFaFI5dUtXU0Rab25CUWFIbkZOS1NFeXV6RkJ6QUdtNEY0ckUiLCJ5IjoicWFndWVRMDVVZk1QWU5VWVkwN0xNcmpYdXczZDJNcjNabHZLUUo0NmlUNCJ9fX0sImlzcyI6ImRpZDpqd2s6ZXlKamNuWWlPaUpGWkRJMU5URTVJaXdpYTJsa0lqb2laV1JyWlhraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVZDMWljRkZTYkdkb04wdHpla3hLYlhGS1VtbDNkek5KUXpaa01GcFZhVFJ3V0docWRYVjVhakl3ZHlKOSIsImlhdCI6MTczMjY0MDYzNSwiX3NkIjpbInVrdW9kNVVfcTNvWUU5MmpYNW1nYXRIT3lRbkNNeGlHTWh4Zi1Xb3ctcG8iXSwiX3NkX2FsZyI6IlNIQS0yNTYifQ.FjRrYpNNqKZAUIIzf49nZdm5cEpRcnatwAmF1OcdGIRKiHY9CWamGF7KRPScJtN-YMKNpkwvljkOrhY1EkaZAA~WyI2YzEwZmJkOTkwMzk2MzU5IiwiZW1haWwiLCJ3b3JsZCJd~",
	"disclosureFrame":{
		"email":false
	},
	"holder": {
		"signer": {
				"alg": "ES256",
				"namespace":"transit",
				"key":"eckey",
				"group":"",
	"kid":"did:jwk:eyJjcnYiOiJQLTI1NiIsImtpZCI6ImVja2V5Iiwia3R5IjoiRUMiLCJ4IjoiWE9ka2lyYmRSSEZsNHVlN1lJb0YtZDFJM2lIV1c0Uk1IaWxQYy1DMUx4MCIsInkiOiJESldtSl95V1hGRkdEckRNZmRZS2hnelVmVXVYMWhmN0prbWpvN0wtTGE4In0#0"
		}
	}
}

```

The sd-jwt presentation can then be used again in verify route:)