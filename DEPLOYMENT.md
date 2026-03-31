# 🦅 Eagle E-Commerce Platform - Deployment Guide

**Target:** DigitalOcean Droplet ($6/mo - 1GB RAM / 1 vCPU / 25GB NVMe)

> **💡 Low-Traffic Optimization:** For sites with <100 orders/month, build locally and deploy pre-built images to save costs. Build times on $6 droplet are 19+ minutes due to swap usage.

---

## 🚀 Quick Deploy Options

### Option A: Build Locally (RECOMMENDED for $6 droplet)
```bash
# On your LOCAL machine
cd /home/nuru/Eagle
docker build -t eagle-app:latest .
docker save eagle-app:latest | gzip > eagle-app.tar.gz

# Transfer to droplet (your app is in ~/Eagle-Redesign)
scp eagle-app.tar.gz root@198.199.120.186:~/Eagle-Redesign/

# On your DROPLET (via SSH)
ssh root@198.199.120.186
cd ~/Eagle-Redesign
docker load < eagle-app.tar.gz
docker compose up -d
```
**Time: 2-5 minutes** (vs 19 minutes building on droplet)

### Option B: GitHub Actions (AUTOMATED)
Push to `main` branch → auto-deploys in 3 minutes
See: `.github/workflows/deploy.yml`

### Option C: Build on Droplet (NOT RECOMMENDED)
Only if you have no other option (19+ minute build time)

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Server Setup](#2-server-setup)
3. [Application Deployment](#3-application-deployment)
4. [Domain & SSL Configuration](#4-domain--ssl-configuration)
5. [Database Backup & Restore](#5-database-backup--restore)
6. [Monitoring & Maintenance](#6-monitoring--maintenance)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

### What You Need Before Deploying

- [ ] DigitalOcean account with a $6/mo Droplet (Ubuntu 24.04 LTS)
- [ ] Domain name (optional, can use IP for testing)
- [ ] **Resend API Key** - Get from [resend.com](https://resend.com)
- [ ] **Paystack Keys** - Get from [paystack.com](https://paystack.com)
- [ ] SSH access to your server
- [ ] Git repository with your code (GitHub, GitLab, etc.)

### Generate Payload Secret

```bash
openssl rand -hex 32
```

Save this value - you'll need it for the `.env` file.

---

## 2. Server Setup

### 2.1 Create the Droplet

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Click **Create** → **Droplets**
3. **Region**: Choose closest to your customers (e.g., London, New York)
4. **Image**: Ubuntu 24.04 LTS x64
5. **Size**: Basic → Regular → **$6/mo (1GB RAM / 1 vCPU)**
6. **Authentication**: SSH Key (recommended) or Password
7. **Name**: `eagle-server`
8. Click **Create Droplet**

### 2.2 Connect to Server

```bash
ssh root@YOUR_DROPLET_IP
```

### 2.3 Enable Swap Memory (CRITICAL for 1GB RAM)

The build process requires more than 1GB RAM. Swap prevents OOM crashes:

```bash
# Create 2GB swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verify swap is active
free -m
```

Expected output should show ~2048MB swap.

### 2.4 Install Docker & Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose Plugin
apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2.5 Configure Firewall

```bash
# Enable UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Verify
ufw status
```

---

## 3. Application Deployment

### 3.1 Clone Your Repository

```bash
# Create app directory
mkdir -p /app
cd /app

# Clone your repository
git clone https://github.com/YOUR_USERNAME/eagle.git .

# Or copy files via SCP from local machine
# scp -r /path/to/local/project/* root@YOUR_IP:/app/
```

### 3.2 Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

### Required Environment Variables

```bash
# === Payload CMS ===
PAYLOAD_SECRET=your_generated_secret_from_step_1

# === Database ===
DATABASE_URI=file:./payload.db

# === Server URLs ===
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
# OR for IP testing: http://YOUR_DROPLET_IP:3000

# === Paystack (Payment Gateway) ===
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx

# === Resend (Email Service) ===
RESEND_API_KEY=re_xxxxxxxxxxxxx

# === Optional: Disable telemetry ===
NEXT_TELEMETRY_DISABLED=1
```

> **💡 Tip:** Press `Ctrl+O`, `Enter` to save, then `Ctrl+X` to exit nano.

### 3.3 Build and Start the Application

```bash
# Build and start in detached mode
docker compose up -d --build

# Watch build progress (takes 5-10 minutes on 1GB RAM)
docker compose logs -f
```

### 3.4 Verify Deployment

```bash
# Check container status
docker ps

# Check memory usage
free -m

# View logs
docker compose logs -f app
```

Visit `http://YOUR_DROPLET_IP:3000` in your browser.

---

## 4. Domain & SSL Configuration

### 4.1 Configure DNS

In your domain registrar's DNS settings:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_DROPLET_IP |
| A | www | YOUR_DROPLET_IP |

Wait 5-10 minutes for DNS propagation.

### 4.2 Install Nginx & Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### 4.3 Configure Nginx Reverse Proxy

```bash
nano /etc/nginx/sites-available/eagle
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase buffer size for Next.js headers
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting (optional security)
    location /api/ {
        proxy_pass http://localhost:3000;
        limit_req zone=api_limit burst=20 nodelay;
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

Enable the site:

```bash
# Create symlink
ln -s /etc/nginx/sites-available/eagle /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 4.4 Obtain SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com --non-interactive --agree-tos --email your@email.com
```

Certbot will automatically configure HTTPS and set up auto-renewal.

### 4.5 Update Environment Variables

After SSL is configured, update your `.env`:

```bash
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

Then rebuild:

```bash
docker compose up -d --build
```

---

## 5. Database Backup & Restore

### 5.1 Automated Daily Backups

The project includes an automated backup script:

```bash
# Create backup directory
mkdir -p /app/backups

# Make backup script executable
chmod +x scripts/backup-db.sh

# Add to crontab for daily backups at 3 AM
(crontab -l 2>/dev/null; echo "0 3 * * * cd /app && ./scripts/backup-db.sh") | crontab -
```

### 5.2 Manual Backup

```bash
cd /app
./scripts/backup-db.sh
```

Backups are stored in `/app/backups/` with timestamps.

### 5.3 Restore from Backup

```bash
cd /app
./scripts/restore-db.sh /app/backups/payload.db.YYYY-MM-DD.sql
```

### 5.4 Backup Best Practices

- Keep at least 7 daily backups
- Download backups to local storage weekly
- Test restore procedure monthly

---

## 6. Monitoring & Maintenance

### 6.1 Useful Commands

```bash
# View application logs
docker compose logs -f app

# Check container status
docker ps -a

# Check memory usage
free -m

# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Restart application
docker compose restart

# Stop application
docker compose down

# Start application
docker compose up -d
```

### 6.2 Log Rotation

Prevent logs from filling up disk:

```bash
nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
systemctl restart docker
```

### 6.3 Automatic Security Updates

```bash
# Install unattended-upgrades
apt install -y unattended-upgrades

# Enable automatic security updates
dpkg-reconfigure -plow unattended-upgrades
```

### 6.4 Update Application

When you push new code:

```bash
cd /app

# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build

# Clean up old images
docker image prune -f
```

### 6.5 Resource Monitoring

```bash
# Install htop for real-time monitoring
apt install -y htop

# Monitor Docker container resources
docker stats
```

---

## 7. Troubleshooting

### Issue: Container Crashes During Build

**Symptom:** `Killed` or `OOMKilled` error

**Solution:**
```bash
# Verify swap is active
free -m

# If swap is 0, re-enable it
swapon /swapfile

# Rebuild
docker compose up -d --build
```

### Issue: Database Locked Errors

**Symptom:** `SQLITE_BUSY` or `database is locked`

**Solution:**
```bash
# Stop container
docker compose down

# Remove WAL files (safe, they're temporary)
rm -f payload.db-wal payload.db-shm

# Start container
docker compose up -d
```

### Issue: Port 3000 Already in Use

**Symptom:** `Address already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Issue: SSL Certificate Failed

**Symptom:** Certbot fails to obtain certificate

**Solution:**
```bash
# Check DNS propagation
dig yourdomain.com

# Verify port 80 is open
ufw status

# Try manual renewal
certbot renew --dry-run
```

### Issue: High Memory Usage

**Symptom:** Server becomes unresponsive

**Solution:**
```bash
# Add more swap (4GB instead of 2GB)
swapoff /swapfile
fallocate -l 4G /swapfile
mkswap /swapfile
swapon /swapfile

# Or upgrade to $12/mo plan (2GB RAM)
```

### Issue: Media Files Not Persisting

**Symptom:** Uploaded images disappear after restart

**Solution:**
```bash
# Verify volume mount in docker-compose.yml
# Should have: - ./public/media:/app/public/media

# Check directory permissions
chmod -R 755 /app/public/media
chown -R 1001:1001 /app/public/media
```

---

## 📞 Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Payload CMS Docs:** https://payloadcms.com/docs
- **Docker Docs:** https://docs.docker.com
- **DigitalOcean Community:** https://digitalocean.com/community

---

## 🎯 Quick Reference Card

```bash
# Deploy/Redeploy
cd /app && docker compose up -d --build

# View Logs
docker compose logs -f app

# Backup Database
./scripts/backup-db.sh

# Check Resources
free -m && df -h && docker stats --no-stream

# Emergency Restart
docker compose restart

# Update Application
git pull && docker compose up -d --build && docker image prune -f
```

---

**Last Updated:** March 2026  
**Version:** 1.0.0
