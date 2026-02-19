# LinkForge Frontend Setup & Run Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs all required packages:
- React & React DOM
- Vite build tool
- TailwindCSS & PostCSS
- Axios for API calls
- React Router for navigation
- Chart.js for charts
- Lucide icons

### 2. Start Development Server

```bash
npm run dev
```

Browser opens automatically at `http://localhost:3000`

### 3. Backend Must Be Running

Ensure backend is running on `http://localhost:5000`:

```bash
cd ../backend
npm install
npm start
```

## 🧪 Test Credentials

**Email:** `admin@example.com`  
**Password:** `password123`

## 📱 Features to Test

### 1. **Authentication** ✅
- Click "Sign up" to create account
- Use login credentials
- Token stored in localStorage
- Logout clears token

### 2. **Dashboard** ✅
- View all your links
- See total clicks & statistics
- Dark SaaS theme
- Responsive on mobile

### 3. **Create Link** ✅
- Click "New Link" button
- Enter title and URL
- Link added to dashboard
- Charts update automatically

### 4. **Charts & Analytics** ✅
- Line chart shows last 7 days
- Doughnut chart shows top links
- Real-time data updates

### 5. **Link Management** ✅
- Copy short link to clipboard
- Visit original URL
- Delete links
- Ownership verification

### 6. **Navigation** ✅
- Sidebar navigation on desktop
- Mobile hamburger menu
- Protected routes
- Auto-redirect on logout

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#6c63ff',      // Change purple
  secondary: '#ff6b9d',    // Change pink
  success: '#10b981',      // Change green
}
```

### Add New Pages

1. Create `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
   ```javascript
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add sidebar link in `src/components/Sidebar.jsx`

### Add API Endpoints

Edit `src/services/api.js`:

```javascript
export const newAPI = {
  getAll: () => api.get('/new-endpoint'),
  create: (data) => api.post('/new-endpoint', data),
}
```

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code quality
```

## 📦 Production Build

```bash
npm run build
```

Creates optimized `dist/` folder for deployment.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
```

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

### Backend CORS Error
- Ensure backend has `cors()` middleware
- Backend should be on `http://localhost:5000`

### Charts Not Showing
- Verify analytics data from API
- Check browser console for errors

### Token Not Persisting
- Check localStorage in DevTools
- Clear browser cache
- Ensure token endpoint works

## 📊 Browser DevTools Tips

1. **React DevTools** - Inspect components
2. **Network Tab** - Monitor API calls
3. **Console** - Debug errors
4. **Application → Storage** - View localStorage

## 🎯 Next Steps

✅ Run `npm install`  
✅ Start backend server  
✅ Run `npm run dev`  
✅ Test with credentials  
✅ Explore dashboard  
✅ Create custom links  
✅ Deploy to production!

---

**Happy coding! 🚀**
