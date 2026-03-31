#!/bin/bash
#
# Eagle Database Backup Script
# Creates timestamped backups of the SQLite database
#

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
DB_PATH="$APP_DIR/payload.db"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/payload.db.$TIMESTAMP.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🦅 Eagle Database Backup${NC}"
echo "========================"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Database not found at: $DB_PATH${NC}"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup using sqlite3 .dump command
# This creates a SQL file that can be restored later
sqlite3 "$DB_PATH" ".dump" > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}✅ Backup created successfully!${NC}"
echo "   Location: $BACKUP_FILE"
echo "   Size: $BACKUP_SIZE"

# Keep only last 7 backups (cleanup old backups)
echo -e "\n${YELLOW}🧹 Cleaning up old backups (keeping last 7)...${NC}"
cd "$BACKUP_DIR"
ls -t payload.db.*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
REMAINING=$(ls -t payload.db.*.sql.gz 2>/dev/null | wc -l)
echo "   Remaining backups: $REMAINING"

# Also create a direct copy of the database file
DIRECT_BACKUP="$BACKUP_DIR/payload.db.$TIMESTAMP.backup"
cp "$DB_PATH" "$DIRECT_BACKUP"

# Also copy WAL files if they exist
[ -f "$DB_PATH-wal" ] && cp "$DB_PATH-wal" "$DIRECT_BACKUP-wal"
[ -f "$DB_PATH-shm" ] && cp "$DB_PATH-shm" "$DIRECT_BACKUP-shm"

echo -e "${GREEN}✅ Direct backup also created: $DIRECT_BACKUP${NC}"
echo -e "${GREEN}✅ Backup complete!${NC}"
