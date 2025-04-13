#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting common services setup..."

# Install Pre-Authorization Bridge using Helm
echo "Installing Pre-Authorization Bridge..."
helm install preauthbridge "/home/ubuntu/projects/ocm-w-stack/pre-authorization-bridge/deployment/helm" -n default || { echo "Failed to install Pre-Authorization Bridge"; exit 1; }

# Install Signer Service using Helm
echo "Installing Signer Service..."
helm install signer "/home/ubuntu/projects/trust-services/signer/deployment/helm" -n default || { echo "Failed to install Signer Service"; exit 1; }

# Install SD-JWT Service using Helm
echo "Installing SD-JWT Service..."
helm install sdjwt-service "/home/ubuntu/projects/common-services/sd-jwt-service/deployment/helm/" -n default || { echo "Failed to install SD-JWT Service"; exit 1; }

echo "Common services setup completed successfully."
