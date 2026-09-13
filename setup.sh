#!/bin/bash
# PassIt Deployment Script

if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

echo "Pulling latest image..."
docker pull ghcr.io/YOUR_GITHUB_USERNAME/passit-app:latest

echo "Starting container..."
docker run -d --name passit -p 5001:5001 --restart unless-stopped ghcr.io/YOUR_GITHUB_USERNAME/passit-app:latest

echo "PassIt is now running at http://localhost:5001"
