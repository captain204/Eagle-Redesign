#!/bin/bash
#
# Eagle Quick Deploy for $24/mo Droplet
# Run this on a fresh DigitalOcean droplet to set up and deploy in one command
#
# Usage: curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/eagle/main/scripts/quick-deploy.sh | bash -s -- --domain yourdomain.com --email your@email.com
#

set -e

# Configuration
APP_DIR="/app"
GITHUB_REPO="https://github.com/YOUR_USERNAME/eagle.git"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Parse arguments
DOMAIN=""
EMAIL=""
SKIP_SSL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --skip-ssl)
            SKIP_SSL=true
            shift
            ;;
        --repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        -h|--help)
            echo -e "${BLUE}Eagle Quick Deploy Script${NC}"
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --domain    Your domain name (e.g., example.com)"
            echo "  --email     Your email for SSL certificate"
            echo "  --skip-ssl  Skip SSL setup (use IP for testing)"
            echo "  --repo      GitHub repository URL"
            echo "  -h, --help  Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
esac
done

# Helper functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
}

print_step() {
    echo -e "\n${YELLOW}[$1] $2${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (sudo ./quick-deploy.sh)"
    exit 1
fi

# Start deployment
print_header "🦅 Eagle E-Commerce Quick Deploy ($12/mo Production)"

echo ""
echo -e "${MAGENTA}Server Info:${NC}"
TOTAL_RAM=$(free -g | awk 'NR==2 {print $2}')
echo "  Total RAM: ${TOTAL_RAM}GB"
echo "  CPU Cores: $(nproc)"
echo "  Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2}')"
echo ""

# Check RAM and provide recommendations
if [ "$TOTAL_RAM" -lt 2 ]; then
    echo -e "${YELLOW}⚠️  Low-memory server detected (${TOTAL_RAM}GB RAM)${NC}"
    echo -e "${YELLOW}   Build may take 15-20 minutes. Consider building locally.${NC}"
elif [ "$TOTAL_RAM" -lt 4 ]; then
    echo -e "${GREEN}✓ Standard server detected (${TOTAL_RAM}GB RAM)${NC}"
    echo -e "${BLUE}   Build expected in 8-12 minutes${NC}"
elif [ "$TOTAL_RAM" -lt 8 ]; then
    echo -e "${GREEN}✓ Production server detected (${TOTAL_RAM}GB RAM)${NC}"
    echo -e "${BLUE}   Build expected in 6-10 minutes${NC}"
else
    echo -e "${GREEN}✓ High-performance server detected (${TOTAL_RAM}GB RAM)${NC}"
    echo -e "${BLUE}   Build expected in 3-5 minutes${NC}"
fi
echo ""

# Confirm before proceeding
if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  No domain specified. Will deploy with IP access only.${NC}"
    echo -e "${YELLOW}   To enable SSL later, run: certbot --nginx${NC}"
    read -p "Continue? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# ============================================
# Step 1: System Update
# ============================================
print_step "1/8" "Updating system packages..."
apt update -qq && apt upgrade -y -qq
print_success "System updated"

# ============================================
# Step 2: Install Docker
# ============================================
print_step "2/8" "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# ============================================
# Step 3: Install Docker Compose
# ============================================
print_step "3/8" "Installing Docker Compose..."
if ! docker compose version &> /dev/null; then
    apt install -y -qq docker-compose-plugin
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# ============================================
# Step 4: Configure Swap (Safety Net)
# ============================================
print_step "4/8" "Configuring swap memory..."
if [ ! -f /swapfile ]; then
    TOTAL_RAM=$(free -g | awk 'NR==2 {print $2}')
    if [ "$TOTAL_RAM" -ge 8 ]; then
        fallocate -l 512M /swapfile
        echo -e "   ${BLUE}8GB+ RAM detected - Creating 512MB emergency swap${NC}"
    elif [ "$TOTAL_RAM" -ge 4 ]; then
        fallocate -l 1G /swapfile
        echo -e "   ${BLUE}4GB RAM detected - Creating 1GB safety swap${NC}"
    elif [ "$TOTAL_RAM" -ge 2 ]; then
        fallocate -l 2G /swapfile
        echo -e "   ${BLUE}2GB RAM detected - Creating 2GB swap${NC}"
    else
        fallocate -l 4G /swapfile
        echo -e "   ${BLUE}Low RAM detected (${TOTAL_RAM}GB) - Creating 4GB swap${NC}"
    fi
    
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    print_success "Swap configured"
else
    print_success "Swap already configured"
fi

# ============================================
# Step 5: Configure Firewall
# ============================================
print_step "5/8" "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured (SSH, HTTP, HTTPS)"
else
    echo -e "${YELLOW}⚠ UFW not available, skipping firewall${NC}"
fi

# ============================================
# Step 6: Clone Repository
# ============================================
print_step "6/8" "Setting up application..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠ Repository already exists, pulling latest changes...${NC}"
    git pull
else
    git clone "$GITHUB_REPO" .
fi

mkdir -p backups logs public/media
print_success "Application directory ready"

# ============================================
# Step 7: Configure Environment
# ============================================
print_step "7/8" "Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    
    # Generate Payload secret
    PAYLOAD_SECRET=$(openssl rand -hex 32)
    sed -i "s/your_payload_secret_here/$PAYLOAD_SECRET/" .env
    
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me)
    
    if [ -n "$DOMAIN" ]; then
        sed -i "s|https://yourdomain.com|https://$DOMAIN|" .env
        echo -e "   ${BLUE}Domain: https://$DOMAIN${NC}"
    else
        sed -i "s|https://yourdomain.com|http://$SERVER_IP:3000|" .env
        echo -e "   ${BLUE}Access: http://$SERVER_IP:3000${NC}"
    fi
    
    print_success "Environment configured"
    echo -e "${YELLOW}⚠️  Please update the following in .env:${NC}"
    echo -e "   - PAYSTACK_SECRET_KEY"
    echo -e "   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
    echo -e "   - RESEND_API_KEY"
else
    print_success ".env already exists"
fi

# ============================================
# Step 8: Build and Deploy
# ============================================
print_step "8/8" "Building and deploying application..."

TOTAL_RAM=$(free -g | awk 'NR==2 {print $2}')
if [ "$TOTAL_RAM" -ge 8 ]; then
    echo -e "   ${BLUE}High-performance server detected (${TOTAL_RAM}GB RAM) - Fast build expected (3-5 min)${NC}"
elif [ "$TOTAL_RAM" -ge 4 ]; then
    echo -e "   ${BLUE}Production server detected (${TOTAL_RAM}GB RAM) - Build expected (6-10 min)${NC}"
elif [ "$TOTAL_RAM" -ge 2 ]; then
    echo -e "   ${YELLOW}Standard server detected (${TOTAL_RAM}GB RAM) - Moderate build expected (10-15 min)${NC}"
else
    echo -e "   ${YELLOW}Low-memory server detected (${TOTAL_RAM}GB RAM) - Build may take 15-20 min${NC}"
fi

docker compose up -d --build

# Wait for application
echo -e "\n${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 15

# Check health
if docker compose ps | grep -q "Up"; then
    print_success "Application deployed successfully!"
else
    print_error "Application may have issues. Check logs: docker compose logs -f"
    exit 1
fi

# ============================================
# Optional: SSL Setup
# ============================================
if [ -n "$DOMAIN" ] && [ "$SKIP_SSL" = false ]; then
    print_step "SSL" "Installing Nginx and Certbot..."
    apt install -y -qq nginx certbot python3-certbot-nginx
    print_success "Nginx and Certbot installed"
    
    # Configure Nginx
    print_step "SSL" "Configuring Nginx reverse proxy..."
    cat > /etc/nginx/sites-available/eagle << 'NGINX_EOF'
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=50r/s;

server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /app/public/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        limit_req zone=api_limit burst=30 nodelay;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://localhost:3000;
        limit_req zone=general burst=50 nodelay;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX_EOF

    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/eagle
    
    ln -s /etc/nginx/sites-available/eagle /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl restart nginx
    print_success "Nginx configured"
    
    # Obtain SSL
    print_step "SSL" "Obtaining SSL certificate..."
    if [ -n "$EMAIL" ]; then
        certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
            --non-interactive \
            --agree-tos \
            --email "$EMAIL" \
            --redirect
    else
        certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
            --non-interactive \
            --agree-tos \
            --register-unsafely-without-email \
            --redirect
    fi
    print_success "SSL certificate installed!"
    
    # Update environment for HTTPS
    sed -i "s|http://.*:3000|https://$DOMAIN|" .env
    docker compose up -d --build
fi

# ============================================
# Summary
# ============================================
echo ""
print_header "🎉 Deployment Complete!"

SERVER_IP=$(curl -s ifconfig.me)

echo -e "\n${GREEN}Access Your Application:${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "   🌐 ${MAGENTA}https://$DOMAIN${NC}"
    echo -e "   👤 Admin: https://$DOMAIN/admin"
else
    echo -e "   🌐 ${MAGENTA}http://$SERVER_IP:3000${NC}"
    echo -e "   👤 Admin: http://$SERVER_IP:3000/admin"
fi

echo -e "\n${GREEN}Useful Commands:${NC}"
echo -e "   View logs:     ${BLUE}docker compose logs -f${NC}"
echo -e "   Stop app:      ${BLUE}docker compose down${NC}"
echo -e "   Restart app:   ${BLUE}docker compose restart${NC}"
echo -e "   Check status:  ${BLUE}docker ps${NC}"
echo -e "   Monitor:       ${BLUE}docker stats${NC}"
echo -e "   Backup DB:     ${BLUE}cd /app && ./scripts/backup-db.sh${NC}"

echo -e "\n${GREEN}Server Resources:${NC}"
echo -e "   RAM: $(free -h | awk 'NR==2 {print $2 "/" $3 "/" $4}')"
echo -e "   Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " used"}')"

echo -e "\n${YELLOW}⚠️  Important:${NC}"
echo -e "   1. Update .env with your Paystack and Resend API keys"
echo -e "   2. Visit /admin to create your first admin user"
echo -e "   3. Set up automated backups: crontab -e"
echo -e "      Add: 0 3 * * * cd /app && ./scripts/backup-db.sh"

echo -e "\n${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Need help? Check DEPLOYMENT_DO24.md for detailed guide${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
