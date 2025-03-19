#!/bin/bash
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Vision AI 2.0...${NC}"

# Pull latest changes
echo -e "${GREEN}Pulling latest changes from repository...${NC}"
git pull

# Build and start the containers
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check if containers are running
echo -e "${GREEN}Checking container status...${NC}"
if [ "$(docker ps -q -f name=vision-ai-web)" ]; then
    echo -e "${GREEN}✅ Web container is running${NC}"
else
    echo -e "${RED}❌ Web container failed to start${NC}"
    docker logs vision-ai-web
    exit 1
fi

# Wait for the application to be fully available
echo -e "${GREEN}Waiting for application to be ready...${NC}"
sleep 5

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}The application is now available at: http://localhost${NC}"

# Make the script executable
chmod +x deploy.sh 