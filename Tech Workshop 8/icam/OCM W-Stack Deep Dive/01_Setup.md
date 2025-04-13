# Tools

1. Installed Docker or Docker Desktop
2. Postman or Insomnia 
3. Installed docker compose

# Technical Overview

See [Architecture Documentation](https://gitlab.eclipse.org/eclipse/xfsc/organisational-credential-manager-w-stack/architecture-documentation/-/blob/main/README.md)

Basis for the flows is the [oid4vp library](https://gitlab.eclipse.org/eclipse/xfsc/libraries/ssi/oid4vip) (golang)

# Exercise Plan

We will have a look together so some core functions of OCM W-Stack to understand better the flows which we seen before in detail. This consists of: 

1. New TSA Functions (Vault, Did Management, Signings, Keys etc.)
2. Sd-Jwt Service
3. Issuing Frame/Plugins 

So let's start the first docker compose for tsa:) 