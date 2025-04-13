#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting services setup..."

# Install NATS using Helm
echo "Installing NATS..."
helm install nats "/home/ubuntu/projects/ocm-w-stack/deployment/Nats Chart/" --create-namespace --namespace nats || { echo "Failed to install NATS"; exit 1; }

# Install Universal Resolver using Helm
echo "Installing Universal Resolver..."
helm install universal-resolver "/home/ubuntu/projects/dev-ops/helm-charts/universalresolver/deployment/helm" -n default || { echo "Failed to install Universal Resolver"; exit 1; }

# Apply Redis manifests
echo "Applying Redis manifests..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/redis/ -n default || { echo "Failed to apply Redis manifests"; exit 1; }

echo "Services setup completed successfully."
