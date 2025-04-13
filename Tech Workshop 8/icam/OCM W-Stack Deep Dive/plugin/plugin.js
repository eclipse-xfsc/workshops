require('dotenv').config();
const express = require('express');
const { connect, StringCodec } = require('nats');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json());

// Lade Konfigurationen aus .env
const PORT = process.argv[3] || process.env.PORT || 5000;
const NATS_URL = process.env.NATS_URL || "nats://localhost:4222";
const NATS_SUBJECT = process.env.NATS_SUBJECT || "default_subject";
const WELLKNOWN_NATS_SUBJECT = "wellknown.issuer.registration"
let metadata = {}
let credentialDefinition={}
// Verbindung zu NATS herstellen
let natsConnection;
const stringCodec = StringCodec();

// A map to store messages by UUID
const messageMap = new Map();

// Establish a connection to NATS
async function connectToNats() {
    try {
        natsConnection = await connect({ servers: NATS_URL });
        console.log(`Connected to NATS at ${NATS_URL}`);
    } catch (error) {
        console.error("Failed to connect to NATS:", error);
        process.exit(1);
    }
}

// Create a CloudEvents message
function createCloudEvent(type, source, data) {
    return {
        specversion: "1.0",
        id: uuidv4(),
        type,
        source,
        time: new Date().toISOString(),
        data
    };
}

// Periodically publish a CloudEvents message to NATS
function startPeriodicPublishing() {
    setInterval(() => {
        // Update requestId with a new UUID for every message
        metadata.requestId = uuidv4();
        const cloudEvent = createCloudEvent(
            "wellknown.issuer.registration",  // Event type
            "nodeplugin",          // Source
            metadata                    // JSON data as event payload
        );

        const encodedEvent = stringCodec.encode(JSON.stringify(cloudEvent));

        try {
            natsConnection.publish(WELLKNOWN_NATS_SUBJECT, encodedEvent);
            console.log(`Published message`);
        } catch (error) {
            console.error("Error while publishing message:", error);
        }
    }, 20000); // Every 20 seconds
}

app.get('/offerlink/:id', async (req, res) => {
    const identifier = req.params['id']
    const {data,disclosureFrame} = req.body
    const tenantId="tenant_space"
    const requestId = uuidv4()

    // Validate required fields
    if (!tenantId || !requestId) {
        return res.status(400).json({ error: 'tenantId and requestId are required.' });
    }

    // Generate a UUID for the message and a nonce
    const messageId = uuidv4();
    const nonce = uuidv4();
    //Loop for schema values
    const keys2 = Object.keys(credentialDefinition.credentialDefinition.credentialSubject);

    if (keys2.every(key => key in data)) {   
        messageMap[nonce] = req.body
    } else {
        res.status(400).json({ error: "given body matches not to credential definition",definition:  credentialDefinition.credentialDefinition.credentialSubject   });
        return 
    }

    // Construct the OfferingURLReq structure
    const offerReq = {
        tenant_id: tenantId,
        request_id: requestId,
        params: {
            credentialType: identifier,
            credentialIdentifier: [identifier],
            grantType: "urn:ietf:params:oauth:grant-type:pre-authorized_code",
            twoFactor: {
                enabled: false,
            },
            nonce,
        },
    };

    // Create a CloudEvent message
    const cloudEvent = {
        specversion: "1.0",
        id: messageId,
        type: "test.issuer", // Updated type
        source: "credential.offer.url.v1", // Updated source
        time: new Date().toISOString(),
        data: offerReq,
    };

    try {
        // Encode and send the CloudEvent as a request
        const encodedEvent = stringCodec.encode(JSON.stringify(cloudEvent));
        const response = await natsConnection.request(NATS_SUBJECT, encodedEvent, { timeout: 5000 });

        // Decode the reply message
        const replyMessage = stringCodec.decode(response.data);

        console.log(`CloudEvent sent with ID: ${messageId}`);
        console.log(`Reply received: ${replyMessage}`);

        // Respond to the HTTP request with the reply
        res.status(200).json({ id: messageId, reply: JSON.parse(replyMessage) });
    } catch (error) {
        console.error("Error during NATS request-reply:", error);
        res.status(500).json({ error: 'Failed to process the message or receive a reply.' });
    }
});


// Listen for events on a specific subject and send replies
async function setupIssueListener() {
    const subscription = natsConnection.subscribe(credentialDefinition.topic+".issue");
    console.log(`Listening for events on NATS subject: ${credentialDefinition.topic+".issue"}`);

    for await (const message of subscription) {
        try {

      
        const incomingMessage = JSON.parse(stringCodec.decode(message.data));
        console.log(`Received event on ${credentialDefinition.topic+".issue"}: ${incomingMessage}`);

        sdjwtPayload={holder:{cnf:{}},
                      disclosureFrame:{},
                      subject:{claims:{},iss:"test",iat:"0",exp:"999999999999999999"},
                      issuer:{signer:{alg:"ES256",namespace:"tenant_space",key: "eckey",group:"",}}}

        sdjwtPayload.vct = Object.keys(metadata.issuer.credential_configurations_supported)[0]
        credential = messageMap[incomingMessage.data.Code]

        sdjwtPayload.disclosureFrame._sd = credential.disclosureFrame
        sdjwtPayload.subject.claims = credential.data

        await axios.get('http://localhost:8080/v1/jwk/tenant_space/eckey', { data: { engine:'transit',group:'' } })
            .then(response => {
                const buffer = Buffer.from(JSON.stringify(response.data), 'utf-8');

                let base64 = buffer.toString('base64');

                let base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                sdjwtPayload.issuer.signer.kid = "did:jwk:"+base64url+"#0"
               }
            )
            .catch(error => console.error(error));

                // Decode the complete token (header, payload, and signature)
        const decodedToken = jwt.decode(incomingMessage.data.Holder, { complete: true });

        // Extract the `jwk` field from the header
        if (decodedToken && decodedToken.header && decodedToken.header.jwk) {
          sdjwtPayload.holder.cnf.jwk = decodedToken.header.jwk
        } else {
            console.error('The JWK field was not found in the token header.');
            return
        }

        // Extract the `nonce` field from the payload
        if (decodedToken && decodedToken.payload && decodedToken.payload.nonce) {
            console.log('Nonce:', decodedToken.payload.nonce);
        } else {
            console.error('The nonce field was not found in the token payload.');
        }

     
        const responseMessage = {
            specversion: "1.0",
            id: uuidv4(),
            type: "test.issuer", // Updated type
            source: "workhsopplugin", // Updated source
            time: new Date().toISOString(),
            data: {
                tenant_id : incomingMessage.data.tenant_id,
                request_id: incomingMessage.data.request_id,
                Format: "vc+sd-jwt",
            }
        };
        console.log(sdjwtPayload)
        await axios.post('http://localhost:8087/issue', JSON.stringify(sdjwtPayload), {  
        headers: {
            'Content-Type': 'application/json'
        } })
        .then(response => {
            responseMessage.data.Credential = response.data.sdjwt
           }
        )
        .catch(error => console.error(error));


        message.respond(stringCodec.encode(JSON.stringify(responseMessage)));
        console.log(`Replied with: ${JSON.stringify(responseMessage, null, 2)}`);
    } catch(e) {
        console.error(e)
    }
    }
}

// Start the server and initialize NATS connections
app.listen(PORT, async () => {

    const args = process.argv.slice(2); // Slice to skip "node" and script name
    const filepath = args[0]; // First parameter passed

    if(filepath == undefined) {
        console.error(`Error: Filepath not given.`);
        process.exit(1)
    }


    console.log(`Server running at http://localhost:${PORT}`);
    await connectToNats();

    // Ensure the file exists
    if (!fs.existsSync(filepath)) {
        console.error(`Error: File ${filepath} not found.`);
        process.exit(1);
    }

    // Load JSON data from the file
    metadata = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    credentialDefinition =metadata.issuer.credential_configurations_supported[Object.keys(metadata.issuer.credential_configurations_supported)[0]]
    console.log(credentialDefinition)
    startPeriodicPublishing();
    setupIssueListener();
});