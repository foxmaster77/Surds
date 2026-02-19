#!/bin/bash
# Production Deployment Script for Frontend
# Usage: bash deploy-frontend.sh

set -e

echo "🚀 Starting Frontend Deployment..."

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
npm ci

echo -e "${YELLOW}3️⃣ Running linter...${NC}"
npm run lint || echo -e "${YELLOW}⚠️ Linting issues found${NC}"

echo -e "${YELLOW}4️⃣ Building production bundle...${NC}"
npm run build

echo -e "${YELLOW}5️⃣ Analyzing bundle size...${NC}"
if [ -f dist/index.html ]; then
    du -sh dist/
    echo "Build artifacts:"
    find dist -type f -exec ls -lh {} \; | awk '{print $9, "(" $5 ")"}'
fi

echo -e "${YELLOW}6️⃣ Creating deployment package...${NC}"
tar -czf ../linkforge-frontend-$(date +%Y%m%d-%H%M%S).tar.gz dist/

echo -e "${GREEN}✅ Frontend deployment preparation complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Push to GitHub: git push origin main"
echo "2. Vercel will auto-deploy from GitHub"
echo "3. Monitor deployment at Vercel dashboard"
echo "4. Access at: https://your-frontend.vercel.app"
echo ""
echo -e "${YELLOW}Tips:${NC}"
echo "• Check dist/ folder size (should be < 1MB gzipped)"
echo "• Verify VITE_API_URL points to production backend"
echo "• Test all features after deployment"
echo ""
