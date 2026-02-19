require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5501',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5501',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

// Socket.io connections
let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  connectedUsers.push(socket.id);
  io.emit('user-count', connectedUsers.length);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    connectedUsers = connectedUsers.filter(id => id !== socket.id);
    io.emit('user-count', connectedUsers.length);
  });

  socket.on('new-talk', (data) => {
    console.log('📢 New talk:', data);
    io.emit('talk-added', data);
  });

  socket.on('new-meeting', (data) => {
    console.log('📅 New meeting:', data);
    io.emit('meeting-added', data);
  });

  socket.on('new-shoutout', (data) => {
    console.log('📣 New shoutout:', data);
    io.emit('shoutout-added', data);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for connections\n`);
});
