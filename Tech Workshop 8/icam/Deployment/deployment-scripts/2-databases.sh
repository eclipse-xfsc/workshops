#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting database setup..."

# Delete Cassandra secrets
echo "Deleting existing Cassandra secrets..."
kubectl delete -f /home/ubuntu/k8s/secrets/cassandra.yaml -n default || { echo "Failed to delete Cassandra secrets"; exit 1; }

# Apply Cassandra storage configuration
echo "Applying Cassandra storage configuration..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/cassandra/storage.yaml -n db || { echo "Failed to apply Cassandra storage configuration"; exit 1; }

# Install Cassandra using Helm
echo "Installing Cassandra with Helm..."
helm install cassandra \
    -f /home/ubuntu/k8s/k8s-manifest/cassandra/values.yaml \
    --set dbUser.password=fenNkV5v0QuQyA6 \
    oci://registry-1.docker.io/bitnamicharts/cassandra -n db || { echo "Failed to install Cassandra"; exit 1; }

# Reapply Cassandra secrets
echo "Reapplying Cassandra secrets..."
kubectl apply -f /home/ubuntu/k8s/secrets/cassandra.yaml -n default || { echo "Failed to reapply Cassandra secrets"; exit 1; }

# Apply PostgreSQL manifests
echo "Applying PostgreSQL manifests..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/postgres/ -n db || { echo "Failed to apply PostgreSQL manifests"; exit 1; }

echo "Database setup completed successfully."
