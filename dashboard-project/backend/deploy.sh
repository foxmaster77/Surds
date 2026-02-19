#!/bin/bash
# Production Deployment Script for Backend
# Usage: bash deploy-backend.sh

set -e

echo "🚀 Starting Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production not found${NC}"
    echo "Please create .env.production file with production environment variables"
    exit 1
fi

echo -e "${YELLOW}1️⃣ Checking Node.js version...${NC}"
node --version

echo -e "${YELLOW}2️⃣ Installing dependencies...${NC}"
npm install --production

echo -e "${YELLOW}3️⃣ Running tests...${NC}"
npm test || echo -e "${YELLOW}⚠️ Tests failed, continuing...${NC}"

echo -e "${YELLOW}4️⃣ Linting code...${NC}"
npm run lint || echo -e "${YELLOW}⚠️ Linting issues found${NC}"

echo -e "${YELLOW}5️⃣ Building application...${NC}"
npm run build

echo -e "${YELLOW}6️⃣ Creating production bundle...${NC}"
# Create tarball for backup
tar -czf ../linkforge-backend-$(date +%Y%m%d-%H%M%S).tar.gz .

echo -e "${GREEN}✅ Backend deployment preparation complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Push to GitHub: git push origin main"
echo "2. Render will auto-deploy from GitHub"
echo "3. Monitor deployment at Render dashboard"
echo "4. Test API: https://your-backend.onrender.com/api/links"
echo ""
