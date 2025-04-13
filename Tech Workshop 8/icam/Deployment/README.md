# Deploy ICAM Components in Your AWS Account 🛠️

## Table of Contents

-   [Introduction](#introduction)
-   [Prerequisites](#prerequisites)
    -   [AWS Account](#aws-account)
    -   [VS Code Editor 💻 (Optional)](#vs-code-editor-💻-optional)
    -   [Domain Name 📌](#domain-name-📌)
    -   [Key Pair for SSH 🔐](#key-pair-for-ssh-🔐)
-   [Deployment](#deployment)
    -   [Launch EC2 Instance](#launch-ec2-instance)
    -   [Attach Elastic IP](#attach-elastic-ip)
    -   [SSH into the Instance](#ssh-into-the-instance)
    -   [Update DNS Configurations](#update-dns-configurations)
-   [Configurations](#configurations)
    -   [Config Changes with VS Code](#config-changes-with-vs-code)
    -   [Create a Hosted Zone in AWS](#create-a-hosted-zone-in-aws)
    -   [IAM User in AWS Accounts](#iam-user-in-aws-accounts)
-   [Deployment Scripts](#deployment-scripts)
    -   [Basic Setup](#basic-setup)
    -   [Databases](#databases)
    -   [Other Basic Services](#other-basic-services)
    -   [Keycloak](#keycloak)
    -   [HashiCorp Vault](#hashicorp-vault)
    -   [OCM-W Stack Components](#ocm-w-stack-components)
    -   [PCM Cloud Components](#pcm-cloud-components)
-   [Access Your Web UI](#access-your-web-ui)

## Introduction

Welcome to the guide on deploying ICAM components in your AWS account. This document will walk you through the necessary steps to set up and configure the components effectively.

### Our Cloud Deployment

![XFSC Deployment](./img/deployment.png)

## Prerequisites

Before you begin, ensure you have the following:

### AWS Account

An active AWS account is required for the setup.

### VS Code Editor 💻 (Optional)

While optional, using VS Code can facilitate configuration changes.

### Familiarity with AWS/DevOps

Some familiarity with AWS and DevOps will be beneficial for following this documentation.

### Domain Name 📌

Acquire a public domain name from any registrar.

-   If the Domain name you are using is from AWS Route53, you can skip this step.
-   If the Domain name you are using is from a different registrar, please follow the steps below, to make a hosted zone in Route53.
    -   Steps for creating a hosted zone in Route53:
        -   Go to [Route53 Console](https://console.aws.amazon.com/route53/home)
        -   Click on `Hosted Zones` on the left navigation bar.
        -   Click on `Create Hosted Zone`.
        -   Enter the domain name you want to use for your workshop.
        -   Click on `Create`.

You'll need to point this domain to your AWS EC2 instance's public IP address using an A record.

-   **Domain Configurations**: For example, `workshop.learn.smartsenselabs.com`
    -   Create a wildcard entry `*.workshop.learn.smartsenselabs.com` pointing to your EC2 instance's public IP.
    -   Sub-domains that will be created automatically: (don't create these manually)
        -   `keycloak.workshop.learn.smartsenselabs.com`
        -   `vault.workshop.learn.smartsenselabs.com`
        -   `cloud-wallet.workshop.learn.smartsenselabs.com`

### Key Pair for SSH 🔐

This setup is prepared for two AWS regions: Spain and Mumbai. Choose one for your deployment.

-   [Create a key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html) in your AWS account in either:
    -   Europe (Spain) `eu-south-2`
    -   Asia Pacific (Mumbai) `ap-south-1`

This key pair will allow SSH access to your EC2 instance.

## Deployment

🚀 Let's start with the deployment:

### Launch EC2 Instance

1. **Launch an EC2 instance** with the following AMI ID:
    - Spain, Europe (`eu-south-2`): `ami-0cecb7c804cdb1d74`
    - Mumbai, India (`ap-south-1`): `ami-0c278d74f75a46267`
    - **Note**: From this point, you will incur costs on your AWS account for the resources.
    - **Instance Type**: `t3a.2xlarge` (If in Spain region, try `t4g.2xlarge`)
    - **Key Pair**: Use the key pair created in the previous step.
    - **Storage**: 64 GB
    - **Security Group**: Create a new one and add the following inbound rules after launching the instance:
    - Rule 1:
        - Type: `HTTP`
        - Protocol: `TCP`
        - Port Range: `80`
        - Source: `Anywhere` (0.0.0.0/0)
    - Rule 2:
        - Type: `HTTP`
        - Protocol: `TCP`
        - Port Range: `80`
        - Source: `Anywhere` (0.0.0.0/0)
    - Rule 3:
        - Type: `HTTP`
        - Protocol: `TCP`
        - Port Range: `443`
        - Source: `Anywhere` (0.0.0.0/0)
    - Rule 4:
        - Type: `Custom TCP`
        - Protocol: `TCP`
        - Port Range: `30001 - 30020`
        - Source: `Anywhere` (0.0.0.0/0)

### Attach Elastic IP

2. **Attach an Elastic IP** to the instance:
    - In the left navigation bar, under `Network & Security`, click on `Elastic IPs`.
    - Click on `Allocate Elastic IP Address` button.
    - Click on `Allocate`.
    - Once allocated, select that IP, go to actions, and click on `Associate Elastic IP Address`.
    - Select the instance launched in the previous step and click on `Associate`.
    - Keep this Elastic IP handy as it is now the public IP address of the instance and will be used in multiple steps.

### SSH into the Instance

3. **SSH into the instance** 🔐:

    - Open your terminal and SSH into the instance:

        ```bash
        ssh -i {path-to-key.pem} ubuntu@{ec2-public-ip}
        ```

    - **SSH Troubleshooting**:

        - **UNPROTECTED PRIVATE KEY FILE!**:

            - If you encounter the error `WARNING: UNPROTECTED PRIVATE KEY FILE!`:
              ![WARNING: UNPROTECTED PRIVATE KEY FILE](./img/unprotected-private-key.png)
            - Execute the following command and then try to SSH again:

                ```sh
                chmod 400 {path-to-key.pem}
                ```

        - **Too many authentication failures**:

            - If you encounter the error `Too many authentication failures`:
              ![Too many authentication failures](./img/too-many-auth.png)
            - Add an additional flag `-o IdentitiesOnly=yes` to your SSH command and try again:

                ```sh
                ssh -o IdentitiesOnly=yes -i {path-to-key.pem} ubuntu@{ec2-public-ip}
                ```

    Once you're in the EC2 instance, proceed with changing environment variables and configurations in later steps.

### Update DNS Configurations

4. **Update your DNS configurations**:
    - Point your domain name to the AWS EC2 instance's public IP address with an A record.
    - For example, if your domain name is `workshop.learn.smartsenselabs.com`, add an A record for `*.workshop.learn.smartsenselabs.com` pointing to the Elastic IP associated with the instance. (Set the TTL to 300 seconds)

## Configurations

### Config Changes with VS Code

-   Use VS Code from your local machine to make changes on the EC2 instance.
-   Establish a remote SSH connection to the EC2 instance using VS Code and the SSH file:

    -   Open a new VS Code window, and click on `Connect to`.
    -   Click on `Connect to Host` and select `Add New SSH Host...`.
    -   Enter the entire SSH command into the field. Example:

        ```sh
        ssh -i ./path/to/private-key.pem ubuntu@<ec2-instance-public-ip>
        ```

        Ensure the path to the private key is absolute on your local machine.

    -   Once connected, open the home directory, which is `/home/ubuntu` in this case.

-   Make the following changes:

    -   Go to the Global Search section of VS Code.
    -   Search for `workshop.learn.smartsenselabs.com` and replace it with your desired domain name. Ensure there are no trailing spaces when replacing the domain.

### Build Docker image for Web-ui

```sh
cd /home/ubuntu/projects/pcm-cloud/web-ui

docker build -f deployment/docker/Dockerfile -t web-ui .

cd
```

### Build Docker image for DummyContentSigner Service

```sh
cd /home/ubuntu/projects/ocm-w-stack/credential-issuance/modules/dummycontentsigner

docker build -f deployment/docker/Dockerfile -t dummycontentsigner .

cd
```

### Build Docker image for HTTP NATS Services

```sh
cd /home/ubuntu/projects/pcm-cloud/http-nats-services

docker build -t http-nats-presentation -f presentation.Dockerfile .

cd
```

### IAM User in AWS Accounts

To manage DNS entries for wildcard certificate issuance, create an IAM user with the necessary permissions:

-   Navigate to the `IAM Dashboard` on AWS.
-   Select `Policies` from left sidebar, and then select `Create Policy`.
-   Select `JSON` tab, and paste the following policy document:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "route53:GetChange",
                "Resource": "arn:aws:route53:::change/*"
            },
            {
                "Effect": "Allow",
                "Action": ["route53:ChangeResourceRecordSets", "route53:ListResourceRecordSets"],
                "Resource": ["arn:aws:route53:::hostedzone/*"]
            },
            {
                "Effect": "Allow",
                "Action": "route53:ListHostedZonesByName",
                "Resource": "*"
            }
        ]
    }
    ```
-   Click on `Next`. Give the policy a name, and then click on `Create Policy`.
-   Once the policy is created, select `Users` from left sidebar, and then select `Add user`.
-   Select `Attach existing policies directly` from the dropdown, and then select the policy you just created.
-   Once the user is created, search and open the user and select `Security Credentials`
-   Scroll down a bit to `Access Keys` Section click `Create access key`.
-   Under `Use case` select `Command Line Interface (CLI)`, check the bottom tick mark for confirmation and click `Next`.
-   Mention any short description and then `Create access key`.
-   Once it is done, you will get the Access Key ID and Secret Access Key. Copy these values and keep them safe. (You can only see them once)
-   Update these credentials on the Ec2 using VS code or your terminal.

    -   Edit this file: `/home/ubuntu/k8s/k8s-manifest/cert/issuer.yaml`

        -   Change the `hostedZoneID` to the ID of the hosted zone you created in the previous step.(You can get this ID from Route53 Hosted Zone)
        -   Change the `accessKeyID` to the value you copied from AWS.
        -   For the Secret Access Key, enter this command this command to convert the value to base64 format:

            ```sh
            echo -n "your-secret-access-key" | base64
            ```

        -   Copy the output and paste it in this file `/home/ubuntu/k8s/secrets/iam.yaml`
        -   Execute this command to apply the changes:

            ```sh
            kc apply -f /home/ubuntu/k8s/secrets/iam.yaml
            ```

## Deployment Scripts

Now, SSH into the instance using the terminal. In the home directory, you'll find several scripts to assist with the deployment. Execute the scripts in the following order:

### Basic Setup

```sh
bash ./1-basic-setup.sh
```

-   Check weather the clusterissuer is properly configured or not
    ```
    kc get clusterissuer
    kc get cert
    ```
-   If the certificate is not issued, please check the logs of the `cert-issuer` pod. And If it is giving an error, we have to create the certificate manually.

    -   Manually create the certificate:

        -   Execute `sudo certbot certonly --manual --preferred-challenges=dns -d '\*.workshop.learn.smartsenselabs.com'`
        -   Follow the instructions to create the certificate.
        -   Once create navigate to this directory `cd /etc/letsencrypt/live/workshop.learn.smartsenselabs.com` (Note: you might need to change the user to root by `sudo su root`)
        -   Run `cat cert.pem chain.pem > full-cert.pem`
        -   Then create base64 values of certificate and private key using:

        ```sh
        # Encode the certificate
        base64 -w 0 fullchain.pem > fullchain.pem.base64

        # Encode the private key
        base64 -w 0 privkey.pem > privkey.pem.base64
        ```

        -   Then probably ssh in to the instance in a new terminal or use VS code.
        -   Open this file `/home/ubuntu/k8s/k8s-manifest/cert/wildcard-secret.yaml`
        -   Copy the values `tls.crt: <base64_encoded_certificate>` and `tls.key: <base64_encoded_key>`
        -   Apply the secret file with: `kc apply -f /home/ubuntu/k8s/k8s-manifest/cert/wildcard-secret.yaml`

    -   We will have to perform one more step to provide these certificate to the Keycloak, for that please follow the steps below:

        -   Update the content of these files accordingly:
            -   `xfsc-keycloak.key`: with content of `privkey.pem` file.
            -   `xfsc.crt`: with the content of `fullchain.pem` file.
        -   Execute `sudo openssl x509 -in xfsc.crt -out xfsc-keycloak.pem -outform PEM`

### Databases

```sh
bash ./2-databases.sh
```

-   This script will create the necessary databases.

-   To verify the status of the database pods, execute:

    ```sh
    kc get po -n db
    ```

    -   Please wait until all pods display a status of Ready. This process may take a few minutes.

### Other Basic Services

```sh
bash ./3-services.sh
```

-   This script will set up additional essential services required for the deployment.

### Keycloak

-   Execute the deployment script for Keycloak:

```sh
bash ./4-keycloak.sh
```

-   We will have to wait for a few minutes for keycloak to be ready.

-   After deployment, access Keycloak at keycloak.<your-domain>

### HashiCorp Vault

-   Deploy HashiCorp Vault by running:

```sh
bash ./5-vault.sh
```

-   Make a maunal change using the following commands:

```sh
export EDITOR=nano
kc edit sts vault -n vault
```

Add init container

```yaml
initContainers:
    - args:
          - -c
          - chmod -R 755 /vault/data && chown 1000:1000 /vault/data
      command:
          - /bin/sh
      image: busybox
      imagePullPolicy: Always
      name: set-permissions
      resources: {}
      securityContext:
          privileged: true
          runAsUser: 0
```

Edit security context of main container:

```yaml
securityContext:
    fsGroup: 1000
    runAsGroup: 1000
    runAsUser: 1000
```

Delete the vault pod:

```sh
kc delete po vault-0 -n vault
```

-   Post-deployment, access Vault at vault.<your-domain>

### Common Services

-   Deploy the Common Services:

```sh
bash ./6-common-services.sh
```

-   Wait for the pods to be ready

### OCM-W Stack Components

-   Deploy the OCM-W stack components:

```sh
bash ./7-ocm-w.sh
```

-   This will set up the necessary components for the OCM-W stack in your environment.
-   We will just have to disable health checks in `dummycontentsigner` service.

    ```sh
    kc edit deploy dummycontentsigner
    ```

-   Wait for the pods to be ready

### Kong Gateway

-   Deploy the Kong Gateway:

```sh
bash ./8-kong.sh
```

-   Wait for the pods to be ready

### Build the Docker Image for Account Service

### PCM Cloud Components

-   Deploy the PCM Cloud components:

```sh
bash ./9-pcm-cloud.sh
```

-   This script will deploy the PCM Cloud components.

### Final Configurations

```sh
bash ./10-final-configs.sh
```

-   Just delete the `plugin` pod if required.

### 🎉 Congratulations! All deployments are complete.

## Access Your Web UI

You can now access your web UI at https://cloud-wallet.yourdomain.com (replace yourdomain.com with your actual domain).

Credentials:

```
username: admin-web-ui
password: GBI+khUv0pg=
```

## Note Regarding AWS Resource Charges

We have deployed the following AWS resources that are chargeable:

-   AWS Ec2 Instance
-   Hosted Zone in Route53

Should you wish to continue utilizing the setup, you can retain these resources within your AWS account. However, please be aware that maintaining these resources will result in charges corresponding to their usage duration.

To avoid incurring any charges further:

-   Delete the Hosted Zone in Route53
-   Terminate the Ec2 Instance
