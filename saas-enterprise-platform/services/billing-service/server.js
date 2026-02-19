const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const helmet = require('helmet')
const cors = require('cors')

const logger = require('../../../shared/logger')
const billingRoutes = require('./routes/billing')

const app = express()
const PORT = process.env.PORT || 3004

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
    service: 'billing-service',
    ip: req.ip 
  })
  next()
})

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-billing'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB', { service: 'billing-service' })
  } catch (err) {
    logger.error('MongoDB connection failed', { 
      error: err.message, 
      service: 'billing-service' 
    })
    process.exit(1)
  }
}

// Routes
app.use('/billing', billingRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'billing-service',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    service: 'billing-service',
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
      logger.info(`Billing service running on port ${PORT}`, { 
        service: 'billing-service' 
      })
    })
  })
}

module.exports = app
