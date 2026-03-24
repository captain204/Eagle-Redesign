# Deployment Guide: 1stEagle on DigitalOcean

This guide provides every single step required to deploy your project to a \$6/month DigitalOcean Droplet.

## 1. Create the Droplet
1.  Log in to your DigitalOcean account.
2.  Click **Create** -> **Droplets**.
3.  **Region**: Choose the one closest to your customers (e.g., New York or London).
4.  **Image**: Choose **Ubuntu 24.04 LTS**.
5.  **Size**: Choose **Basic** -> **Regular** -> **\$6/mo (1GB RAM / 1 vCPU / 25GB NVMe SSD)**.
6.  **Authentication**: Select **SSH Keys** (highly recommended) or Password.
7.  **Finalize**: Name it `1steagle-server` and click **Create Droplet**.

---

## 2. Initial Server Configuration
Once the droplet is ready, copy its IP address and connect via terminal:
```bash
ssh root@198.199.120.186
```

### Enable Swap (CRITICAL for \$6 plan)
The \$6 plan has limited RAM. You **must** enable Swap to prevent the build process from crashing:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Install Docker
```bash
# Update and install Docker & Docker Compose Plugin
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

> [!TIP]
> Modern Docker uses `docker compose` (with a space) instead of `docker-compose` (with a hyphen). If you get a "command not found" error, use the space version!

---

## 3. Upload Your Project
The easiest way is using Git. If your project is on GitHub:
```bash
git clone https://github.com/your-username/eagle.git /app
cd /app
```

---

### 4. Configure Environment Variables
Copy the example environment file and fill in your real keys:
```bash
cp .env.example .env
nano .env
```
> [!TIP]
> Use arrow keys to move, type your changes, then press **CTRL+O**, **Enter**, and **CTRL+X** to save and exit nano.
**Required Variables:**
- `PAYLOAD_SECRET`: A long random string.
- `DATABASE_URI`: `file:./payload.db`
- `RESEND_API_KEY`: Your real Resend key.
- `PAYSTACK_SECRET_KEY`: Your real Paystack key.
- `NEXT_PUBLIC_SERVER_URL`: `http://198.199.120.186:3000` (or `https://yourdomain.com` later)

---

## 5. Launch the Application
Start the containerized app in detached mode:
```bash
docker compose up -d --build
```

### Access via IP (Quick Start)
To access the app immediately without a domain:
1.  **Get your IP**: Run `curl -4 icanhazip.com`.
2.  **Update .env**: In Step 4, set `NEXT_PUBLIC_SERVER_URL=http://198.199.120.186:3000`.
3.  **Open Port 3000**: Run `sudo ufw allow 3000`.
4.  **Re-deploy**: Run `docker compose up -d --build`.
5.  **Visit**: `http://198.199.120.186:3000` in your browser.

---

## 6. Domain & SSL Setup (Optional)
To make it accessible via your domain with HTTPS:

### Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/1steagle
```
Paste this configuration:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/1steagle /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Enable SSL (HTTPS)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 7. How to Update
Whenever you make changes to the code:
1. `git pull` on the server.
2. `docker compose up -d --build`.

---

## Common Commands
- **View Logs**: `docker compose logs -f`
- **Stop App**: `docker compose down`
- **Check Memory**: `free -m`
- **Check Status**: `docker ps`
