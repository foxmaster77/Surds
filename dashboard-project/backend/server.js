const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import utilities and middleware
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');

const app = express();

// =====================
// Middleware Setup
// =====================

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

logger.info('Middleware configured');

// =====================
// Database Connection
// =====================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('MongoDB connected successfully', { uri: process.env.MONGODB_URI });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', err);
    process.exit(1);
  });

// =====================
// Routes
// =====================

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

logger.info('Routes configured');

// =====================
// 404 Handler
// =====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// =====================
// Error Handling
// =====================

app.use(errorHandler);

// =====================
// Server Startup
// =====================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server started successfully on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

// =====================
// Graceful Shutdown
// =====================

process.on('SIGTERM', () => {
  logger.warn('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false);
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warn('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false);
    process.exit(0);
  });
});

// =====================
// Unhandled Errors
// =====================

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
