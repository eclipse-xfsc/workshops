#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting PCM Cloud services setup..."

# Install Plugin Discovery Service using Helm
echo "Installing Plugin Discovery Service..."
helm install plugin-discovery-service "/home/ubuntu/projects/pcm-cloud/deployment/Plugin Discovery Service" -n pcm-cloud || { echo "Failed to install Plugin Discovery Service"; exit 1; }

# Install Configuration Service using Helm
echo "Installing Configuration Service..."
helm install configuration-service "/home/ubuntu/projects/pcm-cloud/deployment/Configuration Service" -n pcm-cloud || { echo "Failed to install Configuration Service"; exit 1; }

# Install Account Service using Helm
echo "Installing Account Service..."
helm install account-service "/home/ubuntu/projects/pcm-cloud/account-service/deployment/helm" -n pcm-cloud || { echo "Failed to install Account Service"; exit 1; }

# Install Web UI Service using Helm
echo "Installing Web UI Service..."
helm install web-ui-service "/home/ubuntu/projects/pcm-cloud/web-ui/deployment/helm" -n pcm-cloud || { echo "Failed to install Web UI Service"; exit 1; }

# Install HTTP-NATS Service using Helm
echo "Installing HTTP-NATS Service..."
helm install http-nats "/home/ubuntu/projects/pcm-cloud/http-nats-services/deployment/helm" -n pcm-cloud || { echo "Failed to install HTTP-NATS Service"; exit 1; }

# Install Plugin Kubernetes Operator using Helm
echo "Installing Plugin Kubernetes Operator..."
helm install plugin-kubernetes-operator "/home/ubuntu/projects/pcm-cloud/plugin-kubernetes-operator/deployment/helm" -n pcm-cloud || { echo "Failed to install Plugin Kubernetes Operator"; exit 1; }

# Install Plugin Service using Helm
echo "Installing Plugin Service..."
helm install plugin /home/ubuntu/projects/pcm-cloud/plugins/deployment/deployment/helm -n pcm-cloud || { echo "Failed to install Plugin Service"; exit 1; }

echo "PCM Cloud services setup completed successfully."
