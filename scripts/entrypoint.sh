#!/bin/sh
# Entrypoint script - runs after volumes are mounted

set -e

echo "🦅 Eagle App Starting..."

# Ensure database file exists
if [ ! -f /app/payload.db ]; then
    echo "Creating payload.db..."
    touch /app/payload.db
fi

# Set correct permissions for SQLite
chmod 666 /app/payload.db
rm -f /app/payload.db-wal /app/payload.db-shm 2>/dev/null || true

# Ensure directories exist with correct permissions
mkdir -p /app/public/media /app/backups /app/logs
chmod -R 777 /app/public/media /app/backups /app/logs

echo "Database and directories ready"

# Run fix script if it exists (for additional tables not in Payload schema)
if [ -f /app/scripts/fix_missing_tables.py ]; then
    echo "Running database fix script..."
    python3 /app/scripts/fix_missing_tables.py || echo "Fix script completed (or skipped)"
fi

echo "Starting Next.js..."
exec npm start
