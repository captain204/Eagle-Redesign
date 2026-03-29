# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# Install dependencies with NPM BuildKit Cache
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=src/payload.config.ts
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV DISABLE_DB_PUSH=1

# Build the project with Next.js Cache
RUN --mount=type=cache,target=/app/.next/cache npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy entire built application instead of memory-heavy standalone traced files
COPY --from=builder --chown=nextjs:nodejs /app ./

# Ensure media directory exists and give nextjs ownership of the entire /app directory 
# so SQLite can create temporary -wal and -shm journal files alongside payload.db
RUN mkdir -p public/media && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
