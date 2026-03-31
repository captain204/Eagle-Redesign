#!/bin/bash
#
# Eagle Database Restore Script
# Restores the SQLite database from a backup file
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
DB_PATH="$APP_DIR/payload.db"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🦅 Eagle Database Restore${NC}"
echo "========================"

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}❌ Usage: $0 <backup_file>${NC}"
    echo ""
    echo "Available backups:"
    ls -lh "$APP_DIR/backups/"*.sql.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Confirm restore
echo -e "${YELLOW}⚠️  WARNING: This will overwrite the current database!${NC}"
echo "   Backup file: $BACKUP_FILE"
read -p "   Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}❌ Restore cancelled${NC}"
    exit 1
fi

# Stop the Docker container to prevent database locks
echo -e "\n${YELLOW}🛑 Stopping application...${NC}"
cd "$APP_DIR"
docker compose down || true

# Create a backup of current database before restoring
if [ -f "$DB_PATH" ]; then
    CURRENT_BACKUP="$APP_DIR/backups/payload.db.pre-restore.$(date +"%Y-%m-%d_%H-%M-%S").backup"
    cp "$DB_PATH" "$CURRENT_BACKUP"
    echo -e "${GREEN}✅ Current database backed up to: $CURRENT_BACKUP${NC}"
fi

# Remove current database and WAL files
rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"

# Restore based on file type
if [[ "$BACKUP_FILE" == *.sql.gz ]]; then
    echo -e "\n${YELLOW}📥 Restoring from compressed SQL dump...${NC}"
    gunzip -c "$BACKUP_FILE" | sqlite3 "$DB_PATH"
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    echo -e "\n${YELLOW}📥 Restoring from SQL dump...${NC}"
    sqlite3 "$DB_PATH" < "$BACKUP_FILE"
elif [[ "$BACKUP_FILE" == *.backup ]]; then
    echo -e "\n${YELLOW}📥 Restoring from direct backup...${NC}"
    cp "$BACKUP_FILE" "$DB_PATH"
    # Also restore WAL files if they exist
    [ -f "$BACKUP_FILE-wal" ] && cp "$BACKUP_FILE-wal" "$DB_PATH-wal"
    [ -f "$BACKUP_FILE-shm" ] && cp "$BACKUP_FILE-shm" "$DB_PATH-shm"
else
    echo -e "${RED}❌ Unknown backup file format${NC}"
    exit 1
fi

# Set correct permissions
chown 1001:1001 "$DB_PATH" 2>/dev/null || true
chmod 644 "$DB_PATH"

# Start the application
echo -e "\n${YELLOW}🚀 Starting application...${NC}"
docker compose up -d

# Wait for application to be ready
echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 5

# Check if container is running
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Restore completed successfully!${NC}"
    echo -e "${GREEN}   Application is running.${NC}"
else
    echo -e "${RED}❌ Restore completed but application may have issues.${NC}"
    echo -e "${YELLOW}   Check logs with: docker compose logs -f${NC}"
fi
