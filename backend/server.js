// Backend server for MVP SaaS Dashboard
// Optimized to handle 20,000+ requests
// Runs on port 5000

const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = 5000;

// Enable compression for better performance
app.use(compression());

// Enable CORS for frontend on port 5501
app.use(cors({
  origin: 'http://localhost:5501',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Generate 20,000 links for testing high-volume scenarios
function generateLinksData(count = 20000) {
  const links = [];
  const baseDate = new Date('2026-01-01T00:00:00Z');
  
  for (let i = 0; i < count; i++) {
    const short = generateShortCode(i);
    const url = `https://example.com/page${i + 1}`;
    const time = new Date(baseDate.getTime() + i * 60000); // 1 minute apart
    const clicks = Math.floor(Math.random() * 1000) + 1;
    
    links.push({
      short,
      url,
      time: time.toISOString(),
      clicks
    });
  }
  
  return links;
}

// Generate unique short code
function generateShortCode(index) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  let num = index;
  
  // Convert index to base36-like string
  do {
    code = chars[num % chars.length] + code;
    num = Math.floor(num / chars.length);
  } while (num > 0);
  
  // Pad to at least 6 characters
  while (code.length < 6) {
    code = 'a' + code;
  }
  
  return code.substring(0, 8); // Max 8 chars
}

// Initialize with 20,000 links
let linksData = generateLinksData(20000);
console.log(`Generated ${linksData.length} links`);

// Simulate live data by increasing clicks every 5 seconds (optimized batch update)
setInterval(() => {
  // Update in batches for better performance
  const batchSize = 1000;
  for (let i = 0; i < linksData.length; i += batchSize) {
    const batch = linksData.slice(i, i + batchSize);
    batch.forEach(link => {
      // Randomly increase clicks by 1-5
      link.clicks += Math.floor(Math.random() * 5) + 1;
    });
  }
  console.log(`Updated clicks for ${linksData.length} links`);
}, 5000);

// GET /api/links endpoint with pagination support
app.get('/api/links', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100; // Default 100 items per page
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || 'clicks'; // clicks, time, short
  const order = req.query.order || 'desc'; // asc, desc
  
  // Filter by search term if provided
  let filteredData = linksData;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = linksData.filter(link => 
      link.short.toLowerCase().includes(searchLower) ||
      link.url.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort data
  filteredData = [...filteredData].sort((a, b) => {
    let aVal, bVal;
    
    switch(sortBy) {
      case 'clicks':
        aVal = a.clicks;
        bVal = b.clicks;
        break;
      case 'time':
        aVal = new Date(a.time).getTime();
        bVal = new Date(b.time).getTime();
        break;
      case 'short':
        aVal = a.short.toLowerCase();
        bVal = b.short.toLowerCase();
        break;
      default:
        aVal = a.clicks;
        bVal = b.clicks;
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  // Return paginated response
  res.json({
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
  
  console.log(`GET /api/links - Page ${page}/${totalPages}, Returning ${paginatedData.length} links (Total: ${total})`);
});

// GET /api/links/stats endpoint for summary statistics (optimized)
app.get('/api/links/stats', (req, res) => {
  const totalLinks = linksData.length;
  const totalClicks = linksData.reduce((sum, link) => sum + link.clicks, 0);
  const topClicks = Math.max(...linksData.map(link => link.clicks));
  const avgClicks = Math.round(totalClicks / totalLinks);
  
  res.json({
    totalLinks,
    totalClicks,
    topClicks,
    avgClicks,
    lastUpdated: new Date().toISOString()
  });
  
  console.log('GET /api/links/stats - Returning summary statistics');
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/links`);
});
