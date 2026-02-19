# 🚀 Deployment Guide

Complete instructions for deploying the SaaS Dashboard to production.

## Prerequisites

- Git repository (GitHub, GitLab, etc.)
- MongoDB Atlas account (free tier available)
- Deployment platform account (Heroku, Railway, or similar)
- Frontend hosting (Vercel, Netlify, or similar)

## Local Testing Before Deployment

```bash
# Run locally
npm start

# Test all features
# - Login/Register
# - Dashboard loading
# - Real-time updates
# - Socket.io connection
# - Chart rendering
```

## Backend Deployment (Heroku Example)

### Step 1: Prepare Backend for Production

Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/saas-dashboard?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Deploy to Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new app
heroku create saas-dashboard-app

# Add buildpacks
heroku buildpacks:add heroku/nodejs -a saas-dashboard-app

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://..." -a saas-dashboard-app
heroku config:set JWT_SECRET="your-strong-secret" -a saas-dashboard-app
heroku config:set NODE_ENV=production -a saas-dashboard-app
heroku config:set FRONTEND_URL="https://yourdomain.com" -a saas-dashboard-app

# Deploy
git push heroku main

# View logs
heroku logs --tail -a saas-dashboard-app

# Check if running
curl https://saas-dashboard-app.herokuapp.com/health
# Should return: {"status":"ok"}
```

### Step 3: MongoDB Atlas Setup

1. Create free account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Add database user with password
4. Whitelist IP addresses (allow all for testing)
5. Get connection string
6. Format: `mongodb+srv://user:password@cluster.mongodb.net/saas-dashboard?retryWrites=true&w=majority`

## Backend Deployment (Railway Example)

```bash
# Push code to GitHub
git add .
git commit -m "Deploy to Railway"
git push

# Login to Railway
npm i -g @railway/cli
railway login

# Create new project
railway init

# Link GitHub repo
railway link <project-id>

# Add MongoDB service
# Go to Railway dashboard → Add Service → MongoDB

# Deploy
git push

# Get URL from Railway dashboard
# Set FRONTEND_URL environment variable
```

## Frontend Deployment (Vercel)

### Step 1: Update API Endpoint

In `frontend/script.js`, update:
```javascript
const API_BASE = 'https://saas-dashboard-app.herokuapp.com/api';
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts
# Select project name
# Confirm directory
# Done!
```

### Alternative: Deploy via GitHub

1. Push frontend to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import GitHub repository
5. Select root directory: `frontend`
6. Deploy

## Frontend Deployment (Netlify)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod

# Follow prompts
# Select deploy folder: .
# Set redirect rules
```

### Alternative: Drag & Drop

1. Go to [netlify.com](https://netlify.com)
2. Create new site
3. Drag & drop `frontend` folder
4. Site deployed instantly!

## SSL/HTTPS Setup

### Heroku
- Automatically provided with HTTPS
- Certificate included

### Custom Domain (Vercel)
1. Go to project settings
2. Add custom domain
3. Update DNS records
4. Certificate auto-generated

### Custom Domain (Netlify)
1. Domain settings
2. Add custom domain
3. Update DNS records
4. Certificate auto-generated (Let's Encrypt)

## Environment Variables

### Backend Production (.env)

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/saas-dashboard

# JWT
JWT_SECRET=<generate-random-string>
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Server
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://yourdomain.com
```

### Frontend Production (script.js)

```javascript
const API_BASE = 'https://your-backend-domain.com/api';
const POLL_INTERVAL = 5000; // 5 seconds
```

## SSL Certificate Generation (for JWT_SECRET)

```bash
# Generate secure JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate MongoDB password
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Database Backup Strategy

### MongoDB Atlas Automatic Backups
1. Go to MongoDB Atlas Dashboard
2. Select cluster
3. Backup → Backup Policy
4. Enable automatic backups (default: every 6 hours)
5. Retention: 7 days

### Manual Backup

```bash
# Backup database
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/saas-dashboard" --out ./backup

# Restore database
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/saas-dashboard" ./backup
```

## Performance Optimization

### Frontend Optimization

```javascript
// Lazy load Chart.js
if (document.getElementById('teamChart')) {
  import('chart.js').then(module => {
    // Initialize chart
  });
}

// Reduce polling interval in production
const POLL_INTERVAL = 10000; // 10 seconds instead of 5
```

### Backend Optimization

```javascript
// Add caching middleware
const cache = require('express-cache-middleware');

// Add request timeout
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});
```

## Monitoring & Logging

### Heroku Logging
```bash
heroku logs --tail
heroku logs --tail --app saas-dashboard-app
```

### MongoDB Atlas Monitoring
1. Metrics tab
2. View database operations
3. Check memory usage
4. Monitor connections

### Application Performance Monitoring (APM)

```bash
# Install New Relic (optional)
npm install newrelic

# Add to server.js
require('newrelic');
```

## Uptime Monitoring

### UptimeRobot (Free)
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor
3. URL: `https://backend-domain.com/health`
4. Check interval: 5 minutes
5. Get alerts if down

### Healthchecks
```javascript
// Backend health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Monitor with: curl https://your-backend.com/health
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: saas-dashboard-app
          heroku_email: your-email@example.com
          appdir: backend

      - name: Deploy frontend
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Domain Setup

### Example: yourdomain.com

**Frontend:** `https://yourdomain.com` (Vercel/Netlify)
**Backend API:** `https://api.yourdomain.com` (Heroku/Railway)

### DNS Records

```
# Vercel (Frontend)
Type: CNAME
Name: @
Value: cname.vercel-dns.com

# Custom Backend (Heroku)
Type: CNAME
Name: api
Value: saas-dashboard-app.herokuapp.com
```

## Security Checklist

- [x] JWT_SECRET is strong (32+ characters)
- [x] HTTPS/SSL enabled
- [x] MongoDB password is strong
- [x] Environment variables in .env (not committed)
- [x] CORS configured correctly
- [x] Rate limiting enabled (optional)
- [x] Input validation implemented
- [x] Password hashing with bcryptjs
- [x] Secrets not exposed in logs
- [x] Regular security updates

## Troubleshooting Deployment

### Backend won't start
```bash
heroku logs --tail
# Check for error messages
# Common: MongoDB connection failed, missing env vars
```

### Frontend can't reach backend
```javascript
// Check API_BASE in script.js
console.log('API:', API_BASE);
// Verify CORS headers in backend
// Check if backend is running
```

### Socket.io connection fails
```bash
# Check WebSocket support
# Verify backend has Socket.io enabled
# Check CORS configuration in server.js
```

### Database connection issues
```bash
# Test MongoDB connection
mongo "mongodb+srv://user:password@cluster.mongodb.net/saas-dashboard"
# Verify IP whitelist in MongoDB Atlas
```

## Scaling Strategy

### Database
1. Start: MongoDB Atlas free tier (512MB)
2. Growth: Upgrade to M2 (2GB)
3. Scale: M5+ with sharding

### Backend
1. Start: Single Heroku dyno (free or paid)
2. Growth: Multiple dynos with load balancer
3. Scale: Kubernetes deployment

### Frontend
1. Static hosting (Vercel/Netlify) - scales automatically
2. CDN caching
3. Image optimization

## Cost Estimation

**Free Tier ($0/month)**
- Heroku: Free dyno (limited hours)
- MongoDB Atlas: 512MB free tier
- Vercel/Netlify: Free hosting
- Total: ~$0-5/month

**Starter Tier ($10-20/month)**
- Heroku: Basic dyno ($7)
- MongoDB Atlas: M2 ($9)
- Domain: $12
- Total: ~$28/month

**Growth Tier ($50-100/month)**
- Heroku: Standard dyno ($50)
- MongoDB Atlas: M5 ($57)
- CDN & extras: $20
- Total: ~$100+/month

## Rollback Procedure

### Heroku Rollback
```bash
# View releases
heroku releases -a saas-dashboard-app

# Rollback to previous release
heroku releases:rollback -a saas-dashboard-app

# Rollback to specific release
heroku releases:rollback v10 -a saas-dashboard-app
```

### Vercel Rollback
1. Go to Deployments
2. Find previous deployment
3. Click "..." → Promote to Production

## Post-Deployment Checklist

- [ ] Backend running: `https://backend-domain.com/health`
- [ ] Frontend loading: `https://yourdomain.com`
- [ ] Login works with test credentials
- [ ] Dashboard loads data
- [ ] Charts render correctly
- [ ] Socket.io connected (green indicator)
- [ ] Polling working (console shows API calls)
- [ ] Real-time updates work
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Monitoring alerts set up
- [ ] Backups enabled
- [ ] Performance acceptable

## Support & Maintenance

### Regular Maintenance
- Update dependencies: `npm audit fix`
- Check MongoDB backups monthly
- Monitor error logs weekly
- Update Node.js to latest LTS

### Incident Response
1. Monitor shows service down
2. Check backend logs
3. Check database connection
4. Rollback if necessary
5. Investigate root cause
6. Deploy fix
7. Document incident

---

**Need help?** Check the troubleshooting section or review logs:
```bash
# View backend logs
heroku logs --tail -a saas-dashboard-app

# Check frontend errors
Browser DevTools → Console tab
```

Deployment complete! 🎉
