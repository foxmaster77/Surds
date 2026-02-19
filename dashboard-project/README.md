# 📊 Full Stack SaaS Dashboard

A complete, production-ready SaaS dashboard application with JWT authentication, link management, and analytics.

## 🎯 Features

✅ **User Authentication**
- JWT-based login/register
- Secure password hashing with bcrypt
- Token stored in localStorage

✅ **Link Management**
- Create short links
- Track clicks
- Delete links
- Real-time updates

✅ **Analytics**
- Line chart for click trends
- Bar chart for top links
- Real-time data visualization

✅ **Modern UI**
- Dark theme SaaS design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations & hover effects
- Professional styling

✅ **Security**
- Protected routes with JWT middleware
- Password hashing with bcrypt
- CORS enabled
- User-specific data isolation

---

## 📁 Project Structure

```
dashboard-project/
│
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   │
│   ├── models/
│   │   ├── User.js            # User schema & methods
│   │   └── Link.js            # Link schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Login/Register endpoints
│   │   └── linkRoutes.js      # Link CRUD endpoints
│   │
│   └── middleware/
│       └── auth.js            # JWT verification middleware
│
└── frontend/
    ├── index.html             # HTML structure
    ├── style.css              # Dark theme styling
    └── script.js              # Application logic
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd dashboard-project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Edit `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/dashboard-db
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   mongod
   ```

5. **Run server**
   ```bash
   npm start          # Production
   npm run dev        # Development (with nodemon)
   ```

   Server runs on: `http://localhost:5000`

### Frontend Setup

1. **Open frontend folder**
   ```bash
   cd dashboard-project/frontend
   ```

2. **Start a local server** (important for CORS)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node's http-server
   npx http-server
   ```

   Frontend runs on: `http://localhost:8000`

3. **Open in browser**
   ```
   http://localhost:8000
   ```

---

## 📡 API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "123...",
    "email": "user@example.com"
  }
}
```

### Links (Protected - Requires JWT)

**GET** `/api/links`
- Headers: `Authorization: Bearer {token}`
- Returns user's links

**POST** `/api/links`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "short": "mylink", "url": "https://example.com" }`
- Creates new link

**DELETE** `/api/links/:id`
- Headers: `Authorization: Bearer {token}`
- Deletes link by ID

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing with salt rounds
- Passwords never stored in plain text

✅ **JWT Authentication**
- Token-based stateless auth
- Expires in 7 days
- Verified on protected routes

✅ **Authorization**
- Users can only access their own links
- Delete operations validated

✅ **CORS Protection**
- Configured for development

---

## 🎨 UI Components

### Login/Register Page
- Email & password input
- Tab-based auth switching
- Error messages
- Dark SaaS theme

### Dashboard
- **Sidebar Navigation**
  - Links (default)
  - Analytics
  - Settings

- **Top Search Bar**
  - Real-time filtering
  - Instant results

- **Links Section**
  - Grid layout
  - Create link modal
  - Delete button
  - Click counter

- **Analytics Section**
  - Line chart (click trends)
  - Bar chart (top links)
  - Real-time updates

- **Settings Section**
  - Account info
  - Password change option
  - Account deletion

---

## 🛠️ Technology Stack

**Frontend**
- HTML5
- CSS3 (Dark theme, Responsive)
- Vanilla JavaScript (No frameworks)
- Chart.js (Data visualization)

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt

**Security**
- CORS
- Environment variables (dotenv)
- Password hashing

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/dashboard-db
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
```

---

## 🚢 Deployment Ready

This project is ready for deployment to:

**Backend**
- Heroku
- Render
- AWS/Azure
- DigitalOcean

**Frontend**
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### Pre-deployment Checklist
- [ ] Change `JWT_SECRET` to strong random key
- [ ] Update `MONGODB_URI` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Update API_URL in frontend script.js to production URL
- [ ] Enable CORS for production domain
- [ ] Test all functionality

---

## 🐛 Troubleshooting

**CORS Error**
- Ensure backend is running
- Check API_URL in script.js matches backend URL
- Verify CORS is enabled in server.js

**MongoDB Connection Error**
- Verify MongoDB is running
- Check MONGODB_URI in .env
- For cloud DB, ensure IP whitelist includes your connection

**Token Expired**
- Token expires in 7 days
- User must login again
- Consider implementing token refresh

**Links Not Loading**
- Verify token is valid
- Check network tab in DevTools
- Ensure backend is responding

---

## 📊 Database Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Link Model
```javascript
{
  short: String (unique, required),
  url: String (required),
  time: String,
  clicks: Number (default: 0),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Chart.js Docs](https://www.chartjs.org/)

---

## 📄 License

MIT License - Feel free to use in your projects!

---

## 🤝 Contributing

Contributions welcome! Feel free to fork and submit PRs.

---

## 💡 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Link analytics (browser, device, location)
- [ ] Link expiration
- [ ] API rate limiting
- [ ] Two-factor authentication
- [ ] Social login
- [ ] Dark mode toggle
- [ ] Export data as CSV
- [ ] Mobile app (React Native)

---

## 📞 Support

Having issues? Check the troubleshooting section or create an issue!

Happy coding! 🚀
