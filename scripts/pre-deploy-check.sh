#!/bin/bash
#
# Eagle Pre-Deployment Checklist
# Run this script before deploying to ensure everything is ready
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

section() {
    echo -e "\n${BLUE}════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════${NC}"
}

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🦅 Eagle Pre-Deployment Checklist ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"

# ============================================
# Section 1: Environment Configuration
# ============================================
section "1. Environment Configuration"

if [ -f ".env" ]; then
    pass ".env file exists"
    
    # Check required variables
    if grep -q "PAYLOAD_SECRET=" .env && ! grep -q "PAYLOAD_SECRET=your_payload_secret_here" .env; then
        pass "PAYLOAD_SECRET is configured"
    else
        fail "PAYLOAD_SECRET is not configured or still has default value"
    fi
    
    if grep -q "DATABASE_URI=" .env; then
        pass "DATABASE_URI is configured"
    else
        fail "DATABASE_URI is missing"
    fi
    
    if grep -q "NEXT_PUBLIC_SERVER_URL=" .env && ! grep -q "NEXT_PUBLIC_SERVER_URL=https://your-domain.com" .env; then
        pass "NEXT_PUBLIC_SERVER_URL is configured"
    else
        warn "NEXT_PUBLIC_SERVER_URL may still have default value"
    fi
    
    if grep -q "PAYSTACK_SECRET_KEY=" .env && ! grep -q "PAYSTACK_SECRET_KEY=sk_live_" .env; then
        pass "PAYSTACK_SECRET_KEY is configured"
    else
        fail "PAYSTACK_SECRET_KEY is not configured or still has placeholder"
    fi
    
    if grep -q "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=" .env && ! grep -q "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_" .env; then
        pass "PAYSTACK_PUBLIC_KEY is configured"
    else
        fail "PAYSTACK_PUBLIC_KEY is not configured or still has placeholder"
    fi
    
    if grep -q "RESEND_API_KEY=" .env && ! grep -q "RESEND_API_KEY=re_" .env; then
        pass "RESEND_API_KEY is configured"
    else
        fail "RESEND_API_KEY is not configured or still has placeholder"
    fi
else
    fail ".env file does not exist. Copy .env.example to .env"
fi

# ============================================
# Section 2: System Requirements
# ============================================
section "2. System Requirements"

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    pass "Docker is installed: $DOCKER_VERSION"
else
    fail "Docker is not installed"
fi

# Check Docker Compose
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    pass "Docker Compose is installed: $COMPOSE_VERSION"
else
    fail "Docker Compose is not installed"
fi

# Check Node.js (for local development)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    pass "Node.js is installed: $NODE_VERSION"
else
    warn "Node.js is not installed (not required for production server)"
fi

# ============================================
# Section 3: Resource Checks
# ============================================
section "3. System Resources"

# Check disk space
DISK_TOTAL=$(df -m . | awk 'NR==2 {print $2}')
DISK_AVAILABLE=$(df -m . | awk 'NR==2 {print $4}')
DISK_USED=$(df -m . | awk 'NR==2 {print $3}')

if [ "$DISK_AVAILABLE" -gt 5120 ]; then
    pass "Disk space: ${DISK_AVAILABLE}MB available (${DISK_USED}MB used of ${DISK_TOTAL}MB)"
elif [ "$DISK_AVAILABLE" -gt 2048 ]; then
    warn "Disk space: ${DISK_AVAILABLE}MB available (consider cleaning up)"
else
    fail "Disk space: ${DISK_AVAILABLE}MB available (minimum 2GB recommended)"
fi

# Check memory
MEM_TOTAL=$(free -m | awk 'NR==2 {print $2}')
MEM_AVAILABLE=$(free -m | awk 'NR==2 {print $7}')

if [ "$MEM_TOTAL" -lt 1024 ]; then
    warn "Total RAM: ${MEM_TOTAL}MB (1GB minimum, swap recommended)"
else
    pass "Total RAM: ${MEM_TOTAL}MB"
fi

# Check swap
SWAP_TOTAL=$(free -m | awk 'NR==2 {print $3}')
if [ "$SWAP_TOTAL" -gt 0 ]; then
    pass "Swap is configured: ${SWAP_TOTAL}MB"
else
    warn "Swap is not configured (highly recommended for 1GB RAM)"
fi

# ============================================
# Section 4: File Structure
# ============================================
section "4. Project Files"

REQUIRED_FILES=(
    "package.json"
    "docker-compose.yml"
    "Dockerfile"
    "src/payload.config.ts"
    "scripts/fix_missing_tables.py"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        pass "$file exists"
    else
        fail "$file is missing"
    fi
done

# Check scripts are executable
if [ -x "scripts/backup-db.sh" ]; then
    pass "scripts/backup-db.sh is executable"
else
    warn "scripts/backup-db.sh is not executable"
fi

if [ -x "scripts/deploy.sh" ]; then
    pass "scripts/deploy.sh is executable"
else
    warn "scripts/deploy.sh is not executable"
fi

# ============================================
# Section 5: Docker Configuration
# ============================================
section "5. Docker Configuration"

if [ -f "docker-compose.yml" ]; then
    # Validate docker-compose.yml syntax
    if docker compose config &> /dev/null; then
        pass "docker-compose.yml is valid"
    else
        fail "docker-compose.yml has syntax errors"
    fi
    
    # Check volume mounts
    if grep -q "./payload.db:" docker-compose.yml; then
        pass "Database volume is configured"
    else
        warn "Database volume may not be configured (data persistence risk)"
    fi
    
    if grep -q "./public/media:" docker-compose.yml; then
        pass "Media volume is configured"
    else
        warn "Media volume may not be configured (uploads may be lost)"
    fi
fi

# ============================================
# Section 6: Security Checks
# ============================================
section "6. Security Configuration"

# Check for sensitive files in git
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        pass ".env is in .gitignore"
    else
        warn ".env may be committed to git (security risk)"
    fi
    
    if grep -q "payload.db" .gitignore; then
        pass "payload.db is in .gitignore"
    else
        warn "payload.db may be committed to git"
    fi
else
    warn ".gitignore not found"
fi

# Check if .env is tracked by git
if [ -d ".git" ]; then
    if git ls-files --error-unmatch .env &> /dev/null; then
        fail ".env is tracked by git (security risk!)"
    else
        pass ".env is not tracked by git"
    fi
fi

# ============================================
# Summary
# ============================================
echo -e "\n${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}           📊 Summary${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${GREEN}Passed:   $PASS${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo -e "${RED}Failed:   $FAIL${NC}"
echo ""

if [ $FAIL -gt 0 ]; then
    echo -e "${RED}❌ Please fix the failed checks before deploying${NC}"
    exit 1
elif [ $WARN -gt 0 ]; then
    echo -e "${YELLOW}⚠️  You have warnings. Review and proceed with caution${NC}"
    exit 0
else
    echo -e "${GREEN}✅ All checks passed! Ready to deploy${NC}"
    exit 0
fi
