# Deploying OCM-Engine Stack to the Kubernetes Cluster

This README  provides comprehensive guidance for the deployment of the OCM Engine Stack. The deployment has been meticulously prepared by [SmartSense Consulting Solutions](https://www.smartsensesolutions.com/) in collaboration with [eco e.V](https://eco.de). for the [XFSC Community](https://projects.eclipse.org/projects/technology.xfsc/who).

## Prerequisites

Before deploying the OCM-Engine, make sure you have the following components and tools available in your environment:

-   Container Engine/Docker
-   Kubernetes Cluster & Kubectl Client
-   Helm ([Installation Guide](https://helm.sh/docs/intro/install/))
-   NGINX Ingress Controller ([Installation Guide](https://docs.nginx.com/nginx-ingress-controller/installation/installing-nic/))
-   Cert Manager ([Installation Guide](https://cert-manager.io/docs/installation/helm/))
-   PostgreSQL Database
- Nats
- One domain/subdomain (This single host will be used throughout all components)
- SSL certificates for domain or go with Let's Encrypt

## OCM Engine Stack comprises the following components
- SSI Abstraction
- Proof Manager
- Principal Manager
- Connection Manager
- Attestation Manager
- Aries Mediator
- Caddy Web Server
## Getting Started

### Clone the OCM-Engine Repository & Install Nats Server to the cluster

```sh
> git clone https://github.com/smartSenseSolutions/gaia-x-ocm-engine.git

> kubectl create namespace ocm-engine

> helm repo add nats https://nats-io.github.io/k8s/helm/charts/
> helm repo update
> helm install nats nats/nats -n ocm-engine

```

### Install Lets Encrypt Cluster Issuer to the cluster (Optional)
If you want to use free SSL certificates on your domain.

After the successful installation of NGINX Ingress controller generate a file named `cluster-issuer.yaml` and paste the following content into it.

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  namespace: default
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: <your-email-address>
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod
    # Enable the HTTP-01 challenge provider
    solvers:
    - http01:
        ingress:
          class: nginx

> kubectl apply -f cluster-issuer.yaml
```
## Deploy Following components

1. **SSI Abstraction**
    
    `cd gaia-x-ocm-engine/apps/ssi-abstraction/deployment/helm`
    
    `cat values-override.yaml > custom-values.yaml`

    Update certain properties in the `custom-values.yaml` with the provided details below
    ```
    image:
      repository: "public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine"
      name: ssi-abstraction
      tag: "latest"
      pullPolicy: IfNotPresent

    ssiAbstraction:
      agent:
        host: <domain/subdomain-name>
        database:
          host: <postgres-host-name>
          user: <postgres-user-name>
          password: <postgres-password>
          db: <db-name>

    ingress:
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates
      frontendDomain: <domain/subdomain-name>
      frontendTlsSecretName: <tls-secret-name>
    ```
    Before applying helm charts to the cluster, ensure to perform a dry run first

    `helm install ssi-abstraction . -f custom-values.yaml -n ocm-engine --dry-run`
    
    If the dry run is successful, proceed to install the helm charts to the cluster
    
    `helm install ssi-abstraction . -f custom-values.yaml -n ocm-engine`



2. **Proof Manager**

    `cd gaia-x-ocm-engine/apps/proof-manager/deployment/helm`
    
    `cat values-override.yaml > custom-values.yaml`

    Update certain properties in the `custom-values.yaml` with the provided details below
    ```
    image:
      repository: "public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine"
      name: proof-manager
      tag: "latest"
      pullPolicy: IfNotPresent

    proofManager:
      urlPath: <domain/subdomain-name>/proof
      database:
        host: <postgres-host-name>
        user: <postgres-user-name>
        password: <postgres-password>
        db: <db-name>

    ingress:
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates
      frontendDomain: <domain/subdomain-name>
      frontendTlsSecretName: <tls-secret-name>
    ```
    Before applying helm charts to the cluster, ensure to perform a dry run first

    `helm install proof-manager . -f custom-values.yaml -n ocm-engine --dry-run`
    
    If the dry run is successful, proceed to install the helm charts to the cluster
    
    `helm install proof-manager . -f custom-values.yaml -n ocm-engine`

3. **Connection Manager**

    `cd gaia-x-ocm-engine/apps/connection-manager/deployment/helm`
    
    `cat values-override.yaml > custom-values.yaml`

    Update certain properties in the `custom-values.yaml` with the provided details below
    ```
    image:
      repository: "public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine"
      name: connection-manager
      tag: "latest"
      pullPolicy: IfNotPresent

    connectionManager:
      urlPath: <domain/subdomain-name>/connection
      database:
        host: <postgres-host-name>
        user: <postgres-user-name>
        password: <postgres-password>
        db: <db-name>

    ingress:
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates
      frontendDomain: <domain/subdomain-name>
      frontendTlsSecretName: <tls-secret-name>
    ```
    Before applying helm charts to the cluster, ensure to perform a dry run first

    `helm install connection-manager . -f custom-values.yaml -n ocm-engine --dry-run`
    
    If the dry run is successful, proceed to install the helm charts to the cluster
    
    `helm install connection-manager . -f custom-values.yaml -n ocm-engine`

4. **Attestation Manager**

    `cd gaia-x-ocm-engine/apps/attestation-manager/deployment/helm`
    
    `cat values-override.yaml > custom-values.yaml`

    Update certain properties in the `custom-values.yaml` with the provided details below
    ```
    image:
      repository: "public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine"
      name: attestation-manager
      tag: "latest"
      pullPolicy: IfNotPresent

    attestationManager:
      database:
        host: <postgres-host-name>
        user: <postgres-user-name>
        password: <postgres-password>
        db: <db-name>

    ingress:
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates
      frontendDomain: <domain/subdomain-name>
      frontendTlsSecretName: <tls-secret-name>
    ```
    Before applying helm charts to the cluster, ensure to perform a dry run first

    `helm install attestation-manager . -f custom-values.yaml -n ocm-engine --dry-run`
    
    If the dry run is successful, proceed to install the helm charts to the cluster
    
    `helm install attestation-manager . -f custom-values.yaml -n ocm-engine`

5. **Principal Manager**

    `cd gaia-x-ocm-engine/additional_components_deployment/principal-manager`
    
    `cat principal-manager.yaml > custom-principal-manager.yaml`

    `cat ingress.yaml > custom-principal-manager-ingress.yaml`

    Update certain properties in the `custom-principal-manager.yaml` with the provided details below

    ```
    - env:
      - name: DATABASE_URL
        value: postgresql://<postgres-username>:<postgres-password>@<postgres-host>:5432/<db-name>?schema=principal

      image: public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine/principal-manager:latest
    ```

    Update certain properties in the `custom-principal-manager-ingress.yaml` with the provided details below

    ```
    metadata:
      annotations: cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates

    spec:
      rules:
      - host: <domain/subdomain-name>
      tls:
      - hosts:
        - <domain/subdomain-name>
        secretName: <tls-secret-name>
    ```

    Before applying manifests to the cluster, ensure to perform a dry run first

    `kubectl apply -f custom-principal-manager.yaml -f custom-principal-manager-ingress.yaml --dry-run=true/server`
    
    If the dry run is successful, proceed to install the manifests to the cluster
    
    `kubectl apply -f custom-principal-manager -f custom-principal-manager-ingress.yaml`

6. **Aries Mediator Agent**

    `cd gaia-x-ocm-engine/additional_components_deployment/aries-mediator`
    
    `cat mediator.yaml > custom-mediator.yaml`

    `cat mediator-wss-ingress.yaml > custom-mediator-wss-ingress.yaml`

    Update certain properties in the `custom-mediato.yaml` with the provided details below

    ```
    - env:
      - name: ACAPY_WALLET_STORAGE_CONFIG
        value: '{"url":"<postgres-host>","wallet_scheme":"DatabasePerWallet"}'
      - name: ACAPY_WALLET_STORAGE_CREDS
        value: '{"account":"<postgres-username>","password":"<postgres-password>","admin_account":"<postgres-username>","admin_password":"postgres-password"}'
      - name: MEDIATOR_HTTP_IN_ENDPOINT_URL
        value: "https://<domain/subdomain-name>/caddy-agent"
      - name: MEDIATOR_WSS_ENDPOINT_URL
        value: "<domain/subdomain-name>/mediator-wss"

      image: public.ecr.aws/b5l9l4y4/smartsensesolutions/xfsc-toolkit/ocm-engine/aries-mediator-agent:latest
    ```

    Update certain properties in the `custom-mediator-wss-ingress.yaml` with the provided details below

    ```
    metadata:
      annotations: cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates

    spec:
      rules:
      - host: <domain/subdomain-name>
      tls:
      - hosts:
        - <domain/subdomain-name>
        secretName: <tls-secret-name>
    ```

    Before applying manifests to the cluster, ensure to perform a dry run first

    `kubectl apply -f custom-mediator.yaml -f custom-mediator-wss-ingress.yaml --dry-run=true/server`
    
    If the dry run is successful, proceed to install the manifests to the cluster
    
    `kubectl apply -f custom-mediator.yaml -f custom-mediator-wss-ingress.yaml`

7. **Caddy Web Server**

    `cd gaia-x-ocm-engine/additional_components_deployment/aries-mediator`
    
    `cat caddy.yaml > custom-caddy.yaml`

    `cat caddy-ingress.yaml > custom-caddy-ingress.yaml`

    Update certain properties in the `custom-caddy.yaml` with the provided details below

    ```
    spec:
      volumes:
        - name: caddy-config
          hostPath:
            path: /<full-path-to-cloned-repo>/gaiax-ocm-engine/compose/aries-mediator-service/caddy
    ```

    Update certain properties in the `custom-caddy-ingress.yaml` with the provided details below

    ```
    metadata:
      annotations: cert-manager.io/cluster-issuer: letsencrypt-prod # Exclude this annotation if you prefer not to utilize Let's Encrypt SSL certificates

    spec:
      rules:
      - host: <domain/subdomain-name>
      tls:
      - hosts:
        - <domain/subdomain-name>
        secretName: <tls-secret-name>
    ```

    Before applying manifests to the cluster, ensure to perform a dry run first

    `kubectl apply -f custom-caddy.yaml -f custom-caddy-ingress.yaml --dry-run=true/server`
    
    If the dry run is successful, proceed to install the manifests to the cluster
    
    `kubectl apply -f custom-caddy.yaml -f custom-caddy-ingress.yaml`