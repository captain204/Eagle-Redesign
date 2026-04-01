# 🚀 Eagle E-Commerce - Complete $24/mo Deployment Steps

This document provides **every single step** to deploy your Eagle E-Commerce platform to a DigitalOcean $24/mo droplet.

---

## 📋 What You'll Get

- **Server:** 8GB RAM / 4 vCPU / 160GB NVMe SSD
- **Build Time:** 3-5 minutes (vs 19+ min on $6 plan)
- **Performance:** Handles 500-1000 concurrent users
- **Cost:** ~$30/mo (including backups and domain)

---

## Part 1: Pre-Deployment Preparation (15 minutes)

### Step 1: Create DigitalOcean Account

1. Go to [digitalocean.com](https://www.digitalocean.com)
2. Click **Sign Up**
3. Complete registration
4. Add payment method

### Step 2: Upload SSH Key

```bash
# On your LOCAL machine, check if you have an SSH key
ls -la ~/.ssh/id_ed25519.pub

# If it exists, copy the content
cat ~/.ssh/id_ed25519.pub

# If it doesn't exist, create one
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Copy the output (starts with `ssh-ed25519 AAAA...`)

3. In DigitalOcean dashboard:
   - Go to **Settings** → **Security** → **SSH Keys**
   - Click **Add SSH Key**
   - Paste your public key
   - Name it (e.g., "My Laptop")
   - Click **Add SSH Key**

### Step 3: Get Required API Keys

#### 3.1 Resend (Email Service)

1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Go to **API Keys**
4. Copy your API key (starts with `re_`)

#### 3.2 Paystack (Payment Gateway)

1. Go to [paystack.com](https://paystack.com)
2. Create account
3. Complete verification
4. Go to **Settings** → **API Keys & Webhooks**
5. Copy both keys:
   - **Secret Key** (starts with `sk_live_`)
   - **Public Key** (starts with `pk_live_`)

#### 3.3 Generate Payload Secret

```bash
# On your LOCAL machine
openssl rand -hex 32
```

Copy the output (64 character hex string)

### Step 4: Prepare Your Code

```bash
# On your LOCAL machine
cd /home/nuru/Eagle

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub (go to github.com/new)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/eagle.git
git push -u origin main
```

---

## Part 2: Create the Droplet (5 minutes)

### Step 1: Create the Droplet

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Click **Create** → **Droplets**
3. Configure:

| Setting | Value |
|---------|-------|
| **Region** | Closest to customers (e.g., London, New York) |
| **Image** | Ubuntu 24.04 LTS x64 |
| **Size** | Basic → Regular → **$24/mo (8GB RAM / 4 vCPU / 160GB NVMe)** |
| **SSH Key** | Select the key you uploaded |
| **Backups** | ✅ Enable (recommended, +$4.80/mo) |
| **Name** | `eagle-production` |

4. Click **Create Droplet**
5. Wait 30-60 seconds for provisioning
6. Copy the IP address (e.g., `198.199.120.186`)

---

## Part 3: Deploy Using Quick Script (10 minutes)

### Option A: One-Command Deploy (Recommended)

```bash
# On your LOCAL machine - copy this command with your values:
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/eagle/main/scripts/quick-deploy.sh | bash -s -- --domain yourdomain.com --email your@email.com

# OR if you don't have a domain yet:
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/eagle/main/scripts/quick-deploy.sh | bash -s -- --skip-ssl
```

**Wait 5-10 minutes** for the build to complete.

### Option B: Manual Step-by-Step Deploy

If you prefer full control, follow these steps:

#### Step 1: Connect to Server

```bash
ssh root@YOUR_DROPLET_IP
```

#### Step 2: Update System

```bash
apt update && apt upgrade -y
```

#### Step 3: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh
```

#### Step 4: Install Docker Compose

```bash
apt install -y docker-compose-plugin
```

#### Step 5: Verify Installation

```bash
docker --version
docker compose version
```

#### Step 6: Clone Your Repository

```bash
mkdir -p /app
cd /app
git clone https://github.com/YOUR_USERNAME/eagle.git .
```

#### Step 7: Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values:

```bash
# Replace with your generated secret
PAYLOAD_SECRET=your_generated_secret_here

# Keep this
DATABASE_URI=file:./payload.db

# For IP access (update with your actual IP)
NEXT_PUBLIC_SERVER_URL=http://YOUR_DROPLET_IP:3000

# Replace with your actual keys
PAYSTACK_SECRET_KEY=sk_live_your_actual_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_key
RESEND_API_KEY=re_your_actual_key

# Optimized for 8GB RAM
NODE_OPTIONS=--max-old-space-size=4096
NEXT_TELEMETRY_DISABLED=1
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

#### Step 8: Create Directories

```bash
mkdir -p backups logs public/media
```

#### Step 9: Build and Deploy

```bash
docker compose up -d --build
```

**Wait 3-5 minutes** for the build.

#### Step 10: Verify Deployment

```bash
# Check container status
docker ps

# View logs
docker compose logs -f app

# Check health
curl http://localhost:3000/health
```

Visit `http://YOUR_DROPLET_IP:3000` in your browser.

---

## Part 4: Domain & SSL Setup (10 minutes)

### Step 1: Configure DNS

In your domain registrar (GoDaddy, Namecheap, etc.):

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_DROPLET_IP |
| A | www | YOUR_DROPLET_IP |

Wait 5-10 minutes for propagation.

Verify:
```bash
ping yourdomain.com
# Should show YOUR_DROPLET_IP
```

### Step 2: Install Nginx & Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### Step 3: Configure Nginx

```bash
nano /etc/nginx/sites-available/eagle
```

Paste this (replace `yourdomain.com`):

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=50r/s;

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml 
               application/javascript application/json;

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
```

Save and enable:

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

### Step 4: Obtain SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email your@email.com \
  --redirect
```

### Step 5: Update Application URL

```bash
nano .env
```

Update:
```bash
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
```

Rebuild:
```bash
docker compose up -d --build
```

Visit `https://yourdomain.com` 🎉

---

## Part 5: Post-Deployment Setup (10 minutes)

### Step 1: Create Admin User

1. Go to `https://yourdomain.com/admin`
2. Click **Create Account**
3. Fill in:
   - Email
   - Password
   - Name
4. Click **Create Account**

### Step 2: Set Up Automated Backups

```bash
# Make backup script executable
chmod +x scripts/backup-db.sh

# Test backup
./scripts/backup-db.sh

# Schedule daily backups at 3 AM
(crontab -l 2>/dev/null; echo "0 3 * * * cd /app && ./scripts/backup-db.sh") | crontab -
```

### Step 3: Configure Monitoring

#### DigitalOcean Alerts

1. Go to **Manage** → **Alerts**
2. Create alert policy:
   - **Metric:** Droplet Memory
   - **Threshold:** > 80%
   - **Duration:** 5 minutes
   - **Email:** your@email.com

#### Uptime Monitoring (Optional)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create account
3. Add monitor:
   - **URL:** `https://yourdomain.com/health`
   - **Interval:** 5 minutes
   - **Alerts:** Email/SMS

### Step 4: Test Everything

- [ ] Homepage loads
- [ ] Admin panel accessible
- [ ] Products can be created
- [ ] Images can be uploaded
- [ ] Search works
- [ ] Cart works
- [ ] Checkout (test mode) works
- [ ] Email notifications work

---

## Part 6: CI/CD Setup (Optional, 15 minutes)

### Step 1: Create Docker Hub Account

1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up
3. Note your username

### Step 2: Generate Docker Hub Token

1. Go to **Account Settings** → **Security**
2. Click **New Access Token**
3. Name: `github-actions`
4. Permissions: Read & Write
5. Copy the token

### Step 3: Generate SSH Key for GitHub

```bash
# On server
ssh-keygen -t ed25519 -C "github-actions" -f /root/.ssh/github_actions

# Copy public key
cat /root/.ssh/github_actions.pub
```

Add to GitHub:
1. Go to your repo on GitHub
2. **Settings** → **Deploy keys**
3. **Add deploy key**
4. Paste public key
5. ✅ **Allow write access**
6. Click **Add key**

### Step 4: Add GitHub Secrets

In your GitHub repo:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:

| Name | Value |
|------|-------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |
| `DOCKER_HUB_TOKEN` | Your Docker Hub token |
| `DROPLET_IP` | Your droplet IP |
| `DROPLET_SSH_KEY` | Content of `/root/.ssh/github_actions` |

### Step 5: Test CI/CD

```bash
# Make a small change
echo "# Test" >> README.md
git add .
git commit -m "Test deployment"
git push origin main
```

Go to GitHub → Your repo → **Actions** tab → Watch deployment (3-5 minutes)

---

## Part 7: Ongoing Maintenance

### Daily Tasks

- [ ] Check uptime monitoring alerts
- [ ] Verify backups are running

### Weekly Tasks

```bash
# Check disk space
df -h

# Check memory
free -h

# View error logs
docker compose logs --tail=100 app | grep -i error
```

### Monthly Tasks

```bash
# Update system packages
apt update && apt upgrade -y

# Clean up old Docker data
docker system prune -a

# Test restore from backup
gunzip -c /app/backups/payload.db.*.sql.gz | sqlite3 test.db
rm test.db
```

---

## Quick Reference

### Common Commands

```bash
# View logs
docker compose logs -f app

# Restart application
docker compose restart

# Stop application
docker compose down

# Start application
docker compose up -d

# Check resources
docker stats

# Backup database
cd /app && ./scripts/backup-db.sh

# Deploy update
cd /app && git pull && docker compose up -d --build
```

### File Locations

| File | Path |
|------|------|
| Application | `/app` |
| Database | `/app/payload.db` |
| Backups | `/app/backups` |
| Media | `/app/public/media` |
| Logs | `/app/logs` |
| Nginx config | `/etc/nginx/sites-available/eagle` |

### Ports

| Service | Port |
|---------|------|
| Application | 3000 |
| HTTP | 80 |
| HTTPS | 443 |
| SSH | 22 |

---

## Troubleshooting

### Build Takes Too Long

**Expected:** 3-5 minutes on $24 droplet

If longer:
```bash
# Check resources
free -h
docker stats

# Check for issues
docker compose logs
```

### Application Won't Start

```bash
# Check logs
docker compose logs app

# Check port conflict
lsof -i :3000

# Restart
docker compose down
docker compose up -d
```

### Database Locked

```bash
# Stop app
docker compose down

# Remove WAL files
rm -f payload.db-wal payload.db-shm

# Start app
docker compose up -d
```

### SSL Certificate Issues

```bash
# Check DNS
dig yourdomain.com

# Test renewal
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal
```

---

## Cost Breakdown

| Item | Cost (USD/mo) |
|------|---------------|
| DigitalOcean Droplet ($24 tier) | $24.00 |
| Automated Backups (20%) | +$4.80 |
| Domain Name (annual / 12) | ~$1.25 |
| Resend (Free tier, 3K emails/day) | $0.00 |
| Paystack (2.9% + ₦100 per transaction) | $0.00 |
| UptimeRobot (Free tier) | $0.00 |
| **Total** | **~$30.05/mo** |

---

## Support

- **DEPLOYMENT_DO24.md** - Detailed deployment guide
- **DEPLOYMENT_CHECKLIST_DO24.md** - Step-by-step checklist
- **DigitalOcean Support** - https://cloud.digitalocean.com/support
- **Payload CMS Docs** - https://payloadcms.com/docs
- **Next.js Docs** - https://nextjs.org/docs

---

**🎉 Congratulations!** Your Eagle E-Commerce platform is now live on a production-ready $24/mo DigitalOcean droplet!
