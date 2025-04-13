#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting OCM-W stack setup..."

# Install Well Known Rules using Helm
echo "Installing Well Known Rules..."
helm install well-known-rules "/home/ubuntu/projects/ocm-w-stack/deployment/Well Known Ingress Rules" -n default || { echo "Failed to install Well Known Rules"; exit 1; }

# Install Well Known Service using Helm
echo "Installing Well Known Service..."
helm install well-known "/home/ubuntu/projects/ocm-w-stack/well-known-service/deployment/helm" -n default || { echo "Failed to install Well Known Service"; exit 1; }

# Install DIDComm Connector using Helm
echo "Installing DIDComm Connector..."
helm install didcomm-connector "/home/ubuntu/projects/common-services/didcomm-connector/deployment/helm" -n default || { echo "Failed to install DIDComm Connector"; exit 1; }

# Install Credential Issuance Service using Helm
echo "Installing Credential Issuance Service..."
helm install credential-issuance "/home/ubuntu/projects/ocm-w-stack/credential-issuance/issuance-service/deployment/helm" -n default || { echo "Failed to install Credential Issuance Service"; exit 1; }

# Install Credential Retrieval Service using Helm
echo "Installing Credential Retrieval Service..."
helm install credential-retrieval "/home/ubuntu/projects/ocm-w-stack/deployment/Credential Retrieval" -n default || { echo "Failed to install Credential Retrieval Service"; exit 1; }

# Install Credential Verification Service using Helm
echo "Installing Credential Verification Service..."
helm install credential-verification "/home/ubuntu/projects/ocm-w-stack/credential-verification-service/deployment/helm" -n default || { echo "Failed to install Credential Verification Service"; exit 1; }

# Install Storage Service using Helm
echo "Installing Storage Service..."
helm install storage-service "/home/ubuntu/projects/ocm-w-stack/storage-service/deployment/helm" -n default || { echo "Failed to install Storage Service"; exit 1; }

# Install Status List Service using Helm
echo "Installing Status List Service..."
helm install statuslist-service "/home/ubuntu/projects/ocm-w-stack/status-list-service/deployment/helm" -n default || { echo "Failed to install Status List Service"; exit 1; }

# Install Dummy Content Signer using Helm
echo "Installing Dummy Content Signer..."
helm install dummy-contentsigner "/home/ubuntu/projects/ocm-w-stack/credential-issuance/modules/dummycontentsigner/deployment/helm" -n default || { echo "Failed to install Dummy Content Signer"; exit 1; }

echo "OCM-W stack setup completed successfully."
