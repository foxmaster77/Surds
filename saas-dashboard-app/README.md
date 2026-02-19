# 🚀 SaaS Dashboard - Complete Setup Guide

A modern, fully-functional SaaS dashboard web application with real-time updates, responsive design, and professional dark theme.

## 📋 Features

✅ **Modern Dark Theme UI** - Professional corporate dark design  
✅ **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile  
✅ **Real-time Updates** - Socket.io integration for instant notifications  
✅ **Live Polling** - Fetches data every 5 seconds  
✅ **Interactive Charts** - Chart.js donut chart with team distribution  
✅ **Authentication** - JWT-based login and registration  
✅ **Activity Panels** - Upcoming talks, meetings, and shoutouts  
✅ **Socket.io Events** - Real-time talk, meeting, and shoutout broadcasts  

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Chart.js 3.x for charts
- Socket.io client for real-time updates

**Backend:**
- Node.js 18+
- Express.js 4.18
- MongoDB with Mongoose 7.0
- JWT authentication (jsonwebtoken 9.0)
- Socket.io 4.5
- bcryptjs for password hashing

## 📦 Prerequisites

### Required
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** running locally or cloud connection
  - Local: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
  - Cloud: Use MongoDB Atlas (free tier available)

### Verify Installation
```bash
node --version      # Should be v18+
npm --version       # Should be 8+
mongod --version    # Should be 5.0+
```

## 🚀 Quick Start (5 minutes)

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start MongoDB (in a separate terminal if local)
mongod

# Seed the database with test data
npm run seed

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

You should see:
```
✨ Server running on port 5000
📊 Connected to MongoDB
🌱 Database seeded successfully
```

### Step 2: Setup Frontend

**Option A: Using Live Server (Recommended)**
1. Install VS Code extension: "Live Server" by Ritwick Dey
2. Right-click on `frontend/index.html`
3. Click "Open with Live Server"
4. Browser opens to `http://127.0.0.1:5501`

**Option B: Using Python**
```bash
cd frontend
python -m http.server 5501
# Open http://127.0.0.1:5501
```

**Option C: Using Node.js**
```bash
cd frontend
npx http-server -p 5501
# Open http://127.0.0.1:5501
```

### Step 3: Login to Dashboard

Use the demo credentials:
- **Email:** `alex@example.com`
- **Password:** `password123`

Or create a new account by clicking "Register"

## 📁 Project Structure

```
saas-dashboard-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login/Register logic
│   │   └── dashboardController.js # Dashboard data aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Team.js               # Team schema
│   │   ├── Talk.js               # Talk schema
│   │   ├── Meeting.js            # Meeting schema
│   │   └── Shoutout.js           # Shoutout schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   └── dashboard.js          # Dashboard endpoint
│   ├── .env                       # Environment configuration
│   ├── package.json              # Dependencies
│   ├── seed.js                   # Database seeder
│   └── server.js                 # Main Express server
│
└── frontend/
    ├── index.html                # HTML structure
    ├── style.css                 # Styling & responsive
    └── script.js                 # JavaScript logic
```

## 🔌 API Endpoints

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "...",
    "role": "user"
  }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "password123"
}
```

Response: Same as register

### Dashboard

**Get Dashboard Data** (Requires JWT)
```http
GET /api/dashboard
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "user": { "name": "...", "email": "...", "avatar": "...", "role": "..." },
  "stats": {
    "teams": 5,
    "users": 68,
    "talks": 3,
    "meetings": 4
  },
  "teamDistribution": {
    "labels": ["Design", "Engineering", "Marketing", "Sales", "HR"],
    "data": [12, 28, 8, 15, 5],
    "colors": ["#6c63ff", "#ff6b6b", "#ffd93d", "#6bcf7f", "#ff9ff3"]
  },
  "upcomingTalks": [...],
  "meetings": [...],
  "shoutouts": [...]
}
```

## 🔄 Real-Time Features

### Socket.io Events

**Server → Client Events:**
- `user-count` - Number of users online
- `talk-added` - New talk created
- `meeting-added` - New meeting created
- `shoutout-added` - New shoutout created

**Example:**
```javascript
socket.on('talk-added', (talkData) => {
  console.log('New talk:', talkData);
  fetchDashboard(); // Refresh dashboard
});
```

### Polling

Frontend automatically polls backend every 5 seconds:
```javascript
setInterval(fetchDashboard, 5000); // 5 second interval
```

## 📊 Dashboard Sections

### 1. **Welcome Banner**
- User greeting with time-based message
- Quick action buttons

### 2. **Stats Cards**
- Teams count
- Total users
- Upcoming talks
- Scheduled meetings

### 3. **Team Distribution Chart**
- Donut chart showing team member distribution
- Interactive legend
- Real-time updates

### 4. **Activity Panels**
- **Upcoming Talks** - Conferences and presentations
- **Upcoming Meetings** - Scheduled meetings with attendee count
- **Shoutouts** - Team celebrations and appreciation

## 🎨 Theming

The dashboard uses CSS variables for easy customization:

```css
:root {
    --bg-dark: #0f1117;
    --bg-secondary: #1c1f26;
    --accent-primary: #6c63ff;  /* Purple */
    --accent-secondary: #ff6b6b; /* Red */
    --success: #6bcf7f;         /* Green */
    --warning: #ffd93d;         /* Yellow */
}
```

To customize colors, edit `frontend/style.css` variables.

## 🚨 Troubleshooting

### Backend won't start

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`
- **Solution:** Make sure MongoDB is running
  ```bash
  mongod
  ```
  Or update `MONGODB_URI` in `.env` to your MongoDB Atlas connection

**Error:** `Port 5000 already in use`
- **Solution:** Change PORT in `.env` file or kill the process
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Frontend won't connect to backend

**Error:** `Failed to fetch from http://localhost:5000`
- **Solution:** 
  1. Verify backend is running: `http://localhost:5000/health` should return `ok`
  2. Check if port 5000 is accessible
  3. Verify CORS is enabled (should be in server.js)

### Socket.io disconnecting

**Error:** `Socket disconnected` keeps appearing
- **Solution:**
  1. Check backend is running and has Socket.io enabled
  2. Verify firewall isn't blocking port 5000
  3. Check browser console for specific errors

### Chart not rendering

**Error:** Chart.js canvas is empty
- **Solution:**
  1. Check browser console for errors
  2. Verify dashboard data is loading (check Network tab in DevTools)
  3. Ensure Chart.js CDN is loaded in index.html

### Login fails

**Error:** `Cannot POST /api/auth/login`
- **Solution:** Backend server isn't running, start it first
  ```bash
  cd backend
  npm start
  ```

## 🔐 Security

### JWT Token
- Tokens expire after 24 hours
- Change `JWT_SECRET` in `.env` for production
- Tokens stored in browser localStorage (not recommended for production - use httpOnly cookies)

### Password Hashing
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never stored in plain text

### CORS
- Frontend URL configured in `.env`: `FRONTEND_URL=http://localhost:5501`
- Update for production deployment

## 📝 Environment Variables

Create/update `.env` in backend folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/saas-dashboard

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5501
```

## 🧪 Testing Features

### Login with Demo Account
- Email: `alex@example.com`
- Password: `password123`
- Includes sample teams, talks, meetings, and shoutouts

### Create New Account
- Click "Register" tab
- Fill in name, email, password
- Account created immediately with demo data linked

### Real-time Testing
1. Open dashboard in two browser tabs
2. Socket.io connection shown as green dot
3. Watch "users online" counter update
4. Notifications broadcast to all connected clients

### External API Polling
- Uncomment Pokemon fetch in `script.js` to see external API polling
- Updates live every 10 seconds (example feature)

## 🚀 Production Deployment

### Backend (Heroku/Railway)
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas for database
4. Deploy using Git/CLI

### Frontend (Vercel/Netlify)
1. Update API_BASE in `script.js` to production backend
2. Deploy frontend separately
3. Update CORS settings in backend

## 📚 API Response Examples

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

## 💡 Tips & Tricks

- **Fast refresh:** Ctrl+Shift+R to hard refresh cache
- **DevTools:** F12 → Console to see polling/socket events
- **Network tab:** Monitor API calls and Socket.io connections
- **Responsive design:** Drag browser window smaller to test mobile view

## 🎯 Features Implemented

✅ Sidebar navigation with 7 menu items  
✅ Welcome banner with user profile  
✅ 4 stats cards with live data  
✅ Interactive donut chart (Team Distribution)  
✅ 3 activity panels (Talks, Meetings, Shoutouts)  
✅ JWT authentication (Login/Register)  
✅ Responsive design (Desktop, Tablet, Mobile)  
✅ Dark corporate theme  
✅ Socket.io real-time updates  
✅ 5-second polling for live data  
✅ Error handling and loading states  
✅ Smooth animations and transitions  
✅ User online counter  
✅ Connection status indicator  
✅ Seed data script  

## 🐛 Known Limitations

- localStorage used for token storage (security consideration)
- No refresh token rotation
- Charts update with full refresh (not incremental)
- Limited to single MongoDB instance

## 📞 Support

For issues:
1. Check console for error messages (F12 → Console)
2. Verify backend is running: `curl http://localhost:5000/health`
3. Check network requests in DevTools
4. Review the Troubleshooting section above

## 📄 License

MIT - Feel free to use for personal and commercial projects

---

**Ready to start?** Follow the Quick Start section above and you'll have a fully functional dashboard running in 5 minutes! 🎉
