# ❓ FAQ & Troubleshooting

## Frequently Asked Questions

### General Questions

**Q: What browsers are supported?**
A: Modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript and WebSocket support.

**Q: Can I run this on Windows/Mac/Linux?**
A: Yes! Works on all operating systems with Node.js installed.

**Q: What's the minimum Node.js version required?**
A: Node.js 18+. Check version with `node --version`.

**Q: Can I modify the UI colors?**
A: Yes! Edit CSS variables in `frontend/style.css` under `:root`.

**Q: How do I change the polling interval?**
A: Edit `frontend/script.js`, line ~25: `const POLL_INTERVAL = 5000;` (in milliseconds).

**Q: Is this production-ready?**
A: Yes, but review DEPLOYMENT.md for production recommendations.

---

## Setup Issues

### ❌ "Cannot find module 'express'"

**Cause:** npm dependencies not installed

**Solution:**
```bash
cd backend
npm install
# Wait for completion
npm start
```

---

### ❌ "ECONNREFUSED 127.0.0.1:27017"

**Cause:** MongoDB not running

**Solution:**
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start backend
cd backend
npm start
```

Or use MongoDB Atlas (cloud):
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Update `.env`: `MONGODB_URI=mongodb+srv://...`

---

### ❌ "Port 5000 already in use"

**Cause:** Another application using port 5000

**Solution (Windows):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Output: TCP    127.0.0.1:5000   0.0.0.0:0   LISTENING   12345

# Kill process (replace 12345 with PID)
taskkill /PID 12345 /F
```

**Solution (Mac/Linux):**
```bash
lsof -i :5000
kill -9 <PID>
```

**Alternative:** Change port in `.env`: `PORT=3000`

---

### ❌ "npm ERR! code ERESOLVE"

**Cause:** npm version conflict

**Solution:**
```bash
# Use npm 8 (comes with Node.js 18)
npm --version  # Should be 8+

# Or update npm
npm install -g npm@latest

# Then try again
npm install
```

---

### ❌ "Unexpected token < in JSON at position 0"

**Cause:** HTML returned instead of JSON (backend not running)

**Solution:**
1. Start backend: `npm start` in backend folder
2. Verify: `curl http://localhost:5000/health`
3. Should return: `{"status":"ok"}`

---

## Frontend Issues

### ❌ "Cannot GET /api/dashboard"

**Cause:** Backend not running or wrong URL

**Solution:**
1. **Verify backend running:**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"ok"}
   ```

2. **Check API_BASE in script.js:**
   ```javascript
   console.log('API:', API_BASE);
   // Should be: http://localhost:5000/api
   ```

3. **Verify CORS:**
   - Backend `.env`: `FRONTEND_URL=http://127.0.0.1:5501`
   - Frontend running on `http://127.0.0.1:5501` (not `localhost:5501`)

---

### ❌ "Dashboard not loading / blank page"

**Cause:** JavaScript errors or token not found

**Solution:**
1. **Open DevTools:**
   - Press F12
   - Go to Console tab
   - Look for red errors

2. **Check token:**
   ```javascript
   // In console:
   localStorage.getItem('token')
   // Should return: eyJhbGciOiJIUzI1NiIs...
   ```

3. **Check network requests:**
   - DevTools → Network tab
   - Look for failed requests (red 404/401)
   - Click on request to see error details

---

### ❌ "Chart not showing"

**Cause:** Chart.js CDN not loaded or canvas empty

**Solution:**
1. **Check HTML:**
   ```html
   <!-- Should have in index.html -->
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   <canvas id="teamChart"></canvas>
   ```

2. **Check console for errors:**
   - F12 → Console tab
   - Look for Chart.js errors

3. **Verify data loading:**
   ```javascript
   // In console:
   console.log(dashboardData)
   // Should show dashboard data object
   ```

---

### ❌ "Cannot GET http://127.0.0.1:5501"

**Cause:** Frontend server not running

**Solution (Option 1 - Live Server):**
1. Install extension: "Live Server" by Ritwick Dey
2. Right-click `index.html`
3. Click "Open with Live Server"

**Solution (Option 2 - Python):**
```bash
cd frontend
python -m http.server 5501
# Open http://127.0.0.1:5501
```

**Solution (Option 3 - Node.js):**
```bash
cd frontend
npx http-server -p 5501
# Open http://127.0.0.1:5501
```

---

### ❌ "Socket.io connection fails / red indicator"

**Cause:** Backend not running or WebSocket blocked

**Solution:**
1. **Verify backend:**
   ```bash
   npm start  # in backend folder
   ```

2. **Check firewall:**
   - Windows Defender may block WebSocket
   - Allow `node.exe` through firewall

3. **Check console errors:**
   ```javascript
   // Should see in console:
   // ✅ Socket connected
   ```

4. **Verify Socket.io enabled:**
   - Check `backend/server.js` has Socket.io setup
   - Look for: `const io = require('socket.io')`

---

## Authentication Issues

### ❌ "Login failed"

**Cause:** Wrong credentials or backend error

**Solution:**
1. **Check credentials:**
   - Email: `alex@example.com`
   - Password: `password123`
   - **Case-sensitive!**

2. **Verify data seeded:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Check database:**
   ```javascript
   // Connect to MongoDB and check:
   db.users.find()
   ```

---

### ❌ "401 Unauthorized"

**Cause:** JWT token invalid or expired

**Solution:**
1. **Clear storage:**
   ```javascript
   // In console:
   localStorage.clear()
   // Then refresh page and login again
   ```

2. **Check token expiry:**
   - Tokens expire after 24 hours
   - Must login again after expiry

3. **Verify JWT_SECRET:**
   - `.env`: `JWT_SECRET=...`
   - Must be same on all backend runs

---

### ❌ "Register not working"

**Cause:** Validation error or email already exists

**Solution:**
1. **Check all fields:**
   - Name (required)
   - Email (required, unique)
   - Password (required, 6+ chars)

2. **Email already exists:**
   - Use different email: `newuser@example.com`
   - Or clear database: `npm run seed`

3. **Check console:**
   - F12 → Console tab
   - See validation error message

---

## Data Issues

### ❌ "No data showing / empty dashboard"

**Cause:** Seed not run or data not linked

**Solution:**
1. **Run seed script:**
   ```bash
   cd backend
   npm run seed
   # Output should show: ✨ Database seeded successfully!
   ```

2. **Verify login:**
   - Must login to see data
   - Use: `alex@example.com` / `password123`

3. **Check MongoDB:**
   ```bash
   # In MongoDB client:
   db.users.findOne()  # Should return user data
   db.teams.find()     # Should return 5 teams
   ```

---

### ❌ "Data not updating"

**Cause:** Polling not working or Socket.io issue

**Solution:**
1. **Check polling:**
   ```javascript
   // In console, should see every 5s:
   // 📊 Dashboard updated
   // [API response logged]
   ```

2. **Check interval:**
   - Should be 5000ms (5 seconds)
   - Edit in `frontend/script.js` if needed

3. **Monitor network:**
   - DevTools → Network tab
   - Filter by "fetch"
   - Should see `/api/dashboard` requests every 5s

---

### ❌ "Charts not updating"

**Cause:** Chart not re-rendering or data not changing

**Solution:**
1. **Force refresh:**
   ```javascript
   // In console:
   fetchDashboard()
   // Then manually trigger chart update
   ```

2. **Check chart instance:**
   ```javascript
   // In console:
   console.log(window.teamChartInstance)
   // Should show Chart.js chart object
   ```

3. **Manually add data:**
   - Add new team to database
   - Chart should update on next poll

---

## Performance Issues

### ❌ "Dashboard is slow / laggy"

**Cause:** Too many queries or large dataset

**Solution:**
1. **Reduce polling interval:**
   ```javascript
   // In frontend/script.js, change from 5000 to 10000 (10s)
   const POLL_INTERVAL = 10000;
   ```

2. **Limit data:**
   ```javascript
   // In backend/controllers/dashboardController.js
   // Reduce limit from 10 to 5 for shoutouts
   .limit(5)
   ```

3. **Add caching:**
   ```javascript
   // In backend, add express-cache-middleware
   npm install express-cache-middleware
   ```

---

### ❌ "High memory usage"

**Cause:** Memory leak or too many connections

**Solution:**
1. **Restart backend:**
   ```bash
   # Stop: Ctrl+C
   # Start: npm start
   ```

2. **Check Socket.io connections:**
   ```javascript
   // In console (browser):
   socket.on('user-count', (count) => {
     console.log('Users:', count)
   })
   ```

3. **Clear browser cache:**
   - DevTools → Application → Clear storage

---

## API Issues

### ❌ "CORS error"

**Cause:** Frontend and backend domains don't match

**Solution:**
1. **Check FRONTEND_URL:**
   ```env
   # backend/.env
   FRONTEND_URL=http://127.0.0.1:5501
   ```

2. **Use correct URL:**
   - Not `localhost:5501` (use `127.0.0.1:5501`)
   - Not `localhost:3000` (use `127.0.0.1:5501`)

3. **Verify server.js:**
   ```javascript
   // Should have CORS enabled
   const cors = require('cors');
   app.use(cors({
     origin: process.env.FRONTEND_URL
   }));
   ```

---

### ❌ "404 endpoint not found"

**Cause:** Wrong API path or backend not running

**Solution:**
1. **Verify endpoints exist:**
   ```bash
   curl http://localhost:5000/api/auth/login
   curl http://localhost:5000/api/dashboard
   curl http://localhost:5000/health
   ```

2. **Check backend running:**
   ```bash
   npm start  # in backend folder
   ```

3. **Verify routes registered:**
   - Check `backend/server.js` has:
   ```javascript
   app.use('/api/auth', require('./routes/auth'));
   app.use('/api', require('./routes/dashboard'));
   ```

---

### ❌ "500 server error"

**Cause:** Backend exception or unhandled error

**Solution:**
1. **Check backend logs:**
   ```bash
   # Terminal where backend running should show error
   # Look for red text in output
   ```

2. **Check MongoDB connection:**
   ```bash
   mongod  # Make sure running
   ```

3. **Check console.log:**
   - Add logging: `console.log('Debug:', variable)`
   - Restart backend: `npm start`
   - Trigger endpoint again
   - Read output for error

---

## Development Tips

### Debugging

**Enable debug logging:**
```javascript
// In server.js
const debug = require('debug')('app');
debug('Server started');

// Run with: DEBUG=* npm start
```

**Monitor requests:**
```bash
# Terminal: Start backend with logging
NODE_DEBUG=http npm start

# Watch MongoDB queries
mongo --eval "db.setProfilingLevel(1)" saas-dashboard
```

### Testing API Locally

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'

# Test dashboard (replace TOKEN)
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer <token-from-login>"

# Test health
curl http://localhost:5000/health
```

### Frontend Testing

```javascript
// Test API in console
fetch('http://localhost:5000/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

---

## Still Having Issues?

### Checklist

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm dependencies installed: `npm install`
- [ ] MongoDB running: `mongod` or MongoDB Atlas
- [ ] Backend started: `npm start` (from backend folder)
- [ ] Frontend running: `http://127.0.0.1:5501` (not localhost!)
- [ ] DevTools console checked: F12 → Console
- [ ] Network tab checked: F12 → Network
- [ ] Seed ran: `npm run seed`
- [ ] Test credentials used: `alex@example.com` / `password123`
- [ ] Browser cache cleared: Ctrl+Shift+Delete

### Collect Diagnostics

1. **Backend logs:**
   ```bash
   # Run and capture output
   npm start 2>&1 | tee backend.log
   ```

2. **Browser console errors:**
   - F12 → Console → Copy all errors

3. **Network request failures:**
   - F12 → Network → Find red requests → Copy details

4. **MongoDB connection test:**
   ```bash
   mongo "mongodb://localhost:27017"
   # or
   mongo "mongodb+srv://..."
   ```

### Contact Support

If still stuck:
1. Review README.md and QUICK_START.md
2. Check ARCHITECTURE.md for system overview
3. Enable debug logging
4. Collect all diagnostics above
5. Check error messages in browser console

---

**Most common issues solved by:**
1. Starting MongoDB: `mongod`
2. Running seed: `npm run seed`
3. Using correct URL: `http://127.0.0.1:5501` (not localhost!)
4. Starting backend: `npm start`
5. Checking browser console: F12 → Console

Good luck! 🚀
