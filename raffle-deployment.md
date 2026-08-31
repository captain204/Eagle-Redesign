# 1stEagle Raffle System - Docker Deployment Guide

Since your website is deployed via Docker on DigitalOcean, it is **absolutely critical** that we mount the new `raffle.sqlite` database file as a volume. If we don't do this, every time your Docker container restarts, all your raffle data will be wiped out. 

I have already updated your `docker-compose.yml` to safely map this new database alongside your existing `payload.db`.

---

## 1. Zero-Impact Docker Deployment Steps

SSH into your DigitalOcean Droplet and navigate to your project directory. Then, strictly follow these steps:

**Step 1: Pull the latest code**
Fetch the newly written Raffle System code from your repository (which includes the updated `docker-compose.yml`).
```bash
git pull origin main
```

**Step 2: Initialize the Database File on the Host**
*CRITICAL:* Docker will crash or create a directory instead of a file if the SQLite file doesn't exist before booting. Create the empty file first:
```bash
touch raffle.sqlite
chmod 666 raffle.sqlite
```

**Step 3: Rebuild and Restart the Docker Container**
Rebuild the Docker image so it installs the new `better-sqlite3`, `exifr`, and `pdfkit` dependencies, then restart the detached container.
```bash
docker compose build --no-cache
docker compose down
docker compose up -d
```

**Done.** Your container will boot up seamlessly. Because the raffle system is strictly isolated in `raffle.sqlite`, it is guaranteed to have zero impact on your live `payload.db` database inside the container.

---

## 2. System URLs & Portals

The new system operates entirely on three isolated frontend URLs:

### A. The Public Verification Form
Where customers go to upload their photos and enter their codes.
* **URL:** `https://www.1steagle.com.ng/verify-purchase`
* **Access:** Requires the user to be logged into their standard Payload account (so we can soft-link their email and phone).

### B. The Standalone Admin Dashboard
Where management can oversee the raffle, generate codes, and draw winners.
* **URL:** `https://www.1steagle.com.ng/raffle-admin`
* **Access Details:**
  * **Password:** `1STEAGLE_ADMIN_SECRET`
  * *(Note: There is no username field, just the master password.)*

### C. The Distributor Portal
Where your offline distributors go to download their monthly batches of 50 codes (up to 200/month).
* **URL:** `https://www.1steagle.com.ng/distributor-raffle`
* **Access Details:**
  * **Distributor ID:** (They enter their unique ID, e.g., `DIST-001`)
  * **PIN:** `EAGLE2026`

---

## 3. Docker Data Safety Guarantee
* We explicitly mounted `- ./raffle.sqlite:/app/raffle.sqlite` in your `docker-compose.yml`.
* This ensures that even if you tear down your containers (`docker compose down -v`) or deploy new updates in the future, your Raffle entries and codes are permanently preserved on the DigitalOcean host disk, right alongside your `payload.db`.
