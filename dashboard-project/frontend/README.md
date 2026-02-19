# React Frontend for LinkForge

Professional SaaS dashboard built with React, Vite, TailwindCSS, and modern best practices.

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js & react-chartjs-2** - Data visualization
- **Lucide React** - Beautiful icons
- **Context API** - State management

## 🎯 Features

✨ **Authentication**
- Login & Register pages
- JWT token storage in localStorage
- Protected routes with automatic redirects
- Axios interceptors for token attachment

🎨 **UI/UX**
- Dark SaaS theme with custom Tailwind config
- Responsive design (mobile-first)
- Smooth animations and transitions
- Modern component library
- Professional color scheme

📊 **Dashboard**
- Link management (create, read, delete)
- Real-time statistics
- Interactive charts (line & doughnut)
- Click tracking
- Responsive grid layout

🔐 **Security**
- Protected routes
- Automatic logout on 401 errors
- Token-based authentication
- CORS support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend server running on localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Authentication page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Analytics.jsx      # Analytics page
│   │   └── Settings.jsx       # User settings
│   ├── components/
│   │   ├── DashboardLayout.jsx    # Layout wrapper
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   ├── LinkCard.jsx           # Link display card
│   │   ├── Charts.jsx             # Analytics charts
│   │   ├── AddLinkModal.jsx       # Create link modal
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication state
│   ├── services/
│   │   └── api.js            # Axios configuration & API calls
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies

```

## 🎨 Tailwind Customization

Custom dark theme colors defined in `tailwind.config.js`:
- Primary: `#6c63ff` (purple)
- Secondary: `#ff6b9d` (pink)
- Success: `#10b981` (green)
- Dark palette: `dark-50` to `dark-950`

Predefined utility classes:
- `.btn-primary` / `.btn-secondary` / `.btn-danger`
- `.card` / `.card-hover`
- `.input-field`
- `.badge` / `.badge-pro` / `.badge-enterprise`

## 🔌 API Integration

Connects to backend API at `http://localhost:5000/api`

### Endpoints Used

**Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

**Links**
- `GET /api/links` - Get all links
- `POST /api/links` - Create link
- `DELETE /api/links/:id` - Delete link
- `GET /api/links/analytics` - Get analytics
- `GET /api/links/:shortCode` - Redirect to original URL

## 🔐 Authentication Flow

1. User fills login/register form
2. Form submitted to backend API
3. Backend returns JWT token
4. Token stored in localStorage
5. Axios interceptor adds token to all requests
6. Protected routes verify authentication
7. Automatic redirect to login if token invalid

## 📊 State Management

**Context API** (AuthContext):
- `user` - Current user data
- `token` - JWT token
- `loading` - Request loading state
- `error` - Error messages
- Methods: `login()`, `register()`, `logout()`

Local component state for UI:
- Modal visibility
- Form inputs
- Loading states
- Error messages

## 🎯 Component Hierarchy

```
App
├── AuthProvider
│   ├── Router
│   │   ├── Login / Register (public)
│   │   └── ProtectedRoute
│   │       ├── Dashboard
│   │       ├── Analytics
│   │       └── Settings
│   │           └── DashboardLayout
│   │               ├── Sidebar
│   │               ├── DashboardLayout (header)
│   │               ├── Charts
│   │               ├── LinkCard (multiple)
│   │               └── AddLinkModal
```

## 🌐 Environment Variables

Create `.env` file if needed:

```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Build
```bash
npm run build
```

Produces optimized `dist/` folder ready for deployment.

### Hosting Options
- **Vercel** - Git integration, serverless functions
- **Netlify** - Git integration, CDN
- **GitHub Pages** - Static site hosting
- **AWS S3 + CloudFront** - Scalable CDN
- **Docker** - Containerized deployment

### Build Optimization
- Vite produces optimized production build
- Code splitting per route
- Minified CSS and JavaScript
- Tree-shaking of unused code

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend has CORS enabled
- Check backend is running on port 5000

### 401 Unauthorized
- Token may be expired
- Try logging in again
- Check browser console for API errors

### Blank Page
- Check browser console for errors
- Verify Node version is 16+
- Clear browser cache and reinstall node_modules

## 📝 Development Tips

- Use React Developer Tools browser extension
- Open DevTools Network tab to inspect API calls
- Check localStorage for token debugging
- Use `npm run build` before deploying

## 🤝 Contributing

Extend the frontend by:
1. Adding new pages in `src/pages/`
2. Creating reusable components in `src/components/`
3. Adding API methods in `src/services/api.js`
4. Updating routes in `src/App.jsx`

## 📄 License

Built for LinkForge SaaS Platform

---

**Ready for production!** 🚀
