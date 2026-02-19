# 🚀 Deployment Guide

Complete step-by-step guide to deploy your SaaS Dashboard to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Generate strong JWT_SECRET
- [ ] Set up production MongoDB
- [ ] Update environment variables
- [ ] Test with production URLs
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging
- [ ] Test from different devices

---

## 🚀 Option 1: Deploy to Render (Recommended)

Render is the easiest Heroku alternative.

### Step 1: Prepare Backend

1. **Create [Render](https://render.com) account**
2. **Connect GitHub** (push project to GitHub first)

### Step 2: Deploy Backend

1. **Create New Service**
   - Service: Web Service
   - Repository: Select your repo
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`

2. **Set Environment Variables**
   - Add in Render dashboard:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dashboard
     JWT_SECRET=your_long_random_secret_key_here
     NODE_ENV=production
     ```

3. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Copy the URL (e.g., https://dashboard-api.onrender.com)

### Step 3: Deploy Frontend

1. **Update API URL**
   - In `frontend/script.js`:
     ```javascript
     const API_URL = 'https://dashboard-api.onrender.com/api';
     ```

2. **Create Render Static Site**
   - Service: Static Site
   - Build Command: `echo "Frontend ready"`
   - Publish Directory: `./frontend`

3. **Deploy**
   - Render automatically updates

---

## 🚀 Option 2: Deploy to Heroku

### Step 1: Install Heroku CLI

```bash
# Windows
choco install heroku-cli

# macOS
brew install heroku/brew/heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Deploy Backend

```bash
# Login
heroku login

# Create app
cd backend
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Step 3: Deploy Frontend

1. **Update API URL**
   ```javascript
   const API_URL = 'https://your-app-name.herokuapp.com/api';
   ```

2. **Deploy to Vercel or Netlify** (see below)

---

## 🌐 Option 3: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

```bash
cd frontend
```

### Step 2: Create vercel.json

Create `frontend/vercel.json`:
```json
{
  "buildCommand": "echo 'Frontend ready'",
  "outputDirectory": "."
}
```

### Step 3: Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 4: Update API URL

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add `VITE_API_URL` or update in deployed files

---

## 🌐 Option 4: Deploy to AWS

### Backend (EC2)

1. **Launch EC2 instance**
   - OS: Ubuntu 22.04
   - Instance type: t3.micro (free tier)

2. **SSH and setup**
   ```bash
   ssh -i key.pem ubuntu@your-instance.amazonaws.com
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install MongoDB CLI (or use Atlas)
   
   # Clone repo
   git clone your-repo.git
   cd dashboard-project/backend
   npm install
   ```

3. **Create systemd service**
   ```bash
   sudo nano /etc/systemd/system/dashboard.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=Dashboard API
   After=network.target
   
   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/dashboard-project/backend
   Environment="NODE_ENV=production"
   Environment="MONGODB_URI=..."
   Environment="JWT_SECRET=..."
   ExecStart=/usr/bin/node server.js
   Restart=on-failure
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Enable:
   ```bash
   sudo systemctl enable dashboard
   sudo systemctl start dashboard
   ```

4. **Setup HTTPS with Nginx**
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   
   # Configure Nginx as reverse proxy
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   location /api {
       proxy_pass http://localhost:5000;
   }
   ```

### Frontend (CloudFront + S3)

1. **Create S3 bucket**
   - Upload `frontend/` files
   - Enable Static Website Hosting

2. **Setup CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Enable HTTPS

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Cloud)

1. **Create [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account**
2. **Create cluster**
3. **Create database user**
4. **Whitelist IPs**
5. **Get connection string**
6. **Update `.env`:**
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dashboard-db
   ```

### Option 2: Self-Hosted

```bash
# Install MongoDB
# (Platform-specific)

# Start service
mongod

# Create database
mongo
> use dashboard-db
> db.users.find()
```

---

## 🔐 Security Checklist

### Environment Variables
```env
# NEVER commit to Git!
MONGODB_URI=secure_connection_string
JWT_SECRET=generate_with:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NODE_ENV=production
```

### HTTPS
- Use SSL certificate (free with Let's Encrypt)
- Redirect HTTP → HTTPS
- Set secure cookie flags

### CORS
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

---

## 📊 Monitoring

### Error Logging
```bash
npm install winston
```

### Performance Monitoring
- Use Render/Heroku built-in monitoring
- Set up Sentry for error tracking
- Monitor database performance

### Uptime Monitoring
- Set up UptimeRobot
- Alert on downtime

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

---

## 🌍 Domain Setup

### Buy Domain
- Namecheap, GoDaddy, Route53, etc.

### Point DNS
**For Render:**
- CNAME: your-domain.com → render service URL

**For AWS:**
- Use Route53 or point DNS to CloudFront

**For Vercel:**
- Add custom domain in project settings
- Vercel manages DNS

### SSL Certificate
- Free with Let's Encrypt
- Auto-renewed by hosting platform
- Check "Force HTTPS"

---

## 🧪 Post-Deployment Testing

```bash
# Test API
curl https://your-api.com/api/health

# Test Authentication
curl -X POST https://your-api.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test Frontend
Open https://your-domain.com in browser
Register → Create link → Verify analytics
```

---

## 📈 Scaling

### When You Need More Power

1. **Backend Scaling**
   - Upgrade to larger instance
   - Add load balancer
   - Use multiple workers (cluster mode)

2. **Database Scaling**
   - Upgrade MongoDB tier
   - Add read replicas
   - Implement caching (Redis)

3. **Frontend Scaling**
   - Already using CDN (Vercel/Netlify)
   - Add caching headers
   - Compress assets

---

## 💰 Cost Estimation (Monthly)

- **Backend (Render):** $7 (Basic) - $70 (Pro)
- **Database (Atlas):** Free - $50+ (production)
- **Frontend (Vercel):** Free
- **Domain:** $1-15
- **SSL:** Free
- **Total:** $8-140/month

---

## 📞 Troubleshooting Deployment

### 502 Bad Gateway
- Check backend is running
- Verify API endpoint
- Check error logs

### CORS Error
- Update CORS origin
- Check credentials headers
- Verify API URL

### Database Connection Failed
- Check connection string
- Verify IP whitelist
- Test locally first

### Static Files Not Loading
- Check file paths
- Verify CDN/S3 setup
- Check MIME types

---

## 🎉 Deployment Complete!

Your app is now live! 🚀

### Next Steps:
1. Test thoroughly in production
2. Monitor performance
3. Set up logging
4. Configure backups
5. Plan scaling strategy

---

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS Documentation](https://aws.amazon.com/documentation/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)

Happy deploying! 🎊
