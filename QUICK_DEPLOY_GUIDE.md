# 🦅 Eagle Deployment - $24 → $6 Resize Strategy

**Your Approach:** Build on $24/mo (fast) → Run on $6/mo (cheap)

---

## 🚀 Quick Deploy Checklist

### Phase 1: Build on $24/mo

```bash
# 1. Resize UP in DigitalOcean dashboard
#    $24/mo (8GB RAM / 4 vCPU)

# 2. Wait 2 minutes for resize to complete

# 3. Verify RAM
ssh root@YOUR_DROPLET_IP
free -h  # Should show ~8GB

# 4. Deploy
cd /app
docker compose up -d --build

# 5. Verify (3-5 min build)
docker ps
curl http://localhost:3000/health
```

### Phase 2: Resize DOWN to $6/mo

```bash
# 1. Stop application
cd /app
docker compose down

# 2. Create 4GB swap (CRITICAL!)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 3. Verify swap
free -h  # Should show ~4GB swap

# 4. Resize DOWN in DigitalOcean dashboard
#    $6/mo (1GB RAM / 1 vCPU)

# 5. Wait 2 minutes for resize

# 6. Start application
ssh root@YOUR_DROPLET_IP
cd /app
docker compose up -d

# 7. Verify
docker ps
docker stats  # Memory should be < 768M
```

---

## 💰 Cost Comparison

| Strategy | Monthly Cost | Build Time |
|----------|--------------|------------|
| **Your Strategy** | $6 + backup = ~$7.20 | 3-5 min (one-time) |
| Stay on $24/mo | $24 + backup = ~$28.80 | 3-5 min |
| Build on $6/mo | $6 + backup = ~$7.20 | 19+ min (every time) |

**Your Savings:** ~$21.60/month vs staying on $24/mo

---

## ⚙️ Configuration Settings

### For $24/mo (During Build)
```bash
NODE_OPTIONS=--max-old-space-size=4096  # 4GB
Memory limit: 6G
CPU limit: 2.0
```

### For $6/mo (Production)
```bash
NODE_OPTIONS=--max-old-space-size=512  # 512MB
Memory limit: 768M
CPU limit: 0.75
Swap: 4GB (CRITICAL!)
```

---

## 🔧 Auto-Configure Script

After resizing, run:

```bash
# On $24/mo droplet
./scripts/resize-config.sh --24

# On $6/mo droplet
./scripts/resize-config.sh --6
```

Or auto-detect:
```bash
./scripts/resize-config.sh  # Auto-detects based on RAM
```

---

## ⚠️ Critical Warnings

### 1. NEVER Build on $6/mo

```bash
# ❌ WRONG - Will fail or take 19+ minutes
docker compose up -d --build  # On $6/mo

# ✅ CORRECT - Build on $24/mo, then resize down
# Build on $24/mo → Stop → Resize to $6/mo → Start
```

### 2. ALWAYS Enable Swap Before Resize Down

```bash
# Without swap, app will crash with OOM
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 3. Monitor Memory on $6/mo

```bash
# Check daily
free -h
docker stats

# If swap > 50% used, consider upgrade to $12/mo
```

---

## 📊 Performance Expectations

| Metric | $24/mo (Build) | $6/mo (Run) |
|--------|----------------|-------------|
| API Response | < 100ms | 150-300ms |
| Page Load | < 1s | 2-4s |
| Concurrent Users | 500+ | 20-50 |
| Memory Available | 6-8GB | 512-768MB |

---

## 🔍 Troubleshooting

### Build Failed with "Killed"

**Cause:** Out of memory (OOM)

**Solution:**
```bash
# Check if swap is active
free -h

# If swap = 0, enable it
swapon /swapfile

# If still failing, resize to $24/mo for build
```

### App Slow After Resize

**Cause:** Memory pressure, heavy swap usage

**Solution:**
```bash
# Check memory
free -h
docker stats

# If swap > 2GB used:
# Option 1: Upgrade to $12/mo (4GB RAM)
# Option 2: Reduce concurrent users
# Option 3: Optimize images/queries
```

### Can't Resize Droplet

**Solution:**
1. Shutdown: `shutdown now`
2. Wait for "Off" status in dashboard
3. Resize
4. Power on from dashboard

---

## 📋 Command Reference

### Resize UP to $24/mo
```bash
# DigitalOcean dashboard → Resize → $24/mo
# Wait 2 min
ssh root@IP
free -h  # Verify 8GB
./scripts/resize-config.sh --24
docker compose up -d --build
```

### Resize DOWN to $6/mo
```bash
docker compose down
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h  # Verify 4GB swap
# DigitalOcean dashboard → Resize → $6/mo
# Wait 2 min
ssh root@IP
cd /app
docker compose up -d
./scripts/resize-config.sh --6
```

### Monitoring
```bash
# Memory
free -h
swapon --show

# Container
docker stats
docker ps

# Disk
df -h

# Logs
docker compose logs --tail=50
```

---

## 🎯 When to Upgrade from $6/mo

Consider $12/mo (4GB RAM) if:

- ✅ > 100 daily visitors
- ✅ Swap constantly in use (> 500MB)
- ✅ API responses > 500ms
- ✅ Frequent OOM errors
- ✅ Building on server frequently

---

**Quick Start:** See `DEPLOYMENT_DO24.md` for full guide
