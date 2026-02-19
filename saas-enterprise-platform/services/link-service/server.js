const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const helmet = require('helmet')
const cors = require('cors')

const logger = require('../../../shared/logger')
const linkRoutes = require('./routes/links')

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    service: 'link-service',
    ip: req.ip 
  })
  next()
})

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-links'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB', { service: 'link-service' })
  } catch (err) {
    logger.error('MongoDB connection failed', { 
      error: err.message, 
      service: 'link-service' 
    })
    process.exit(1)
  }
}

// Routes
app.use('/links', linkRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'link-service',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    service: 'link-service',
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
      logger.info(`Link service running on port ${PORT}`, { 
        service: 'link-service' 
      })
    })
  })
}

module.exports = app
