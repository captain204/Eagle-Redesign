# 🦅 Eagle E-Commerce - $24/mo DigitalOcean Deployment Checklist

**Droplet:** $24/mo (8GB RAM / 4 vCPU / 160GB NVMe)
**Date:** _______________
**Deployed By:** _______________

---

## Pre-Deployment

### 1. DigitalOcean Account Setup
- [ ] DigitalOcean account created
- [ ] Payment method added
- [ ] SSH key uploaded to DigitalOcean

### 2. Domain Configuration
- [ ] Domain purchased
- [ ] DNS records ready to configure

### 3. Third-Party Services
- [ ] Resend account created (email service)
- [ ] Resend API key obtained
- [ ] Paystack account created (payment gateway)
- [ ] Paystack live keys obtained
- [ ] Payload CMS secret generated (`openssl rand -hex 32`)

### 4. Code Repository
- [ ] Code pushed to GitHub/GitLab
- [ ] `.env` values prepared (never commit real values!)
- [ ] Docker Hub account created (for image registry)

---

## Server Setup

### 1. Create Droplet
- [ ] Logged into DigitalOcean
- [ ] Created droplet: **$24/mo (8GB RAM / 4 vCPU / 160GB NVMe)**
- [ ] Region selected (closest to customers)
- [ ] Image: Ubuntu 24.04 LTS x64
- [ ] SSH key added
- [ ] Backups enabled (recommended, +$4.80/mo)
- [ ] Droplet named: `eagle-production`
- [ ] IP address noted: ___________________

### 2. Initial Server Configuration
- [ ] SSH into server: `ssh root@YOUR_DROPLET_IP`
- [ ] System updated: `apt update && apt upgrade -y`
- [ ] Docker installed: `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`
- [ ] Docker Compose installed: `apt install -y docker-compose-plugin`
- [ ] Firewall configured:
  - [ ] `ufw allow 22/tcp`
  - [ ] `ufw allow 80/tcp`
  - [ ] `ufw allow 443/tcp`
  - [ ] `ufw enable`

### 3. Memory Configuration
- [ ] Verified RAM: `free -g` (should show 8GB)
- [ ] Swap configured (512MB safety net):
  ```bash
  fallocate -l 512M /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ```

### 4. Application Setup
- [ ] Created `/app` directory
- [ ] Cloned repository: `git clone https://github.com/YOUR_USERNAME/eagle.git /app`
- [ ] Changed to app directory: `cd /app`
- [ ] Copied environment file: `cp .env.example .env`
- [ ] Edited `.env` with production values:
  - [ ] `PAYLOAD_SECRET` (generated secret)
  - [ ] `DATABASE_URI=file:./payload.db`
  - [ ] `NEXT_PUBLIC_SERVER_URL=https://yourdomain.com`
  - [ ] `PAYSTACK_SECRET_KEY=sk_live_xxxxx`
  - [ ] `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx`
  - [ ] `RESEND_API_KEY=re_xxxxx`
  - [ ] `NODE_OPTIONS=--max-old-space-size=4096`

---

## Deployment

### 1. Build and Deploy (Choose One Method)

#### Method A: Build Locally (Recommended)
- [ ] Built Docker image locally: `docker build -t yourusername/eagle-app:latest .`
- [ ] Saved image: `docker save eagle-app:latest | gzip > eagle-app.tar.gz`
- [ ] Transferred to server: `scp eagle-app.tar.gz root@YOUR_DROPLET_IP:~/`
- [ ] Loaded on server: `docker load < eagle-app.tar.gz`
- [ ] Started application: `docker compose up -d`

#### Method B: Build on Server (Fast with 8GB RAM)
- [ ] Started build: `docker compose up -d --build`
- [ ] Monitored build progress: `docker compose logs -f`
- [ ] Build completed successfully (3-5 minutes)

### 2. Verify Deployment
- [ ] Container running: `docker ps`
- [ ] Memory usage checked: `free -h` (should show 4-6GB free)
- [ ] Health endpoint responds: `curl http://localhost:3000/health`
- [ ] Application accessible via IP: `http://YOUR_DROPLET_IP:3000`

---

## Domain & SSL

### 1. DNS Configuration
- [ ] DNS A record created: `@` → `YOUR_DROPLET_IP`
- [ ] DNS A record created: `www` → `YOUR_DROPLET_IP`
- [ ] DNS propagation verified: `ping yourdomain.com`

### 2. Nginx & SSL Setup
- [ ] Nginx installed: `apt install -y nginx certbot python3-certbot-nginx`
- [ ] Nginx config created: `/etc/nginx/sites-available/eagle`
- [ ] Site enabled: `ln -s /etc/nginx/sites-available/eagle /etc/nginx/sites-enabled/`
- [ ] Default site removed: `rm -f /etc/nginx/sites-enabled/default`
- [ ] Nginx config tested: `nginx -t`
- [ ] Nginx restarted: `systemctl restart nginx`

### 3. SSL Certificate
- [ ] SSL obtained: `certbot --nginx -d yourdomain.com -d www.yourdomain.com --redirect`
- [ ] HTTPS verified: `https://yourdomain.com`
- [ ] HTTP→HTTPS redirect working
- [ ] `.env` updated: `NEXT_PUBLIC_SERVER_URL=https://yourdomain.com`
- [ ] Application rebuilt: `docker compose up -d --build`

---

## Database & Backups

### 1. Database Initialization
- [ ] Database file created: `payload.db`
- [ ] Admin user created via `/admin` interface
- [ ] Test product/category created

### 2. Backup Configuration
- [ ] Backup script executable: `chmod +x scripts/backup-db.sh`
- [ ] Manual backup tested: `./scripts/backup-db.sh`
- [ ] Cron job scheduled:
  ```bash
  (crontab -l 2>/dev/null; echo "0 3 * * * cd /app && ./scripts/backup-db.sh") | crontab -
  ```
- [ ] Backup directory created: `/app/backups`

### 3. Backup Verification
- [ ] Backup file created with timestamp
- [ ] Backup compressed (.gz)
- [ ] Old backups cleaned up (keeps last 7)
- [ ] Backup downloaded locally for safekeeping

---

## Monitoring & Optimization

### 1. Monitoring Tools
- [ ] htop installed: `apt install -y htop`
- [ ] Real-time stats checked: `docker stats`
- [ ] Memory usage verified: `free -h`
- [ ] Disk usage checked: `df -h`

### 2. Log Configuration
- [ ] Docker log rotation configured in `docker-compose.yml`:
  - `max-size: 50m`
  - `max-file: 5`
- [ ] Application logs accessible: `docker compose logs -f app`

### 3. Performance Optimization
- [ ] Nginx worker processes tuned
- [ ] Gzip compression enabled
- [ ] Static asset caching configured
- [ ] Rate limiting configured

### 4. Uptime Monitoring
- [ ] DigitalOcean monitoring alerts configured OR
- [ ] UptimeRobot monitor created (free tier)
- [ ] Email/SMS alerts configured

---

## CI/CD (Optional)

### 1. GitHub Actions Setup
- [ ] SSH key generated on server: `ssh-keygen -t ed25519`
- [ ] Public key added to GitHub Deploy Keys
- [ ] Private key added to GitHub Secrets: `SERVER_SSH_KEY`
- [ ] Server IP added to GitHub Secrets: `SERVER_HOST`
- [ ] Docker Hub credentials added to GitHub Secrets:
  - `DOCKER_HUB_USERNAME`
  - `DOCKER_HUB_TOKEN`
- [ ] Workflow file created: `.github/workflows/deploy.yml`
- [ ] Test deployment triggered via push to `main`
- [ ] Deployment successful via GitHub Actions

---

## Security Hardening

### 1. Firewall & Access
- [ ] UFW enabled and configured
- [ ] SSH key-only authentication (password disabled)
- [ ] Fail2ban installed (optional): `apt install -y fail2ban`

### 2. Automatic Updates
- [ ] Unattended upgrades enabled:
  ```bash
  apt install -y unattended-upgrades
  dpkg-reconfigure -plow unattended-upgrades
  ```

### 3. Docker Security
- [ ] Running as non-root user (where possible)
- [ ] `no-new-privileges` security option enabled
- [ ] Resource limits configured in docker-compose.yml

### 4. SSL/TLS
- [ ] HTTPS enforced
- [ ] SSL certificate auto-renewal configured: `certbot renew --dry-run`
- [ ] HSTS header enabled (optional, via Nginx config)

---

## Final Verification

### 1. Application Testing
- [ ] Homepage loads correctly
- [ ] Admin panel accessible (`/admin`)
- [ ] Product pages load
- [ ] Search functionality works
- [ ] Cart functionality works
- [ ] Checkout process tested (test mode)
- [ ] Email notifications working (Resend)
- [ ] Payment integration working (Paystack test mode)

### 2. Performance Testing
- [ ] Page load time < 2 seconds
- [ ] API response time < 200ms
- [ ] No memory leaks (monitor over 1 hour)
- [ ] CPU usage normal (< 20% idle)

### 3. Error Handling
- [ ] 404 page displays correctly
- [ ] Error pages customized
- [ ] Error logging working
- [ ] No sensitive data in error messages

---

## Post-Deployment

### 1. Documentation
- [ ] Server credentials documented (securely)
- [ ] Database backup location documented
- [ ] Third-party service credentials documented
- [ ] Deployment process documented for team

### 2. Handover
- [ ] Team notified of deployment
- [ ] Admin credentials shared securely
- [ ] Monitoring dashboard shared
- [ ] Support contact established

### 3. Ongoing Maintenance Plan
- [ ] Daily backups verified (automated)
- [ ] Weekly security updates reviewed
- [ ] Monthly performance review scheduled
- [ ] Quarterly disaster recovery test planned

---

## Rollback Plan

If deployment fails:

1. **Stop current deployment:**
   ```bash
   docker compose down
   ```

2. **Restore previous database backup:**
   ```bash
   gunzip -c /app/backups/payload.db.PREVIOUS.sql.gz | sqlite3 /app/payload.db
   ```

3. **Deploy previous known-good image:**
   ```bash
   docker pull yourusername/eagle-app:previous-tag
   docker compose up -d
   ```

4. **Verify rollback:**
   - [ ] Application accessible
   - [ ] Database intact
   - [ ] No data loss

---

## Cost Summary

| Item | Cost (USD/mo) |
|------|---------------|
| DigitalOcean Droplet ($24 tier) | $24.00 |
| Automated Backups (20%) | +$4.80 |
| Domain Name (annual / 12) | ~$1.25 |
| Resend (Free tier) | $0.00 |
| Paystack (Transaction fees only) | $0.00 |
| **Total** | **~$30.05/mo** |

---

## Support Contacts

- **DigitalOcean Support:** https://cloud.digitalocean.com/support
- **Resend Support:** https://resend.com/support
- **Paystack Support:** https://paystack.com/help
- **Payload CMS Docs:** https://payloadcms.com/docs

---

**Deployment Completed:** ___ / ___ / 20___

**Signed:** _______________________

**Notes:**
_________________________________
_________________________________
_________________________________
