# 🦅 Eagle Deployment - Quick Start Guide

**Target:** DigitalOcean $6/mo Droplet (1GB RAM / 1 vCPU / 25GB NVMe)

---

## 🚀 5-Minute Quick Deploy

### Step 1: Create Droplet
1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. Create Droplet → **Ubuntu 24.04 LTS** → **$6/mo (1GB RAM)**
3. Add your SSH key
4. Create droplet

### Step 2: Connect & Setup Server
```bash
# Connect to your droplet
ssh root@YOUR_DROPLET_IP

# Run the setup script (auto-installs everything)
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/eagle/main/scripts/setup-server.sh | bash
```

### Step 3: Deploy Application
```bash
# Clone your repository
cd /app
git clone https://github.com/YOUR_USERNAME/eagle.git .

# Configure environment
cp .env.example .env
nano .env  # Fill in your API keys

# Deploy
./scripts/deploy.sh
```

### Step 4: Access Application
- **Frontend:** `http://YOUR_DROPLET_IP:3000`
- **Admin:** `http://YOUR_DROPLET_IP:3000/admin`

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Complete deployment guide with troubleshooting |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `docker-compose.yml` | Docker configuration (optimized for 1GB RAM) |
| `Dockerfile` | Multi-stage build with memory limits |
| `.env.example` | Environment variable template |
| `scripts/deploy.sh` | One-click deploy script |
| `scripts/backup-db.sh` | Database backup script |
| `scripts/restore-db.sh` | Database restore script |
| `scripts/pre-deploy-check.sh` | Pre-deployment validation |
| `scripts/setup-server.sh` | Server setup automation |
| `deploy/nginx.conf` | Nginx configuration template |
| `deploy/eagle.service` | Systemd service file |
| `deploy/crontab.example` | Cron job templates |
| `deploy/QUICK_REFERENCE.md` | Command cheat sheet |

---

## 🔧 Key Optimizations for 1GB RAM

### Dockerfile Optimizations
- Multi-stage build (smaller production image)
- Memory limit: 512MB for runtime, 768MB for build
- DevDependencies excluded from production
- Alpine-based minimal image

### Docker Compose Optimizations
- Memory limit: 768MB (prevents OOM)
- CPU limit: 0.75 cores (prevents 100% CPU)
- Log rotation: 10MB max, 3 files
- Health checks enabled
- Restart policy: `unless-stopped`

### Server Optimizations
- 2GB swap file (prevents build crashes)
- SQLite database (no separate DB server needed)
- Minimal packages installed

---

## 📊 What's Configured

### ✅ Production-Ready Features
- [x] Docker containerization
- [x] Memory-optimized builds
- [x] Automated backups
- [x] Health monitoring
- [x] Log rotation
- [x] SSL-ready (Nginx + Let's Encrypt)
- [x] Rate limiting
- [x] Security headers
- [x] Non-root container user
- [x] Persistent volumes (database + media)

### ✅ Automation Scripts
- [x] Server setup (`setup-server.sh`)
- [x] One-click deploy (`deploy.sh`)
- [x] Database backup (`backup-db.sh`)
- [x] Database restore (`restore-db.sh`)
- [x] Pre-deployment checks (`pre-deploy-check.sh`)

### ✅ Monitoring & Maintenance
- [x] Health check endpoint
- [x] Docker health checks
- [x] Cron job templates
- [x] Log rotation
- [x] Resource limits

---

## 🎯 Deployment Commands

### First-Time Deploy
```bash
./scripts/deploy.sh
```

### Update After Code Changes
```bash
git pull && ./scripts/deploy.sh
```

### Backup Database
```bash
./scripts/backup-db.sh
```

### View Logs
```bash
docker compose logs -f
```

### Check Resources
```bash
free -m && df -h && docker stats
```

---

## 🔒 Required API Keys

Get these before deploying:

| Service | Purpose | Get From |
|---------|---------|----------|
| **Resend** | Email sending | [resend.com](https://resend.com) |
| **Paystack** | Payment processing | [paystack.com](https://paystack.com) |

Generate locally:
```bash
# Payload secret
openssl rand -hex 32
```

---

## 🛠️ Common Issues

### Build Fails / Container Crashes
**Cause:** Out of memory  
**Fix:** Verify swap is enabled
```bash
free -m  # Should show ~2048MB swap
```

### Database Locked
**Fix:** Remove WAL files and restart
```bash
docker compose down
rm -f payload.db-wal payload.db-shm
docker compose up -d
```

### Can't Access Application
**Fix:** Check firewall and container status
```bash
ufw status
docker ps
```

---

## 📖 Full Documentation

- **Complete Guide:** `DEPLOYMENT.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Quick Reference:** `deploy/QUICK_REFERENCE.md`
- **Nginx Config:** `deploy/nginx.conf`
- **Cron Jobs:** `deploy/crontab.example`

---

## 🆘 Need Help?

### Check Logs
```bash
# Application logs
docker compose logs -f app

# Last 100 lines
docker compose logs --tail=100 app
```

### Run Pre-Deployment Check
```bash
./scripts/pre-deploy-check.sh
```

### Emergency Restart
```bash
docker compose restart
```

### Full Rebuild
```bash
docker compose down
docker compose up -d --build
```

---

## ✅ Post-Deployment Checklist

- [ ] Application loads at `http://YOUR_IP:3000`
- [ ] Admin panel accessible at `/admin`
- [ ] Database backup script works
- [ ] Logs are accessible
- [ ] SSL certificate installed (if using domain)
- [ ] HTTPS redirect working
- [ ] Payment integration tested
- [ ] Email sending tested

---

**Ready to deploy? Run:** `./scripts/deploy.sh`

**Last Updated:** March 2026
