# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Complete Full-Stack SaaS Deployment

Deploy your LinkForge dashboard to production with Render (Backend) + Vercel (Frontend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Domain Configuration](#domain-configuration)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Accounts Required
- [ ] GitHub account (for Git repos)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Render.com account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] Domain registrar (Namecheap, GoDaddy, etc.) - optional

### Local Setup Complete
- [ ] Backend runs locally on port 5000
- [ ] Frontend runs locally on port 3000
- [ ] Git repository initialized
- [ ] Code committed and pushed to GitHub

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"**
3. Fill in details:
   - Email
   - Password
   - Company name (optional)
4. Verify email
5. Accept terms and create account

### Step 2: Create a Cluster

1. Click **"Create a Deployment"**
2. Choose **"M0 Shared"** (free tier)
3. Select cloud provider: **AWS**
4. Select region: **US East (N. Virginia)** or closer to you
5. Click **"Create Deployment"**
6. Wait 5-10 minutes for cluster to initialize

### Step 3: Create Database User

1. Go to **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Username: `linkforge_user`
4. Password: Generate secure password (save it!)
5. Built-in Role: **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Go to **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for production)
4. Enter **0.0.0.0/0**
5. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** overview
2. Click **"Connect"** button on your cluster
3. Choose **"Drivers"**
4. Select **"Node.js"** driver
5. Copy connection string
6. Replace `<password>` with your database user password
7. Save this for backend environment variables

**Format:**
```
mongodb+srv://linkforge_user:<password>@cluster0.xxxxx.mongodb.net/linkforge?retryWrites=true&w=majority
```

---

## Backend Deployment (Render)

### Step 1: Prepare Backend Repository

1. Navigate to backend folder:
```bash
cd backend
```

2. Create `.env.production`:
```env
PORT=10000
MONGODB_URI=mongodb+srv://linkforge_user:PASSWORD@cluster0.xxxxx.mongodb.net/linkforge?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-production-key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
RENDER_EXTERNAL_URL=https://your-backend.onrender.com
```

3. Ensure `.gitignore` includes `.env`:
```
.env
.env.local
.env.*.local
node_modules/
logs/
```

4. Push to GitHub:
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to https://render.com
2. Click **"New Web Service"**
3. Connect your GitHub account
4. Select your backend repository
5. Fill in details:
   - **Name:** `linkforge-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or paid for more resources)

### Step 3: Add Environment Variables on Render

1. Scroll to **"Environment"** section
2. Add each variable:
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com (or Vercel URL)
   ```

3. Click **"Create Web Service"**
4. Wait for deployment (5-10 minutes)
5. Note the URL: `https://your-backend.onrender.com`

### Step 4: Verify Backend Deployment

```bash
# Test the API
curl https://your-backend.onrender.com/api/auth/register

# Should return 400 with validation error (expected)
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend Repository

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Create `.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

3. Update `src/services/api.js` to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

4. Build and test locally:
```bash
npm run build
npm run preview
```

5. Push to GitHub:
```bash
git add .
git commit -m "chore: prepare frontend for production"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Import Project"**
3. Select GitHub option
4. Authorize Vercel to access your GitHub
5. Select your frontend repository
6. Click **"Import"**

### Step 3: Configure Vercel Settings

1. Fill in project details:
   - **Project Name:** `linkforge-frontend`
   - **Framework:** `Vite`
   - **Root Directory:** `./frontend` (if in monorepo)

2. Add environment variables:
   - Click **"Add Environment Variable"**
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
   - Select **"Production"** environment

3. Click **"Deploy"**
4. Wait for deployment (2-5 minutes)
5. Note the URL: `https://your-frontend.vercel.app`

### Step 4: Verify Frontend Deployment

1. Go to `https://your-frontend.vercel.app`
2. Should see login page
3. Try login with test credentials
4. Should connect to your backend on Render

---

## Environment Variables

### Backend Environment Variables (.env.production)

```env
# Server
PORT=10000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://linkforge_user:PASSWORD@cluster0.xxxxx.mongodb.net/linkforge?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-production-key-min-32-chars
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info
LOG_DIR=/tmp/logs

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (.env.production)

```env
# API Configuration
VITE_API_URL=https://your-backend.onrender.com/api

# Optional: Analytics
VITE_ANALYTICS_ID=your-google-analytics-id

# Optional: Feature flags
VITE_ENABLE_STRIPE=true
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

### Generate Secure Secrets

```bash
# Generate secure JWT secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: 64-character hex string (use this for JWT_SECRET)
```

---

## Backend CORS Configuration

Update `backend/server.js` to handle production CORS:

```javascript
const cors = require('cors')

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
```

---

## Domain Configuration

### Step 1: Buy Domain (Optional)

1. Go to Namecheap, GoDaddy, or similar
2. Search for your domain (e.g., `linkforge.com`)
3. Purchase domain
4. Keep domain registrar tab open

### Step 2: Connect Domain to Vercel (Frontend)

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **"Settings"** → **"Domains"**
4. Click **"Add Domain"**
5. Enter your domain: `linkforge.com`
6. Click **"Add"**

7. Vercel shows DNS records to add:
   - **Type:** `CNAME`
   - **Name:** `yourdomain.com` (or subdomain)
   - **Value:** `cname.vercel.com.`

8. Go to your domain registrar
9. Find **"DNS Management"** or **"DNS Settings"**
10. Add the CNAME record provided by Vercel
11. Wait for DNS to propagate (5 minutes - 24 hours)

### Step 3: Connect Subdomain to Render (Backend)

1. Go to Render dashboard
2. Select your backend service
3. Go to **"Settings"**
4. Scroll to **"Custom Domain"**
5. Click **"Add Custom Domain"**
6. Enter subdomain: `api.yourdomain.com`
7. Click **"Add Domain"**

8. Render shows DNS record:
   - **Type:** `CNAME`
   - **Name:** `api.yourdomain.com`
   - **Value:** Render's CNAME endpoint

9. Go to your domain registrar
10. Add CNAME record for `api` subdomain
11. Wait for DNS propagation

### Step 4: Update Environment Variables

Once domains are live:

**Backend (Render):**
```
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
```

**Frontend (Vercel):**
```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Post-Deployment Checklist

### Verify Everything Works

- [ ] Frontend loads at your domain
- [ ] Login page displays
- [ ] Can register new account
- [ ] Can log in with credentials
- [ ] Dashboard loads
- [ ] Can create a link
- [ ] Can view charts
- [ ] Can delete links
- [ ] Analytics page works
- [ ] Settings page works
- [ ] Logout works

### Security Setup

- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] Environment variables are not exposed
- [ ] MongoDB has whitelist/IP restrictions
- [ ] JWT secret is strong and unique
- [ ] CORS is restrictive (only your domains)
- [ ] Rate limiting is enabled

### Monitoring Setup

- [ ] Check Render logs for errors
- [ ] Check Vercel logs for issues
- [ ] Monitor MongoDB Atlas for performance
- [ ] Set up email alerts for errors
- [ ] Monitor API response times

### Database Backup

1. Go to MongoDB Atlas
2. Go to **"Backup"** section
3. Enable **"Automatic Backup"**
4. Set backup frequency to **daily**

---

## Production Build Scripts

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Backend is ready to deploy'",
    "test": "jest --coverage",
    "lint": "eslint .",
    "seed": "node scripts/seed.js"
  }
}
```

### Frontend (`frontend/package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  }
}
```

---

## Troubleshooting

### Issue: "Cannot connect to backend from frontend"

**Solution:**
1. Check CORS settings in backend
2. Verify `FRONTEND_URL` environment variable
3. Check backend is running (`https://your-backend.onrender.com/api/links`)
4. Check network tab in browser for actual error

### Issue: "MongoDB connection refused"

**Solution:**
1. Verify connection string in `MONGODB_URI`
2. Check IP whitelist in MongoDB Atlas
3. Verify username/password in connection string
4. Check network connectivity

### Issue: "Build failed on Vercel"

**Solution:**
1. Check Vercel build logs
2. Ensure `.env.production` is not in repo
3. Check Node version compatibility
4. Run `npm run build` locally to test

### Issue: "502 Bad Gateway on Render"

**Solution:**
1. Check Render logs for errors
2. Verify environment variables are set
3. Check MongoDB connection
4. Restart web service on Render

### Issue: "Domain not resolving"

**Solution:**
1. Wait for DNS propagation (up to 24 hours)
2. Use DNS checker: https://dnschecker.org/
3. Verify CNAME records are correct
4. Clear browser cache

---

## Scaling & Optimization

### For More Traffic

1. **Backend (Render):**
   - Upgrade from Free to Starter plan
   - Use "Standard" tier for auto-scaling

2. **Frontend (Vercel):**
   - Already scales automatically
   - Monitor bundle size

3. **Database (MongoDB):**
   - Start with M0 (free) for testing
   - Upgrade to M2-M5 tier for production
   - Enable read replicas for high availability

### Monitoring & Analytics

1. **Render:**
   - Built-in logs and monitoring
   - Set up alerts for crashes

2. **Vercel:**
   - Analytics dashboard
   - Performance monitoring

3. **MongoDB:**
   - Performance Advisor
   - Query profiler

---

## Next Steps

1. Follow setup guide above
2. Test each step thoroughly
3. Monitor logs after deployment
4. Set up backup strategy
5. Plan scaling for growth
6. Consider adding CDN for static files

---

## Support & Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next: Implement additional features

---

**Your SaaS app is now in production! 🎉**

Monitor carefully and scale as needed.
