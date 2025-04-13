#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting basic setup..."

# Create namespaces
echo "Creating namespaces..."
kubectl create ns vault || { echo "Failed to create namespace 'vault'"; exit 1; }
kubectl create ns db || { echo "Failed to create namespace 'db'"; exit 1; }
kubectl create ns pcm-cloud || { echo "Failed to create namespace 'pcm-cloud'"; exit 1; }
kubectl create ns kong || { echo "Failed to create namespace 'kong'"; exit 1; }

# Add Helm repo and update
echo "Adding Jetstack Helm repository..."
helm repo add jetstack https://charts.jetstack.io || { echo "Failed to add Jetstack Helm repository"; exit 1; }
helm repo update || { echo "Failed to update Helm repositories"; exit 1; }

# Install cert-manager CRDs
echo "Installing cert-manager CRDs..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.crds.yaml || { echo "Failed to install cert-manager CRDs"; exit 1; }

# Enable Minikube ingress addon
echo "Enabling Minikube ingress addon..."
minikube addons enable ingress || { echo "Failed to enable Minikube ingress addon"; exit 1; }

# Install cert-manager using Helm
echo "Installing cert-manager with Helm..."
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.11.0 || { echo "Failed to install cert-manager"; exit 1; }

# Add EmberStack Helm repo and update
echo "Adding EmberStack Helm repository..."
helm repo add emberstack https://emberstack.github.io/helm-charts || { echo "Failed to add EmberStack Helm repository"; exit 1; }
helm repo update || { echo "Failed to update EmberStack Helm repositories"; exit 1; }

# Install reflector
echo "Installing Reflector with Helm..."
helm upgrade --install reflector emberstack/reflector || { echo "Failed to install Reflector"; exit 1; }

# Apply secrets
echo "Applying Kubernetes secrets..."
kubectl apply -f /home/ubuntu/k8s/secrets || { echo "Failed to apply secrets"; exit 1; }

# Apply Cluster Issuer and Wildcard Certificate
echo "Applying Cluster Issuer and Wildcard Certificate..."
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/cert/issuer.yaml -n default || { echo "Failed to apply Cluster Issuer"; exit 1; }
kubectl apply -f /home/ubuntu/k8s/k8s-manifest/cert/xfsc-wildcard.yaml -n default || { echo "Failed to apply Wildcard Certificate"; exit 1; }

echo "Basic setup completed successfully."
