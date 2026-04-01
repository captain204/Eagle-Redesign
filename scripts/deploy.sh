#!/bin/bash
#
# Eagle One-Click Deploy Script
# Pulls latest changes and rebuilds the application
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🦅 Eagle Deploy Script        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.yml not found in $APP_DIR${NC}"
    exit 1
fi

cd "$APP_DIR"

# Pull latest changes if this is a git repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}📦 Pulling latest changes from Git...${NC}"
    git pull || {
        echo -e "${RED}❌ Failed to pull changes. Please resolve conflicts manually.${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Latest changes pulled${NC}"
else
    echo -e "${YELLOW}⚠️  Not a git repository, skipping pull${NC}"
fi

# Check environment file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found, copying from .env.example${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please edit .env with your actual values before continuing${NC}"
    exit 1
fi

# Pre-deployment checks
echo -e "\n${YELLOW}🔍 Running pre-deployment checks...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose is installed${NC}"

# Check disk space
DISK_AVAILABLE=$(df -m "$APP_DIR" | awk 'NR==2 {print $4}')
if [ "$DISK_AVAILABLE" -lt 1024 ]; then
    echo -e "${RED}❌ Warning: Less than 1GB disk space available ($DISK_AVAILABLE MB)${NC}"
fi
echo -e "${GREEN}✅ Disk space: ${DISK_AVAILABLE}MB available${NC}"

# Check memory
MEM_TOTAL=$(free -g | awk 'NR==2 {print $2}')
MEM_AVAILABLE=$(free -m | awk 'NR==2 {print $7}')

if [ "$MEM_TOTAL" -ge 8 ]; then
    echo -e "${GREEN}✅ Memory: ${MEM_AVAILABLE}MB available (Production tier ${MEM_TOTAL}GB RAM)${NC}"
elif [ "$MEM_TOTAL" -ge 4 ]; then
    echo -e "${GREEN}✅ Memory: ${MEM_AVAILABLE}MB available (Standard tier ${MEM_TOTAL}GB RAM)${NC}"
else
    echo -e "${YELLOW}⚠️  Memory: ${MEM_AVAILABLE}MB available (Low-memory tier ${MEM_TOTAL}GB RAM)${NC}"
    if [ "$MEM_AVAILABLE" -lt 256 ]; then
        echo -e "${RED}❌ Warning: Less than 256MB RAM available${NC}"
    fi
fi

# Stop current application
echo -e "\n${YELLOW}🛑 Stopping current application...${NC}"
docker compose down

# Clean up old images to save space
echo -e "\n${YELLOW}🧹 Cleaning up old Docker images...${NC}"
docker image prune -f

# Build and start
echo -e "\n${YELLOW}🔨 Building application...${NC}"
if [ "$MEM_TOTAL" -ge 8 ]; then
    echo -e "   ${BLUE}Production server detected (${MEM_TOTAL}GB RAM) - Fast build expected (3-5 min)${NC}"
elif [ "$MEM_TOTAL" -ge 4 ]; then
    echo -e "   ${BLUE}Standard server detected (${MEM_TOTAL}GB RAM) - Moderate build expected (5-8 min)${NC}"
else
    echo -e "   ${YELLOW}Low-memory server detected (${MEM_TOTAL}GB RAM) - Build may take 10-20 min${NC}"
fi

docker compose up -d --build

# Wait for application to be ready
echo -e "\n${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 10

# Check health
echo -e "\n${YELLOW}🏥 Checking application health...${NC}"
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Application is running!${NC}"
    
    # Get the server URL
    SERVER_URL=$(grep "NEXT_PUBLIC_SERVER_URL" .env | cut -d'=' -f2)
    echo -e "\n${GREEN}╔════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       🎉 Deployment Successful!     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
    echo -e "\n   🌐 Visit: ${SERVER_URL}"
    echo -e "   📊 Admin: ${SERVER_URL}/admin"
    echo -e "\n   View logs: docker compose logs -f"
    echo -e "   Stop app:  docker compose down"
else
    echo -e "${RED}❌ Application may have issues starting${NC}"
    echo -e "${YELLOW}   Check logs: docker compose logs -f${NC}"
    exit 1
fi
