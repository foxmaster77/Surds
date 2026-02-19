<<<<<<< HEAD
# MVP SaaS Dashboard

A minimum viable product SaaS dashboard with real-time data visualization.

## Project Structure

```
project/
  backend/
    server.js       # Express server with API endpoint
    package.json    # Backend dependencies
    
  frontend/
    index.html      # Main HTML file
    style.css       # Dark modern dashboard styling
    script.js       # Frontend logic with Chart.js
```

## Setup Instructions

### 1. Install Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing middleware
- `compression` - Response compression for better performance

### 2. Start Backend Server

In the `backend` folder, run:

```bash
npm start
```

The backend will start on **http://localhost:5000**

You should see:
```
Backend server running on http://localhost:5000
API endpoint: http://localhost:5000/api/links
Generated 20000 links
```

**Note:** The backend generates 20,000 links by default to test high-volume scenarios.

### 3. Start Frontend (Live Server)

1. Open VS Code
2. Install the "Live Server" extension if you haven't already
3. Right-click on `frontend/index.html`
4. Select "Open with Live Server"

The frontend will open on **http://localhost:5501**

**OR** manually configure Live Server:
- Set Live Server port to 5501 in VS Code settings
- Open `frontend/index.html` with Live Server

## Features

### Frontend
- ✅ Displays links list dynamically
- ✅ Fetches data from `http://localhost:5000/api/links`
- ✅ Renders Chart.js line chart (clicks over time)
- ✅ Renders Chart.js bar chart (clicks by link)
- ✅ Auto-refreshes data every 5 seconds
- ✅ Shows loading state with spinner
- ✅ Handles fetch errors gracefully
- ✅ Dark modern dashboard styling
- ✅ All JS wrapped in DOMContentLoaded
- ✅ No console errors

### Backend
- ✅ Express server with compression middleware
- ✅ CORS enabled for port 5501
- ✅ GET `/api/links` endpoint with pagination support
- ✅ GET `/api/links/stats` endpoint for summary statistics
- ✅ Returns paginated array of link objects with `short`, `url`, `time`, `clicks`
- ✅ Supports search, sorting, and pagination query parameters
- ✅ Generates 20,000 links by default for testing
- ✅ Simulates live data by increasing clicks every 5 seconds
- ✅ Optimized batch updates for performance
- ✅ Runs on port 5000

## API Endpoints

### GET `/api/links`

Fetches paginated links data with optional filtering and sorting.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100)
- `search` (optional): Search term for short code or URL
- `sortBy` (optional): Sort field - `clicks`, `time`, or `short` (default: `clicks`)
- `order` (optional): Sort order - `asc` or `desc` (default: `desc`)

**Example:** `GET /api/links?page=1&limit=50&sortBy=clicks&order=desc`

**Response:**
```json
{
  "data": [
    {
      "short": "abc123",
      "url": "https://example.com/page1",
      "time": "2026-02-19T10:00:00Z",
      "clicks": 45
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 20000,
    "totalPages": 400,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/api/links/stats`

Fetches summary statistics for all links.

**Response:**
```json
{
  "totalLinks": 20000,
  "totalClicks": 1234567,
  "topClicks": 999,
  "avgClicks": 61,
  "lastUpdated": "2026-02-19T15:30:00Z"
}
```

## Troubleshooting

### Backend not starting
- Make sure port 5000 is not in use
- Check that `npm install` completed successfully
- Verify Node.js is installed (`node --version`)

### Frontend not loading data
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify Live Server is running on port 5501
- Check that the API URL in `script.js` matches your backend port

### Charts not displaying
- Check browser console for Chart.js errors
- Verify internet connection (Chart.js loads from CDN)
- Ensure data is being fetched successfully

## Performance Optimizations

The dashboard is optimized to handle **20,000+ links** efficiently:

### Backend Optimizations
- ✅ Response compression (gzip) for faster data transfer
- ✅ Pagination support (default 100 items per page)
- ✅ Efficient batch updates for live data simulation
- ✅ Search and sorting capabilities
- ✅ Separate stats endpoint to avoid loading full dataset

### Frontend Optimizations
- ✅ Pagination in Manage Links view (50 items per page)
- ✅ Data sampling for charts (max 100 data points)
- ✅ Throttled auto-refresh (only active views refresh)
- ✅ Lazy rendering (views only update when active)
- ✅ Optimized DOM updates
- ✅ Search functionality with debouncing
- ✅ Efficient chart updates with animation

### Performance Tips
- Use pagination when viewing large datasets
- Charts automatically sample data for better performance
- Search filters data server-side for faster results
- Stats endpoint provides quick summaries without loading all data

## Development Notes

- All code is beginner-friendly with comments
- Uses plain HTML/CSS/JS (no frameworks)
- Chart.js loaded via CDN
- Backend simulates live data updates
- Frontend auto-refreshes every 5 seconds (throttled)
- Optimized for handling 20,000+ links efficiently
=======
# Surds
>>>>>>> a0dccbb62bda413f2ffa1716f301eda0653f3dac
