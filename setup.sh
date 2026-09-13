#!/bin/bash
# PassIt Deployment Script

# 1. Ensure Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

# 2. Cleanup existing container (ignore failure if doesn't exist)
echo "Cleaning up existing container..."
sudo docker stop passit 2>/dev/null || true
sudo docker rm passit 2>/dev/null || true

# 3. Pull latest image
echo "Pulling latest image..."
sudo docker pull ghcr.io/clemoseitano/passit-app:latest

# 4. Start container
echo "Starting container..."
sudo docker run -d --name passit -p 5001:5001 --restart unless-stopped ghcr.io/clemoseitano/passit-app:latest

echo "PassIt is now running at http://localhost:5001"
