#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting final configurations setup..."

# Apply Signer Service configuration
echo "Applying Signer Service configuration..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/signer/service.yaml || { echo "Failed to apply Signer Service configuration"; exit 1; }

# Apply Policy Service configuration
echo "Applying Policy Service configuration..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/policy/service.yaml || { echo "Failed to apply Policy Service configuration"; exit 1; }

echo "Final configurations setup completed successfully."
