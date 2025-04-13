# Running the Train Trust Validator
** First: you must ensure that the `conf/ui.env` and `conf/zonemanager.conf` files have Linux style file endings! Change CRLF to LF in VScode for example.**


## Start Universal Resolver images

First, switch to the uni-resolver folder:

```sh
cd uni-resolver
```

If you want to run **all** univeral resolver images:

```sh
docker compose --env-file unires.env -f uni-resolver-all.yml up -d
```

If you only need the did web resolver:

```sh
docker compose --env-file unires.env -f uni-resolver-web.yml up -d
```

## Verify it works
To test did:web resolution you can try the following CURL commands:

``` sh
curl -X GET http://localhost:8080/1.0/identifiers/did:web:did.actor:alice
curl -X GET http://localhost:8080/1.0/identifiers/did:web:did.actor:bob
curl -X GET http://localhost:8080/1.0/identifiers/did:web:did.actor:mike
```

## Starting the Train Trust validator image

Go back into the base folder and run:

```sh
docker compose up -d
```
