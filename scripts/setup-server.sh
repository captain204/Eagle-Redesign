#!/bin/bash
#
# Eagle Server Setup Script
# Run this on a fresh DigitalOcean droplet to set up everything
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🦅 Eagle Server Setup Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (sudo ./setup-server.sh)${NC}"
    exit 1
fi

# ============================================
# Step 1: System Update
# ============================================
echo -e "\n${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"

# ============================================
# Step 2: Enable Swap (CRITICAL for 1GB RAM)
# ============================================
echo -e "\n${YELLOW}[2/8] Configuring swap memory...${NC}"
if [ -f /swapfile ]; then
    echo -e "${GREEN}✓ Swap already configured${NC}"
else
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo -e "${GREEN}✓ Swap created (2GB)${NC}"
fi

# Verify swap
SWAP=$(free -m | awk 'NR==2 {print $3}')
echo -e "   Swap available: ${SWAP}MB"

# ============================================
# Step 3: Install Docker
# ============================================
echo -e "\n${YELLOW}[3/8] Installing Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker already installed${NC}"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
fi

# ============================================
# Step 4: Install Docker Compose Plugin
# ============================================
echo -e "\n${YELLOW}[4/8] Installing Docker Compose...${NC}"
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
else
    apt install -y docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
fi

# ============================================
# Step 5: Install Git
# ============================================
echo -e "\n${YELLOW}[5/8] Installing Git...${NC}"
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git already installed${NC}"
else
    apt install -y git
    echo -e "${GREEN}✓ Git installed${NC}"
fi

# ============================================
# Step 6: Configure Firewall
# ============================================
echo -e "\n${YELLOW}[6/8] Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    echo -e "${GREEN}✓ Firewall configured (SSH, HTTP, HTTPS)${NC}"
else
    echo -e "${YELLOW}⚠ UFW not available, skipping firewall${NC}"
fi

# ============================================
# Step 7: Install Nginx & Certbot (Optional)
# ============================================
echo -e "\n${YELLOW}[7/8] Installing Nginx and Certbot...${NC}"
apt install -y nginx certbot python3-certbot-nginx
echo -e "${GREEN}✓ Nginx and Certbot installed${NC}"

# ============================================
# Step 8: Create App Directory
# ============================================
echo -e "\n${YELLOW}[8/8] Creating application directory...${NC}"
mkdir -p /app
mkdir -p /app/backups
mkdir -p /app/logs
chown -R $SUDO_USER:$SUDO_USER /app
echo -e "${GREEN}✓ Directory structure created${NC}"

# ============================================
# Summary
# ============================================
echo -e "\n${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ Server Setup Complete!       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo "   1. Clone your repository to /app"
echo "   2. Copy .env.example to .env and configure"
echo "   3. Run: cd /app && ./scripts/deploy.sh"

echo -e "\n${YELLOW}📊 Server Info:${NC}"
echo "   IP Address: $(curl -s ifconfig.me)"
echo "   Memory: $(free -m | awk 'NR==2 {print $2}')MB"
echo "   Swap: $(free -m | awk 'NR==2 {print $3}')MB"
echo "   Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2}')"

echo -e "\n${BLUE}════════════════════════════════════${NC}"
