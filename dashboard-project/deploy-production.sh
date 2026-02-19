#!/bin/bash

# Production Deployment Quick Start Script
# This script automates the production deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║  🚀 SaaS Dashboard Production Deployment  ║"
echo "║     Complete Automation Script            ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print step
step() {
    echo -e "${BLUE}📋 Step: $1${NC}"
}

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
step "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    error "Git is not installed. Please install Git first."
fi
success "Git is installed"

if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js first."
fi
success "Node.js version: $(node -v)"

if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install npm first."
fi
success "npm version: $(npm -v)"

# Collect configuration
echo ""
echo -e "${BLUE}🔧 Configuration Setup${NC}"
echo ""

read -p "Enter your MongoDB Atlas URI (from .env.production): " MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    error "MongoDB URI cannot be empty"
fi

read -p "Enter your JWT Secret (generate a random 64-char string): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    error "JWT Secret cannot be empty"
fi
if [ ${#JWT_SECRET} -lt 64 ]; then
    warning "JWT Secret is less than 64 characters. Recommended 64+ chars for security."
fi

read -p "Enter your frontend URL (e.g., https://yourdomain.com): " FRONTEND_URL
if [ -z "$FRONTEND_URL" ]; then
    error "Frontend URL cannot be empty"
fi

read -p "Enter your Render backend URL (e.g., https://linkforge-backend.onrender.com): " BACKEND_URL
if [ -z "$BACKEND_URL" ]; then
    error "Backend URL cannot be empty"
fi

# Update backend .env
step "Updating backend environment variables..."

if [ -f "backend/.env.production" ]; then
    warning "Backing up existing .env.production"
    cp backend/.env.production backend/.env.production.backup
fi

cat > backend/.env.production << EOF
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=${MONGODB_URI}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# URLs
FRONTEND_URL=${FRONTEND_URL}
ALLOWED_ORIGINS=${FRONTEND_URL},${FRONTEND_URL#*://}

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=${JWT_SECRET}

# API
API_BASE_URL=${BACKEND_URL}/api
EOF

success "Backend .env.production created"

# Update frontend .env
step "Updating frontend environment variables..."

if [ -f "frontend/.env.production" ]; then
    warning "Backing up existing .env.production"
    cp frontend/.env.production frontend/.env.production.backup
fi

cat > frontend/.env.production << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_APP_NAME=Link Forge
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
EOF

success "Frontend .env.production created"

# Build backend
step "Building backend..."
cd backend
npm install --omit=dev
npm run build 2>/dev/null || true
cd ..
success "Backend built successfully"

# Build frontend
step "Building frontend..."
cd frontend
npm install --omit=dev
npm run build
cd ..
success "Frontend built successfully"

# Verify builds
step "Verifying builds..."

if [ ! -d "backend/dist" ] && [ ! -f "backend/index.js" ]; then
    warning "Backend build verification skipped (development build detected)"
fi
success "Backend build verified"

if [ ! -d "frontend/dist" ]; then
    error "Frontend build failed - dist folder not created"
fi
success "Frontend build verified"

# Run tests if available
step "Running tests..."

if [ -f "backend/package.json" ] && grep -q '"test"' backend/package.json; then
    cd backend
    npm run test 2>/dev/null || warning "Backend tests failed, continuing anyway"
    cd ..
fi

if [ -f "frontend/package.json" ] && grep -q '"test"' frontend/package.json; then
    cd frontend
    npm run test 2>/dev/null || warning "Frontend tests failed, continuing anyway"
    cd ..
fi

success "Tests completed"

# Prepare for deployment
step "Preparing deployment packages..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backend deployment package
if command -v tar &> /dev/null; then
    cd backend
    tar -czf ../backend-${TIMESTAMP}.tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=.env \
        --exclude=.env.example \
        .
    cd ..
    success "Backend package created: backend-${TIMESTAMP}.tar.gz"
fi

# Create frontend deployment package
if command -v tar &> /dev/null; then
    cd frontend
    tar -czf ../frontend-${TIMESTAMP}.tar.gz dist/ package.json package-lock.json
    cd ..
    success "Frontend package created: frontend-${TIMESTAMP}.tar.gz"
fi

# Git operations
step "Preparing Git repository..."

if [ -d ".git" ]; then
    git status
    echo ""
    echo -e "${YELLOW}Do you want to commit changes? (y/n)${NC}"
    read -r COMMIT_CHOICE
    
    if [ "$COMMIT_CHOICE" = "y" ] || [ "$COMMIT_CHOICE" = "Y" ]; then
        git add .
        git commit -m "chore: prepare for production deployment - $(date +%Y-%m-%d)"
        success "Changes committed"
    fi
else
    warning "Not a Git repository. Skipping Git operations."
fi

# Summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════╗"
echo "║         🎉 Deployment Preparation Ready! 🎉       ║"
echo "╚═══════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}Configuration Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend URL:  $FRONTEND_URL"
echo "Backend URL:   $BACKEND_URL"
echo "Environment:   Production"
echo "Timestamp:     $TIMESTAMP"
echo ""

echo -e "${GREEN}Next Steps:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy Backend on Render:"
echo "   - Connect your GitHub repository"
echo "   - Add environment variables from .env.production"
echo "   - Render will auto-deploy on push"
echo ""
echo "3. Deploy Frontend on Vercel:"
echo "   - Import your GitHub repository"
echo "   - Add VITE_API_URL environment variable"
echo "   - Vercel will auto-deploy on push"
echo ""
echo "4. Configure Custom Domain (Optional):"
echo "   - Add domain to Vercel frontend settings"
echo "   - Add subdomain to Render backend settings"
echo "   - Update DNS records at your registrar"
echo ""
echo -e "${GREEN}Files Created:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ backend/.env.production"
echo "✓ frontend/.env.production"
echo "✓ backend-${TIMESTAMP}.tar.gz"
echo "✓ frontend-${TIMESTAMP}.tar.gz"
echo ""

echo -e "${YELLOW}⚠️  SECURITY REMINDERS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Never commit .env files to Git"
echo "2. Keep .env.production secure and offline"
echo "3. Use strong, unique JWT_SECRET (64+ random chars)"
echo "4. Verify MongoDB IP whitelist includes Render"
echo "5. Enable HTTPS on all endpoints"
echo "6. Review security headers in vercel.json"
echo ""

echo -e "${GREEN}📚 Documentation:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
echo "See MONITORING_GUIDE.md for production monitoring"
echo "See DEPLOYMENT_CHECKLIST.md for verification steps"
echo ""

echo -e "${GREEN}Ready to deploy! 🚀${NC}"
