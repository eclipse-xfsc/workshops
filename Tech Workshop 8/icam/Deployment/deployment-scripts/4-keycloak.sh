#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Keycloak setup..."

# Apply Keycloak manifests
echo "Applying Keycloak manifests..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/keycloak -n default || { echo "Failed to apply Keycloak manifests"; exit 1; }

echo "Keycloak setup completed successfully."
