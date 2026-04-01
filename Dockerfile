# Stage 1: Build
FROM node:20-alpine AS builder

# Install only essential build dependencies
RUN apk add --no-cache libc6-compat python3 && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies with NPM BuildKit Cache
# Use --legacy-peer-deps to resolve Payload CMS peer dependency conflicts
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy only necessary source files (exclude unnecessary files)
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=src/payload.config.ts
# Limit memory usage during build for 1GB RAM servers
ENV NODE_OPTIONS="--max-old-space-size=768"

# Build the project with Next.js Cache (Disable DB push to prevent schema lock deadlocks)
RUN --mount=type=cache,target=/app/.next/cache \
    python3 scripts/fix_missing_tables.py && \
    DISABLE_DB_PUSH=1 npm run build

# Stage 2: Production Runner (Minimal Image)
FROM node:20-alpine AS runner
WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Memory for runtime (set via docker-compose.yml)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy built application from builder stage
COPY --from=builder --chown=1001:1001 /app ./

# Ensure media directory exists and set proper permissions
# SQLite needs write access to create -wal and -shm journal files
RUN mkdir -p public/media && \
    mkdir -p backups && \
    mkdir -p logs && \
    chmod -R 777 public/media backups logs

# Install Python runtime only (not full python3 package) for DB scripts
RUN apk add --no-cache python3 && \
    rm -rf /var/cache/apk/*

# Expose application port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Initialize database and start application
CMD ["sh", "-c", "touch /app/payload.db && chmod 666 /app/payload.db && python3 scripts/fix_missing_tables.py && npm start"]
