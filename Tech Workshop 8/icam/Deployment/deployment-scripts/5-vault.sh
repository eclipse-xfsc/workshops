#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Vault setup..."

# Apply Vault storage configuration
echo "Applying Vault storage configuration..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/vault/storage.yaml -n vault || { echo "Failed to apply Vault storage configuration"; exit 1; }

# Install Vault using Helm
echo "Installing Vault with Helm..."
helm install vault hashicorp/vault -f /home/ubuntu/k8s/k8s-manifest/vault/values.yaml -n vault || { echo "Failed to install Vault"; exit 1; }

echo "Vault setup completed successfully."
