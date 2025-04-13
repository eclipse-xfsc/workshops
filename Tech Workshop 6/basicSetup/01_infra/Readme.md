# Starting basic TRAIN supporting infrastructure:
There are a few components we need to run to enable TRAIN as a whole. 

These include: a DNS server to have two local but distinct zones, an 
IPFS instance and a keycloak instance for user authentication.

## To run

open a terminal in the 01_infra folder then run: `docker compose up -d` 