# Overview

TSA provides arround the policy execution a lot of other features, like caching, tasking and other things. In this exercise the policy execution will be tried out acording to the [open policy agent engine](https://www.openpolicyagent.org/docs/latest/policy-reference/).


# Exercise Goal

The goal of this exercise is to understand the behavior of the policies and the usage of tsa policies.

# Exercise


## Simple Policy Execution
At first the policy execution is simply used by the following [format](https://gitlab.com/gaia-x/data-infrastructure-federation-services/tsa/policy#policy-evaluation)

```
# URL with example policy group, name and version
http://localhost:8081/policy/gaiax/didresolve/1.0/evaluation

# URL with parameter placeholders
http://localhost:8081/policy/{group}/{policy}/{version}/evaluation

```

The parmeters are used now to the execute the first policy:

```
{group} = policies
{policy }=examplePolicy
{version}= 1.0 

```

You should see an default result of the policy. To return a successfull response, set the message to "example" as required by the [policy](https://gitlab.com/gaia-x/data-infrastructure-federation-services/gxfs-integration/-/blob/main/data/tsa/policies/examplePolicy/1.0/policy.rego)

```
package policies.examplePolicy

default allow = false

allow{
    input.message == "example"
}

```

![](media/PolicyExecution.mp4 "Policy Execution")

## Advanced Policy Execution

After this simple policy execution, let's use a more complicated [](https://gitlab.com/gaia-x/data-infrastructure-federation-services/gxfs-integration/-/blob/main/data/tsa/policies/examplePolicy/1.2/policy.rego) which is based on a internal data set:

```
{
  "trustlist": [
    "did:web:123",
    "did:web:abc"
  ]
}
```

The [dataset](https://gitlab.com/gaia-x/data-infrastructure-federation-services/gxfs-integration/-/blob/main/data/tsa/policies/examplePolicy/1.2/data.json) is used in the policy to check incoming input against static content. 

```
package policies.examplePolicy

import future.keywords.in

default trusted = false

trusted{
    issuer := input.issuer
    issuer in data.trustlist
}
```

![](media/PolicyExecutionWithData.mp4 "Policy Execution with Data")

## Dynamic Policy Execution

In the first two examples, the policy execution was based on static data and input data, which is the default for open policy agent. For some scenarios, it's a bit tricky to modify the policy execution without modifing the data content or the input content. To control this execution more easier, the TSA gots an enhancement by using the HTTP header. This can be use for example to inject settings for creating DID documents by [policy](https://gitlab.com/gaia-x/data-infrastructure-federation-services/gxfs-integration/-/blob/main/data/tsa/policies/returnDID/1.0/policy.rego):


```
package policies.returnDID

concat_f(s,s2) = concat("", [s, s2])

_ = {
     "@context" : ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
     "id" :  external.http.header("X-Did-Location"),
     "verificationMethod" : verification_methods(external.http.header("X-Did-Location"), external.http.header("X-Did-Transit-Engine")),
     "service":[{
          "id": concat_f(external.http.header("X-Did-Location"),"#catalog-desc"),
          "type": "gx-catalog-description", 
          "serviceEndpoint":concat_f("https://integration.gxfs.dev/api/self-descriptions/description?did=",urlquery.encode(external.http.header("X-Did-Location")))
     },{
           "id": concat_f(external.http.header("X-Did-Location"),"#trusted-connection"),
           "type": "gx-trusted-connection", 
           "serviceEndpoint": "https://integration.gxfs.dev/ocm-provider-connection/v1/invitation-url?alias=trust"
     }]
}
```

The headers control in this example, which secret engine is used and which domain location the DID has. By rotating the keys in the secret engine, did document is updated immediatly. 

![](media/PolicyExecutionWithHeaders.mp4 "Policy Execution with Headers")

