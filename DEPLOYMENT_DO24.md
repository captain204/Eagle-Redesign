# 🦅 Eagle E-Commerce - Temporary $24/mo Deployment Guide

**Strategy:** Deploy on $24/mo (8GB RAM) for fast build → Resize to $6/mo (1GB RAM) for running

> **💡 Why This Approach?** Build once on powerful hardware (3-5 min), then run on affordable $6/mo droplet. Perfect for low-traffic sites that don't need constant high performance.

---

## 📋 Overview

| Phase | Droplet | RAM | Build Time | Cost |
|-------|---------|-----|------------|------|
| **Deployment** | $24/mo | 8GB | 3-5 min | $0.36/hr |
| **Production** | $6/mo | 1GB | N/A | $0.009/hr |

**Total Deployment Cost:** ~$1-2 (one-time for build time)
**Ongoing Cost:** $6/mo + backups = ~$7.20/mo

---

## 🚀 Quick Steps

### Phase 1: Deploy on $24/mo (3-5 minutes)

1. **Resize UP to $24/mo** in DigitalOcean dashboard
2. **Wait 2 minutes** for resize to complete
3. **Deploy application:**
   ```bash
   ssh root@YOUR_DROPLET_IP
   cd /app
   docker compose up -d --build
   ```
4. **Verify deployment:**
   ```bash
   docker ps
   curl http://localhost:3000/health
   ```

### Phase 2: Resize DOWN to $6/mo

1. **Stop the application:**
   ```bash
   cd /app
   docker compose down
   ```

2. **Enable swap (CRITICAL for 1GB RAM):**
   ```bash
   fallocate -l 4G /swapfile
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```

3. **Resize DOWN to $6/mo** in DigitalOcean dashboard

4. **After resize completes, start application:**
   ```bash
   cd /app
   docker compose up -d
   ```

---

## 📊 Detailed Steps

### Step 1: Resize to $24/mo (Before Deployment)

1. Go to DigitalOcean dashboard
2. Select your droplet
3. Click **Resize**
4. Choose: **$24/mo (8GB RAM / 4 vCPU / 160GB NVMe)**
5. Click **Resize**
6. Wait 2-3 minutes for completion
7. SSH in and verify:
   ```bash
   free -h  # Should show ~8GB
   ```

### Step 2: Deploy Application

#### Option A: Build on Server (Fast with 8GB RAM)

```bash
ssh root@YOUR_DROPLET_IP
cd /app

# Pull latest code
git pull

# Build and deploy
docker compose up -d --build
```

**Build time:** 3-5 minutes

#### Option B: Build Locally (Even Faster)

```bash
# On LOCAL machine
cd /home/nuru/Eagle
docker build -t eagle-app:latest .
docker save eagle-app:latest | gzip > eagle-app.tar.gz

# Transfer to server
scp eagle-app.tar.gz root@YOUR_DROPLET_IP:~/

# On server
ssh root@YOUR_DROPLET_IP
docker load < eagle-app.tar.gz
cd /app
docker compose up -d
```

**Deploy time:** 2-3 minutes

### Step 3: Verify Deployment

```bash
# Check container status
docker ps

# Check memory (should show ~6-8GB free on $24 droplet)
free -h

# Test health endpoint
curl http://localhost:3000/health

# View logs
docker compose logs -f app
```

Visit `http://YOUR_DROPLET_IP:3000` - should be working!

### Step 4: Prepare for Resize DOWN

Before resizing to $6/mo, you MUST enable large swap:

```bash
# Stop application
cd /app
docker compose down

# Create 4GB swap (CRITICAL for 1GB RAM)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verify swap
free -h  # Should show ~4GB swap
```

### Step 5: Resize to $6/mo

1. In DigitalOcean dashboard, select droplet
2. Click **Resize**
3. Choose: **$6/mo (1GB RAM / 1 vCPU / 25GB NVMe)**
4. Click **Resize**
5. Wait 2-3 minutes for completion

> ⚠️ **Important:** Droplet will reboot during resize. This is normal.

### Step 6: Start Application on $6/mo

After resize completes:

```bash
# SSH back in
ssh root@YOUR_DROPLET_IP

# Verify swap is active (CRITICAL)
free -h  # Should show ~4GB swap, ~1GB RAM

# Start application
cd /app
docker compose up -d

# Check status
docker ps
docker compose logs -f app
```

---

## ⚙️ Configuration for Each Phase

### docker-compose.yml - For $24/mo (During Build)

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096  # 4GB during build

deploy:
  resources:
    limits:
      memory: 6G    # Can use more during build
      cpus: '2.0'
```

### docker-compose.yml - For $6/mo (After Resize)

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=512  # 512MB for 1GB RAM

deploy:
  resources:
    limits:
      memory: 768M    # Leave room for OS
      cpus: '0.75'    # 1 CPU available
    reservations:
      memory: 256M
      cpus: '0.25'
```

### Quick Switch Script

Create `/app/resize-config.sh`:

```bash
#!/bin/bash

TOTAL_RAM=$(free -g | awk 'NR==2 {print $2}')

if [ "$TOTAL_RAM" -ge 8 ]; then
    echo "Configuring for $24/mo (8GB RAM)..."
    sed -i 's/NODE_OPTIONS=.*/NODE_OPTIONS=--max-old-space-size=4096/' /app/.env
    sed -i 's/memory: [0-9]*G/memory: 6G/' /app/docker-compose.yml
    sed -i "s/cpus: '[0-9.]*'/cpus: '2.0'/" /app/docker-compose.yml
else
    echo "Configuring for $6/mo (1GB RAM)..."
    sed -i 's/NODE_OPTIONS=.*/NODE_OPTIONS=--max-old-space-size=512/' /app/.env
    sed -i 's/memory: [0-9]*G/memory: 768M/' /app/docker-compose.yml
    sed -i "s/cpus: '[0-9.]*'/cpus: '0.75'/" /app/docker-compose.yml
fi

echo "Configuration updated. Rebuild with: docker compose up -d --build"
```

Usage:
```bash
# After resizing to $24/mo
./resize-config.sh
docker compose up -d --build

# After resizing to $6/mo
./resize-config.sh
docker compose up -d --build
```

---

## 📊 Performance Comparison

| Metric | $24/mo (Build) | $6/mo (Run) |
|--------|----------------|-------------|
| **RAM** | 8GB | 1GB (+4GB swap) |
| **vCPU** | 4 | 1 |
| **Build Time** | 3-5 min | 19+ min |
| **API Response** | < 100ms | < 200ms |
| **Concurrent Users** | 500-1000 | 20-50 |
| **Best For** | Building | Low-traffic running |

---

## 💰 Cost Breakdown

### One-Time Deployment Cost

| Item | Cost |
|------|------|
| $24/mo for 1 hour | $0.36 |
| Build time (5 min) | ~$0.03 |
| **Total** | **~$0.50** |

### Ongoing Monthly Cost

| Item | Cost |
|------|------|
| $6/mo Droplet | $6.00 |
| Backups (20%) | +$1.20 |
| Domain (amortized) | ~$1.25 |
| **Total** | **~$8.45/mo** |

### Savings vs Staying on $24/mo

| Period | $24/mo Plan | $6/mo Plan | Savings |
|--------|-------------|------------|---------|
| 1 month | $28.80 | $8.45 | $20.35 |
| 6 months | $172.80 | $50.70 | $122.10 |
| 1 year | $345.60 | $101.40 | $244.20 |

---

## ⚠️ Important Warnings

### 1. Swap is CRITICAL on $6/mo

Without 4GB swap, the build will fail with OOM (Out Of Memory):

```bash
# Verify swap is active
free -h

# Should show:
#               total        used        free      shared  buff/cache   available
# Mem:           983Mi       800Mi       100Mi       10Mi       83Mi       150Mi
# Swap:         4095Mi         0Mi      4095Mi
```

### 2. Never Build on $6/mo

Building on 1GB RAM will:
- Take 19+ minutes (vs 3-5 min)
- Likely fail with OOM error
- Make server unresponsive

**Always build on $24/mo, then resize down.**

### 3. Application Will Be Slower on $6/mo

Expected on $6/mo:
- API response: 150-250ms (vs <100ms)
- Page load: 2-4s (vs <1s)
- Concurrent users: 20-50 (vs 500+)

This is normal for the price point.

### 4. Monitor Memory Closely

On $6/mo, check regularly:

```bash
# Check memory
free -h

# Check swap usage
swapon --show

# If swap is > 50% used, consider upgrading
```

---

## 🔧 Troubleshooting

### Issue: Build Fails After Resize to $6/mo

**Symptom:** `Killed` or `OOMKilled` error

**Solution:**
```bash
# 1. Verify swap is active
free -h

# 2. If swap is 0, re-enable it
swapon /swapfile

# 3. Resize back to $24/mo for build
# Then resize down after build completes
```

### Issue: Application Slow After Resize

**Symptom:** High latency, timeouts

**Solution:**
```bash
# Check memory pressure
free -h
swapon --show

# If swap is heavily used, consider:
# 1. Upgrading to $12/mo (4GB RAM)
# 2. Or optimize application:
docker compose down
# Edit docker-compose.yml, reduce memory limits
docker compose up -d
```

### Issue: Can't Resize Droplet

**Symptom:** Resize button is grayed out

**Solution:**
1. Shut down droplet: `shutdown now`
2. Wait for droplet to show as "Off"
3. Try resize again
4. Power on from DigitalOcean dashboard

---

## 📋 Complete Checklist

### Before Deployment

- [ ] DigitalOcean account set up
- [ ] SSH key uploaded
- [ ] Domain DNS ready (if using)
- [ ] API keys ready (Paystack, Resend)
- [ ] Local Docker installed (for local build option)

### Phase 1: Deploy on $24/mo

- [ ] Resize droplet to $24/mo
- [ ] Wait for resize to complete
- [ ] SSH into server
- [ ] Verify RAM: `free -h` (should show 8GB)
- [ ] Clone/pull code
- [ ] Configure .env
- [ ] Build and deploy: `docker compose up -d --build`
- [ ] Verify application works
- [ ] Test all features

### Phase 2: Prepare for Resize Down

- [ ] Stop application: `docker compose down`
- [ ] Create 4GB swap
- [ ] Verify swap active: `free -h`
- [ ] Update docker-compose.yml for $6/mo limits
- [ ] Resize droplet to $6/mo
- [ ] Wait for resize to complete

### Phase 3: Start on $6/mo

- [ ] SSH into server
- [ ] Verify swap: `free -h` (should show 4GB swap)
- [ ] Start application: `docker compose up -d`
- [ ] Check container status: `docker ps`
- [ ] Test application
- [ ] Set up monitoring alerts

### Ongoing Maintenance

- [ ] Monitor memory weekly: `free -h`
- [ ] Check swap usage: `swapon --show`
- [ ] Review logs: `docker compose logs --tail=100`
- [ ] Test backups monthly
- [ ] Consider upgrade if traffic grows

---

## 🎯 When to Stay on $24/mo

Consider staying on $24/mo if:

- ✅ You have > 100 daily visitors
- ✅ You need fast API responses (<100ms)
- ✅ You deploy frequently (multiple times/day)
- ✅ You run background jobs or workers
- ✅ You have large media library

## 🎯 When to Resize to $6/mo

Resize to $6/mo if:

- ✅ Low traffic (< 50 visitors/day)
- ✅ Mostly static content
- ✅ Rare deployments (weekly/monthly)
- ✅ Cost is primary concern
- ✅ Testing/MVP phase

---

## 📞 Quick Reference Commands

```bash
# === During Deployment ($24/mo) ===
free -h  # Verify 8GB RAM
docker compose up -d --build
docker ps

# === Before Resize Down ===
docker compose down
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h  # Verify 4GB swap

# === After Resize to $6/mo ===
free -h  # Verify 1GB RAM + 4GB swap
docker compose up -d
docker stats

# === Monitoring ===
free -h
swapon --show
docker stats
df -h
```

---

## 📞 Support & Resources

- **DigitalOcean Resize Guide:** https://docs.digitalocean.com/products/droplets/how-to/resize/
- **Swap Configuration:** https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-22-04
- **Payload CMS Docs:** https://payloadcms.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** April 2026
**Version:** 3.0.0 (Temporary $24 → $6 strategy)
