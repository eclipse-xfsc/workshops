# TRAIN Workshop Exercises

## Agenda:
1st day: concept & details
        demonstration
        local setup
        show how to use components.


2nd day 9-13 : get your dids, create together with train a federation and work together. build up a local federation.

2nd day 13-end: detail use cases, remarks etc. discuss and develop scenarios from your environment. Present those scenarios.

## Prerequisites:
To properly take part in the workshop you **MUST** have the following installed and usable on your machine:
* Internet access 
* Docker Engine Installed including `docker compose` functionality
* Postman

## Importing Postman Collections & Environments
In the `Exercise 1/PostmanCollections` folder are a few collections you should import.
There are also two environments, one for each federation we will have locally. Import all of those files.

To change which federation you want to use, you must switch the environment to either `Federation 1` or `Federation 2`

## Basic TRAIN Setup
To setup the TRAIN infrastructure and all required components you need to follow each section documented in the `basicSetup` folder. 

We will setup two DNS zones, federation1.train and federation2.train. An additional "Glue" DNS server will resolve the NS Records for the zones.

Start with the 01_infra folder and follow the readme. Then go through the folders in the order indicated by the numbers, and follow each readme.

### **PORTS** available from outside docker:
- INFRA:
    - Keycloak: 8000
    - IPFS: 4001, 5001
- TDZM:
    - federation1: 16001, ui: 8081
    - federation2: 16002, ui: 8082
- TFM:
    - federation1: 16003
    - federation2: 16004
- TTV:
    - Uni Resolver: [8080:8147]
    - TTV Resolver: 8887