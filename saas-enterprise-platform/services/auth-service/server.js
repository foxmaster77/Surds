const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const logger = require('../../../shared/logger')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
})

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    service: 'auth-service',
    ip: req.ip 
  })
  next()
})

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-auth'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB', { service: 'auth-service' })
  } catch (err) {
    logger.error('MongoDB connection failed', { 
      error: err.message, 
      service: 'auth-service' 
    })
    process.exit(1)
  }
}

// Routes
app.use('/auth', authLimiter, authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'auth-service',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    service: 'auth-service',
    stack: err.stack
  })
  res.status(500).json({ 
    error: 'Internal server error' 
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  })
})

// Start server
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Auth service running on port ${PORT}`, { 
        service: 'auth-service' 
      })
    })
  })
}

module.exports = app
