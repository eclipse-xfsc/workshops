#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Kong service setup..."

# Install Kong Service using Helm
echo "Installing Kong Service..."
helm install kong-service "/home/ubuntu/projects/pcm-cloud/deployment/Kong Service" -n kong || { echo "Failed to install Kong Service"; exit 1; }

echo "Kong service setup completed successfully."
