# 🦅 Eagle Deployment Checklist

Use this checklist before, during, and after deployment to ensure a smooth deployment process.

---

## 📋 Pre-Deployment Checklist

### Environment & Configuration
- [ ] `.env` file created from `.env.example`
- [ ] `PAYLOAD_SECRET` generated (use `openssl rand -hex 32`)
- [ ] `DATABASE_URI` set to `file:./payload.db`
- [ ] `NEXT_PUBLIC_SERVER_URL` configured (domain or IP)
- [ ] Paystack keys configured (live keys for production)
- [ ] Resend API key configured
- [ ] All placeholder values replaced in `.env`

### Domain & DNS
- [ ] Domain purchased and accessible
- [ ] DNS A record pointing to droplet IP
- [ ] DNS propagation verified (`dig yourdomain.com`)
- [ ] SSL certificate ready (Let's Encrypt or other)

### Server Setup
- [ ] DigitalOcean droplet created (Ubuntu 24.04, 1GB RAM)
- [ ] SSH access configured and tested
- [ ] Swap memory enabled (2GB minimum for 1GB RAM droplet)
- [ ] Docker installed and running
- [ ] Docker Compose plugin installed
- [ ] Firewall configured (UFW: 22, 80, 443 open)
- [ ] Git installed

### Code & Repository
- [ ] Code pushed to Git repository
- [ ] `.gitignore` includes `.env`, `payload.db`, `node_modules`
- [ ] `.env` NOT committed to Git
- [ ] All scripts are executable (`chmod +x scripts/*.sh`)
- [ ] Pre-deployment check passes (`./scripts/pre-deploy-check.sh`)

### Database
- [ ] Database backup strategy in place
- [ ] Initial database schema ready
- [ ] Backup directory created (`/app/backups`)

### Security
- [ ] Strong passwords for all services
- [ ] API keys are production/live keys (not test)
- [ ] Firewall rules configured
- [ ] SSH key authentication enabled (password disabled if possible)
- [ ] Non-root user for Docker container

---

## 🚀 Deployment Steps

### 1. Server Setup
```bash
# Run as root
sudo ./scripts/setup-server.sh
```
- [ ] System updated
- [ ] Swap configured (2GB+)
- [ ] Docker installed
- [ ] Nginx installed
- [ ] Certbot installed

### 2. Application Setup
```bash
cd /app
git clone <your-repo> .
cp .env.example .env
nano .env  # Edit with real values
```
- [ ] Repository cloned
- [ ] Environment file configured

### 3. Pre-Deployment Check
```bash
./scripts/pre-deploy-check.sh
```
- [ ] All checks passed
- [ ] Warnings reviewed and accepted

### 4. Deploy Application
```bash
./scripts/deploy.sh
```
- [ ] Build completed successfully
- [ ] Container started without errors
- [ ] Application accessible at port 3000

### 5. Domain & SSL Setup
```bash
# Configure Nginx
sudo nano /etc/nginx/sites-available/eagle
sudo ln -s /etc/nginx/sites-available/eagle /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] HTTPS redirect working
- [ ] HTTP redirects to HTTPS

### 6. Update Environment
```bash
# Update NEXT_PUBLIC_SERVER_URL to HTTPS domain
nano .env
docker compose up -d --build
```
- [ ] Environment updated with HTTPS URL
- [ ] Application rebuilt

---

## ✅ Post-Deployment Verification

### Application Health
- [ ] Homepage loads (`https://yourdomain.com`)
- [ ] Admin panel accessible (`/admin`)
- [ ] API endpoints responding (`/api/`)
- [ ] Health check passing (`/health`)

### Functionality Tests
- [ ] User registration works
- [ ] Login/logout works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Payment integration (Paystack) works
- [ ] Email sending (Resend) works
- [ ] File uploads work
- [ ] Search functionality works

### Performance
- [ ] Page load time < 3 seconds
- [ ] No memory leaks (check `docker stats`)
- [ ] CPU usage normal (< 50% idle)
- [ ] Database queries fast

### Security
- [ ] HTTPS enforced
- [ ] Security headers present (use securityheaders.com)
- [ ] No sensitive data in logs
- [ ] API rate limiting working
- [ ] Admin panel not publicly indexed

### Monitoring
- [ ] Logs accessible (`docker compose logs -f`)
- [ ] Backup script tested
- [ ] Cron jobs configured (`crontab -e`)
- [ ] Health monitoring in place

---

## 📊 Ongoing Maintenance

### Daily
- [ ] Check application logs for errors
- [ ] Verify backups are running
- [ ] Monitor disk space

### Weekly
- [ ] Review error logs
- [ ] Check for security updates
- [ ] Clean up old Docker images
- [ ] Test restore from backup

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Review and rotate API keys if needed
- [ ] Database optimization (`VACUUM`)
- [ ] Review access logs for suspicious activity

### Quarterly
- [ ] Full security audit
- [ ] Performance review
- [ ] Update documentation
- [ ] Test disaster recovery

---

## 🔧 Troubleshooting Commands

### Check Application Status
```bash
docker compose ps
docker compose logs -f app
```

### Check Resources
```bash
free -m        # Memory
df -h          # Disk
docker stats   # Container resources
```

### Restart Application
```bash
docker compose restart
```

### Rebuild Application
```bash
docker compose down
docker compose up -d --build
```

### Database Backup
```bash
./scripts/backup-db.sh
```

### Database Restore
```bash
./scripts/restore-db.sh /app/backups/payload.db.TIMESTAMP.sql.gz
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/eagle_error.log
tail -f /var/log/nginx/eagle_access.log
```

### Check SSL Certificate
```bash
certbot certificates
```

### Renew SSL
```bash
certbot renew --dry-run
```

---

## 📞 Emergency Contacts

### Critical Issues
1. **Application Down**: Check `docker compose ps`, restart if needed
2. **Database Corrupted**: Restore from latest backup
3. **SSL Expired**: Run `certbot renew --force-renewal`
4. **Out of Disk**: Clean logs, old images, or resize droplet
5. **Out of Memory**: Add more swap or upgrade droplet

### Backup Locations
- **Database Backups**: `/app/backups/`
- **Application Logs**: `/app/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **Docker Logs**: `docker compose logs`

---

## 📈 Success Metrics

| Metric | Target | How to Check |
|--------|--------|--------------|
| Uptime | > 99% | Uptime monitoring service |
| Page Load | < 3s | Browser DevTools |
| Memory Usage | < 80% | `docker stats` |
| Disk Usage | < 80% | `df -h` |
| Error Rate | < 1% | Application logs |
| Backup Success | 100% | Backup logs |

---

**Last Updated:** March 2026  
**Version:** 1.0.0
