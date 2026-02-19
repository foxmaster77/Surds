# 🔍 PRODUCTION MONITORING & TROUBLESHOOTING GUIDE

Complete guide for monitoring your production deployment and resolving common issues.

---

## 📊 Monitoring Dashboards

### Render Backend Monitoring
**URL**: https://dashboard.render.com

1. **Click on your service** (linkforge-backend)
2. **View Dashboard**:
   - Deployment status
   - Build logs
   - Runtime logs
   - CPU/Memory usage
   - Requests/errors

3. **Check Logs**:
   - Click "Logs" tab
   - Filter by date/time
   - Search error keywords
   - Export logs for analysis

### Vercel Frontend Monitoring
**URL**: https://vercel.com/dashboard

1. **Click on your project** (linkforge-frontend)
2. **View Analytics**:
   - Build status
   - Deployment history
   - Performance metrics
   - Web vitals (LCP, FID, CLS)
   - Real user monitoring (RUM)

3. **Check Logs**:
   - Click "Deployments"
   - Select deployment
   - View build logs
   - Check function logs (if using)

### MongoDB Atlas Monitoring
**URL**: https://cloud.mongodb.com

1. **Click your cluster** (Cluster0)
2. **View Metrics**:
   - Operation metrics (read/write latency)
   - Query profiler
   - Connections
   - Memory/CPU usage
   - Network I/O

---

## 🚨 Setting Up Alerts

### Render Alerts

1. Go to Service Settings
2. Scroll to "Notifications"
3. Add your email for:
   - Deploy failures
   - Service down
   - Critical errors

### Vercel Alerts

1. Go to Project Settings
2. Click "Integrations"
3. Add Slack or Email
4. Select alerts:
   - Build fails
   - Production deploys
   - High error rates

### MongoDB Alerts

1. Go to Alert Settings
2. Create alerts for:
   - Replication lag > 10 seconds
   - Connection pool exhaustion
   - CPU > 80%
   - Memory > 80%
   - Disk > 90%

---

## 🐛 Common Issues & Solutions

### Issue 1: "Backend Connection Refused"

**Symptoms**:
- Frontend shows "Cannot connect to API"
- Error: ECONNREFUSED or 503

**Diagnosis**:
```bash
# Test backend is running
curl https://your-backend.onrender.com/api/links

# Check Render logs
# Go to Render dashboard > Service > Logs
```

**Solutions**:

1. **Check if service is running**:
   - Render dashboard → Service status
   - Should show "Live"
   - If not, click "Deploy" or check build logs

2. **Check environment variables**:
   - Render dashboard → Environment tab
   - Verify MONGODB_URI is correct
   - Verify JWT_SECRET is set
   - Verify ALLOWED_ORIGINS includes frontend URL

3. **Restart service**:
   - Render dashboard → Manual Deploys
   - Click "Deploy latest commit"

4. **Check MongoDB connection**:
   - MongoDB Atlas → Cluster → Connect
   - Test connection string locally
   - Verify IP is whitelisted (0.0.0.0/0)

### Issue 2: "Frontend shows blank page"

**Symptoms**:
- Vercel URL loads but shows nothing
- Console has errors
- Network tab shows 404s

**Diagnosis**:
```bash
# Check if dist folder exists
ls -la frontend/dist

# Check if build succeeded
npm run build
```

**Solutions**:

1. **Rebuild failed**:
   - Check build logs in Vercel
   - Run `npm run build` locally
   - Fix any TypeScript/build errors
   - Push changes to trigger redeploy

2. **Missing environment variables**:
   - Vercel dashboard → Project → Settings → Environment Variables
   - Verify VITE_API_URL is set
   - VITE_API_URL should start with https://

3. **Wrong API URL**:
   - Frontend won't connect if VITE_API_URL is wrong
   - Should be: `https://your-backend.onrender.com/api`
   - Not: `http://` (must be https)
   - Not: missing `/api`

4. **Clear cache and redeploy**:
   - Vercel dashboard → Deployments
   - Click the latest deployment
   - Click three dots → "Redeploy"

### Issue 3: "MongoDB Connection Timeout"

**Symptoms**:
- Backend crashes with "MongoServerSelectionError"
- Error: "connect ENOTFOUND mongodb+srv://..."
- Render service crashes repeatedly

**Diagnosis**:
```bash
# Test MongoDB connection locally
npm install mongodb
node -e "const MongoClient = require('mongodb').MongoClient; MongoClient.connect('YOUR_MONGODB_URI', (err, client) => { if(err) console.log('Error:', err); else console.log('Connected!'); });"
```

**Solutions**:

1. **IP Whitelist issue**:
   - MongoDB Atlas → Network Access
   - Check if 0.0.0.0/0 is whitelisted
   - If not, add it
   - Wait 5-10 minutes for propagation

2. **Wrong connection string**:
   - Copy exact connection string from Atlas
   - Replace <password> with actual password
   - Replace <database_name> with "linkforge"
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/linkforge?retryWrites=true&w=majority`

3. **Network issue**:
   - Check MongoDB Atlas cluster status
   - Try switching region in connection string
   - Verify Render can reach MongoDB (should auto-work)

4. **Connection pool exhausted**:
   - MongoDB Atlas → Cluster → Connect → Driver
   - Increase connection pool size in connection string
   - Add: `?maxPoolSize=50`

### Issue 4: "502 Bad Gateway" error

**Symptoms**:
- Website shows "502 Bad Gateway"
- Sometimes works, sometimes doesn't
- Error is intermittent

**Diagnosis**:
- Check Render logs for crashes
- Check backend response time
- Check database response time

**Solutions**:

1. **Backend crashed**:
   - Render dashboard → Logs
   - Look for error messages
   - Check if it mentions out of memory
   - Solution: Restart service

2. **Slow database queries**:
   - MongoDB Atlas → Cluster → Performance Advisor
   - Add missing indexes
   - Check slow query logs
   - Optimize queries

3. **Rate limiting**:
   - If many requests, might be rate limited
   - Check `X-RateLimit-Remaining` header
   - Increase rate limit in backend/config
   - Or distribute requests

4. **Timeout issue**:
   - Request takes > 30 seconds (Vercel limit)
   - Optimize queries
   - Add pagination
   - Cache results

### Issue 5: "CORS Error in Browser Console"

**Symptoms**:
- Error: "Access to XMLHttpRequest blocked by CORS policy"
- Frontend can't access backend
- Works locally but not in production

**Diagnosis**:
```bash
# Check CORS headers
curl -i -X GET \
  -H "Origin: https://yourdomain.com" \
  https://your-backend.onrender.com/api/links
```

**Solutions**:

1. **Backend CORS not configured**:
   - Check backend/.env: ALLOWED_ORIGINS
   - Should be: `https://yourdomain.com,https://www.yourdomain.com`
   - Restart backend after change

2. **Frontend URL mismatch**:
   - ALLOWED_ORIGINS must match frontend URL
   - If frontend is yourdomain.com, add yourdomain.com
   - If frontend is www.yourdomain.com, add both

3. **Preflight request failing**:
   - Backend must respond to OPTIONS requests
   - Should return 200 status
   - Should return Access-Control-Allow-* headers
   - Test with curl (see diagnosis)

### Issue 6: "404 Not Found" on page refresh

**Symptoms**:
- Works when clicking links
- Shows 404 when directly visiting URLs
- `/api/links` works but `/dashboard` shows 404

**Diagnosis**:
- This is a single-page app (SPA) routing issue

**Solutions**:

1. **Vercel rewrites not working**:
   - Check `frontend/vercel.json` exists
   - Verify rewrites configured
   - Should rewrite all to index.html
   - Redeploy: `git push`

2. **Vercel configuration**:
   - Vercel dashboard → Project Settings
   - Check Build & Development Settings
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Manual fix**:
   - Go to root domain first
   - Then navigate with links
   - Works because Vue Router handles it

### Issue 7: "Memory limit exceeded"

**Symptoms**:
- Service crashes randomly
- Error: "JavaScript heap out of memory"
- Render logs show OOM kill

**Diagnosis**:
```bash
# Check for memory leaks
node --max-old-space-size=512 app.js
```

**Solutions**:

1. **Upgrade Render plan**:
   - Render dashboard → Settings
   - Upgrade to Starter plan ($7/month)
   - Allows more RAM

2. **Optimize database queries**:
   - Add `.select()` to Mongoose queries
   - Paginate large results
   - Use indexes
   - Limit fields returned

3. **Implement caching**:
   - Cache popular links
   - Use Redis (if needed)
   - Set cache TTL

---

## 📈 Performance Optimization

### Frontend Performance

1. **Check Vercel Performance Metrics**:
   - Largest Contentful Paint (LCP): target < 2.5s
   - First Input Delay (FID): target < 100ms
   - Cumulative Layout Shift (CLS): target < 0.1

2. **Optimize Bundle Size**:
   ```bash
   npm run build -- --report
   npm run analyze
   ```

3. **Common optimizations**:
   - Code splitting
   - Lazy loading routes
   - Image optimization
   - Minify CSS/JS
   - Remove unused dependencies

### Backend Performance

1. **Database Query Optimization**:
   ```javascript
   // Bad - loads all fields
   const links = await Link.find({ userId: id });
   
   // Good - selects only needed fields
   const links = await Link.find({ userId: id })
     .select('title url clicks createdAt')
     .limit(100);
   ```

2. **Implement Caching**:
   ```javascript
   const cache = {};
   
   // Cache user links for 5 minutes
   async function getUserLinks(userId) {
     if (cache[userId]) return cache[userId];
     
     const links = await Link.find({ userId });
     cache[userId] = links;
     
     setTimeout(() => delete cache[userId], 300000);
     return links;
   }
   ```

3. **Use Indexes**:
   ```javascript
   // Add to Mongoose schema
   userIdIndex: {
     type: Schema.ObjectId,
     ref: 'User',
     index: true  // Creates database index
   }
   ```

---

## 🔒 Security Monitoring

### Monitor for Security Issues

1. **Check for unauthorized access**:
   - Review API logs for 401/403 errors
   - Look for repeated failed login attempts
   - Check for unusual traffic patterns

2. **Monitor for injection attacks**:
   - Check logs for suspicious characters
   - Monitor database slow query log
   - Look for unusual query patterns

3. **Check for data breaches**:
   - Verify encryption at rest
   - Verify HTTPS/TLS version
   - Check certificate expiration
   - Monitor for unauthorized data access

### Automated Security Monitoring

```javascript
// Add to backend logger
const securityLog = {
  timestamp: new Date(),
  event: 'unauthorized_access_attempt',
  ip: req.ip,
  endpoint: req.path,
  user: req.user?.id || 'unknown'
};

// Alert if too many failed attempts
if (failedAttempts > 10) {
  sendSecurityAlert('Possible brute force attack', securityLog);
}
```

---

## 📋 Weekly Monitoring Checklist

- [ ] **Monday**: Check error logs for last week
- [ ] **Tuesday**: Review performance metrics
- [ ] **Wednesday**: Test backup restore
- [ ] **Thursday**: Security audit (check logs)
- [ ] **Friday**: Plan for next week's updates

---

## 📞 Escalation Procedures

### Level 1: Monitor
- Check dashboards
- Review recent changes
- Check database health

### Level 2: Alert
- Send Slack/email alert
- Check logs for errors
- Attempt quick fix

### Level 3: Incident
- Conference call with team
- Start incident log
- Begin debugging
- Notify status page

### Level 4: Critical
- All hands on deck
- Start war room call
- Begin rollback planning
- Notify customers

---

## 🆘 Getting Help

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express Docs](https://expressjs.com)

### Community Support
- Stack Overflow: tag your platform
- GitHub Issues: in respective repos
- Reddit: r/webdev, r/node, r/mongodb

### Professional Support
- Render Premium Support
- Vercel Pro Support
- MongoDB Enterprise Support
- Your dedicated DevOps team

---

**Last Updated**: [Date]  
**Status**: 🟢 All Systems Operational  
**Next Review**: [Next Friday]
