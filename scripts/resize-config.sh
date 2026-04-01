#!/bin/bash
#
# Eagle Resize Configuration Script
# Automatically configures docker-compose.yml and .env for your droplet size
#
# Usage: ./resize-config.sh [--24|--6]
#   --24  : Configure for $24/mo droplet (8GB RAM)
#   --6   : Configure for $6/mo droplet (1GB RAM)
#   (auto) : Auto-detect based on available RAM
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/app"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"
ENV_FILE="$APP_DIR/.env"

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (sudo ./resize-config.sh)"
    exit 1
fi

# Parse arguments
MODE="auto"
if [ "$1" == "--24" ]; then
    MODE="24"
elif [ "$1" == "--6" ]; then
    MODE="6"
fi

# Auto-detect RAM if mode is auto
if [ "$MODE" == "auto" ]; then
    TOTAL_RAM=$(free -g | awk 'NR==2 {print $2}')
    if [ "$TOTAL_RAM" -ge 8 ]; then
        MODE="24"
    else
        MODE="6"
    fi
fi

print_header "🦅 Eagle Resize Configuration"

echo ""
echo -e "${MAGENTA}Current Server Info:${NC}"
echo "  Total RAM: $(free -g | awk 'NR==2 {print $2}')GB"
echo "  CPU Cores: $(nproc)"
echo "  Swap: $(free -m | awk 'NR==2 {print $3}')MB"
echo ""

# Configure based on mode
if [ "$MODE" == "24" ]; then
    echo -e "${BLUE}Configuring for \$24/mo droplet (8GB RAM / 4 vCPU)...${NC}"
    echo ""
    
    # Update NODE_OPTIONS in .env
    if [ -f "$ENV_FILE" ]; then
        if grep -q "NODE_OPTIONS=" "$ENV_FILE"; then
            sed -i 's/NODE_OPTIONS=.*/NODE_OPTIONS=--max-old-space-size=4096/' "$ENV_FILE"
        else
            echo "NODE_OPTIONS=--max-old-space-size=4096" >> "$ENV_FILE"
        fi
        print_success "Updated NODE_OPTIONS=4096MB in .env"
    else
        print_warning ".env file not found, skipping"
    fi
    
    # Update docker-compose.yml
    if [ -f "$COMPOSE_FILE" ]; then
        sed -i "s/memory: [0-9]*[MG]/memory: 6G/" "$COMPOSE_FILE"
        sed -i "s/cpus: '[0-9.]*'/cpus: '2.0'/" "$COMPOSE_FILE"
        sed -i 's/NODE_OPTIONS=--max-old-space-size=[0-9]*/NODE_OPTIONS=--max-old-space-size=4096/' "$COMPOSE_FILE"
        print_success "Updated docker-compose.yml:"
        echo "   - Memory limit: 6G"
        echo "   - CPU limit: 2.0 cores"
        echo "   - NODE_OPTIONS: 4096MB"
    else
        print_warning "docker-compose.yml not found, skipping"
    fi
    
    echo ""
    echo -e "${GREEN}Configuration complete!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "   1. Build/deploy: docker compose up -d --build"
    echo "   2. Verify: docker ps && free -h"
    echo ""
    
elif [ "$MODE" == "6" ]; then
    echo -e "${BLUE}Configuring for \$6/mo droplet (1GB RAM / 1 vCPU)...${NC}"
    echo ""
    
    # Check if swap is configured
    SWAP=$(free -m | awk 'NR==2 {print $3}')
    if [ "$SWAP" -lt 2048 ]; then
        print_warning "Swap is less than 2GB. This is CRITICAL for 1GB RAM!"
        echo ""
        read -p "Would you like to create 4GB swap now? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Creating 4GB swap file...${NC}"
            if [ ! -f /swapfile ]; then
                fallocate -l 4G /swapfile
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                echo '/swapfile none swap sw 0 0' >> /etc/fstab
                print_success "4GB swap created and activated!"
            else
                print_warning "Swap file already exists. Reconfiguring..."
                swapoff /swapfile
                rm /swapfile
                fallocate -l 4G /swapfile
                chmod 600 /swapfile
                mkswap /swapfile
                swapon /swapfile
                print_success "4GB swap reconfigured!"
            fi
            echo ""
            echo -e "${YELLOW}Verifying swap:${NC}"
            free -h
        else
            print_warning "Proceeding without swap. Build may fail due to OOM!"
        fi
        echo ""
    fi
    
    # Update NODE_OPTIONS in .env
    if [ -f "$ENV_FILE" ]; then
        if grep -q "NODE_OPTIONS=" "$ENV_FILE"; then
            sed -i 's/NODE_OPTIONS=.*/NODE_OPTIONS=--max-old-space-size=512/' "$ENV_FILE"
        else
            echo "NODE_OPTIONS=--max-old-space-size=512" >> "$ENV_FILE"
        fi
        print_success "Updated NODE_OPTIONS=512MB in .env"
    else
        print_warning ".env file not found, skipping"
    fi
    
    # Update docker-compose.yml
    if [ -f "$COMPOSE_FILE" ]; then
        sed -i "s/memory: [0-9]*[MG]/memory: 768M/" "$COMPOSE_FILE"
        sed -i "s/cpus: '[0-9.]*'/cpus: '0.75'/" "$COMPOSE_FILE"
        sed -i 's/NODE_OPTIONS=--max-old-space-size=[0-9]*/NODE_OPTIONS=--max-old-space-size=512/' "$COMPOSE_FILE"
        print_success "Updated docker-compose.yml:"
        echo "   - Memory limit: 768M"
        echo "   - CPU limit: 0.75 cores"
        echo "   - NODE_OPTIONS: 512MB"
    else
        print_warning "docker-compose.yml not found, skipping"
    fi
    
    echo ""
    echo -e "${GREEN}Configuration complete!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "   1. Verify swap: free -h (should show ~4GB swap)"
    echo "   2. Start app: docker compose up -d"
    echo "   3. Monitor: docker stats (memory should be < 768M)"
    echo ""
    echo -e "${RED}⚠️  IMPORTANT:${NC}"
    echo "   - Never run 'docker compose up -d --build' on \$6/mo droplet"
    echo "   - Build on \$24/mo droplet instead (3-5 min vs 19+ min)"
    echo "   - If build fails, resize to \$24/mo, build, then resize back"
    echo ""
fi

print_header "Summary"
echo ""
echo "Configuration: ${MODE == '24' ? '\$24/mo (8GB RAM)' : '\$6/mo (1GB RAM)'}"
echo "RAM: $(free -g | awk 'NR==2 {print $2}')GB"
echo "Swap: $(free -m | awk 'NR==2 {print $3}')MB"
echo ""
