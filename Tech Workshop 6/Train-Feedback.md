# Scenario Takeaways:

Terms of Use is not in old credentials. -> Put terms of use in did document of issuer did.
This can be changed on demand. TTV must then just resolve didissuer document and extract termsofUse fro this.


Time based aspect of TRAIN, where you want to have pointers only for a specific time. Could be done via more info in the DNS System, or in the did document. 

Basically I want to know if the pointer is valid since WHEN, and if there were timeframes where it was NOT valid.

Indivdual patient/client trust might not be the best use case, TRAIN is more focused on B2B trust exchange.

Be explicit in the spec, that a web did MUST be a well known web did.

Better distinguish TRAIN and TSA
