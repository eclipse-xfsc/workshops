# Overview

The TSA policy engine has an database in the background for syncing the polices, which are synced over an git repo. For this exercise the policy database is unlocked by an API which allows it to create policies.


# Exercise Goal

The goal of this exercise is, to create some new policies.

# Exercise

Just use the open policy agent [playground](https://play.openpolicyagent.org) to create a policy and upload it to the service. When uploaded, just execute exercise 4 again for executing it:) 

For creating a policy use the request body: 

```
{
  "group": "policies",
  "name": "test123",
  "version": "1.0",
  "data": "{\"test\":\"hello\"}",
  "dataConfig": "",
  "rego": "package policies.test123\n default allow = false\nallow\n{\ndata.test == input.message\n}"
}
```

for deleting it, use the responed id for deletion in {id} of the delete call. 