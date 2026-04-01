# 🦅 Eagle E-Commerce - $12/mo DigitalOcean Deployment Summary

**Your Configuration:** DigitalOcean $12/mo (4GB RAM / 2 vCPU / 25GB NVMe)

---

## 📊 What's Been Updated

### Files Modified for 4GB RAM

| File | Changes |
|------|---------|
| `docker-compose.yml` | Memory limit: 3G (was 6G), CPU: 1.5 (was 2.0), NODE_OPTIONS: 2048MB (was 4096MB) |
| `DEPLOYMENT_DO24.md` | Updated all specs, build times, and benchmarks for $12/mo tier |
| `scripts/quick-deploy.sh` | Smart detection for 4GB RAM, 1GB swap recommendation |
| `scripts/deploy.sh` | Updated tier detection messages |
| `scripts/setup-server.sh` | Optimized swap configuration for 4GB RAM |

---

## 🚀 Quick Deploy Steps

### Step 1: SSH Into Your Server

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 2: Run the Quick Deploy Script

```bash
cd /app
./scripts/quick-deploy.sh --skip-ssl
```

Or with domain/SSL:

```bash
./scripts/quick-deploy.sh --domain yourdomain.com --email your@email.com
```

**Build time:** 6-10 minutes on your 4GB RAM server.

---

## ⚙️ Configuration for 4GB RAM

### docker-compose.yml Settings

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=2048  # 2GB for Node.js

deploy:
  resources:
    limits:
      memory: 3G    # Max 3GB for container
      cpus: '1.5'   # Use up to 1.5 of 2 CPUs
    reservations:
      memory: 1G    # Guaranteed 1GB
      cpus: '0.5'   # Guaranteed 0.5 CPU
```

### Swap Configuration (Recommended)

```bash
# 1GB swap as safety net
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 📈 Expected Performance

| Metric | Your $12/mo Server |
|--------|-------------------|
| **Build Time** | 6-10 minutes |
| **Cold Start** | 10-15 seconds |
| **API Response** | < 150ms |
| **Page Load** | < 1.5s |
| **Concurrent Users** | 200-400 |
| **Memory Usage (idle)** | 1.5-2.5GB |
| **CPU Usage (idle)** | 10-25% |

---

## 💰 Monthly Cost Breakdown

| Item | Cost |
|------|------|
| DigitalOcean Droplet | $12.00 |
| Automated Backups (20%) | +$2.40 |
| Domain (amortized) | ~$1.25 |
| **Total** | **~$15.65/mo** |

---

## 🔧 Key Commands

### Deploy/Redeploy
```bash
cd /app && docker compose up -d --build
```

### View Logs
```bash
docker compose logs -f app
```

### Check Resources
```bash
# Memory (should show 1.5-2.5GB free)
free -h

# Disk space (25GB total)
df -h

# Container stats
docker stats
```

### Backup Database
```bash
cd /app && ./scripts/backup-db.sh
```

### Update Application
```bash
cd /app
git pull
docker compose up -d --build
```

---

## ⚠️ Important Notes for 25GB Storage

### Monitor Disk Usage

With 25GB SSD, keep an eye on disk space:

```bash
# Check disk usage weekly
df -h

# Find large files
ncdu /

# Clean old Docker data monthly
docker system prune -a

# Clean old logs
journalctl --vacuum-time=7d
```

### Recommended Storage Allocation

| Usage | Size |
|-------|------|
| OS & System | ~3GB |
| Docker & App | ~2GB |
| Database | ~1GB |
| Media Files | ~5-10GB |
| Backups (7 days) | ~2-5GB |
| **Free Space** | **~5GB+** |

### When Disk Gets Full

```bash
# 1. Remove old Docker images
docker image prune -a

# 2. Remove old backups (keep last 7)
cd /app/backups
ls -t payload.db.*.sql.gz | tail -n +8 | xargs rm -f

# 3. Clean system logs
journalctl --vacuum-size=100M

# 4. Check for large files
find / -type -f -size +100M -exec ls -lh {} \;
```

---

## 🛡️ Optimization Tips for 4GB RAM

### 1. Enable Swap (If Not Already Done)

```bash
# Check if swap exists
free -h

# If 0, create 1GB swap
fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 2. Build Locally (Save Server Resources)

```bash
# On your LOCAL machine
cd /home/nuru/Eagle
docker build -t eagle-app:latest .
docker save eagle-app:latest | gzip > eagle-app.tar.gz

# Transfer to server
scp eagle-app.tar.gz root@YOUR_DROPLET_IP:~/

# On server
docker load < eagle-app.tar.gz
cd /app
docker compose up -d
```

**Benefit:** Zero build load on server, instant deployment.

### 3. Monitor Memory During Build

```bash
# Watch memory during build
watch -n 1 'free -h'

# In another terminal, build
docker compose up -d --build
```

If memory gets too low (< 200MB), the build will slow down due to swap.

### 4. Set Up Memory Alerts

DigitalOcean → Monitoring → Alerts:
- Memory > 80% for 5 minutes
- Disk > 80%
- CPU > 80% for 5 minutes

---

## 📋 Deployment Checklist

- [ ] SSH key uploaded to DigitalOcean
- [ ] $12/mo droplet created (4GB RAM / 2 vCPU / 25GB)
- [ ] Backups enabled (+$2.40/mo)
- [ ] SSH into server successful
- [ ] Swap configured (1GB)
- [ ] Docker installed
- [ ] Repository cloned to /app
- [ ] .env configured with:
  - [ ] PAYLOAD_SECRET (generated)
  - [ ] PAYSTACK keys
  - [ ] RESEND_API_KEY
  - [ ] NODE_OPTIONS=--max-old-space-size=2048
- [ ] Build completed (6-10 min)
- [ ] Application accessible via IP
- [ ] DNS configured (if using domain)
- [ ] SSL certificate installed (if using domain)
- [ ] Automated backups scheduled
- [ ] Monitoring alerts configured

---

## 🔧 Troubleshooting

### Build Fails or Hangs

**Symptoms:** Build stops at 80-90%, or shows "Killed"

**Solution:**
```bash
# 1. Check memory
free -h

# 2. If < 200MB free, enable swap
fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile

# 3. Try building locally instead
# (See "Build Locally" section above)
```

### "No Space Left on Device"

**Solution:**
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a

# Remove old backups
cd /app/backups && ls -t *.gz | tail -n +8 | xargs rm -f

# Find large files
ncdu /
```

### Application Slow or Unresponsive

**Solution:**
```bash
# Check resources
docker stats
free -h

# Restart application
docker compose restart

# Check logs for errors
docker compose logs --tail=100 app
```

---

## 📞 Support Resources

- **Full Guide:** `DEPLOYMENT_DO24.md`
- **Step-by-Step:** `DEPLOYMENT_STEPS_DO24.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST_DO24.md`
- **DigitalOcean Docs:** https://docs.digitalocean.com
- **Payload CMS Docs:** https://payloadcms.com/docs

---

## 🎯 Next Steps After Deployment

1. **Create Admin User:** Visit `/admin`
2. **Test Checkout:** Use Paystack test mode
3. **Test Email:** Send a test email via Resend
4. **Set Up Monitoring:** DigitalOcean alerts + UptimeRobot
5. **Configure Backups:** `crontab -e` → `0 3 * * * cd /app && ./scripts/backup-db.sh`
6. **Download First Backup:** `scp root@YOUR_IP:/app/backups/*.sql.gz ~/backups/`

---

**Last Updated:** April 2026
**Version:** 2.1.0 (Optimized for $12/mo - 4GB RAM / 25GB SSD)
