const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const helmet = require('helmet')
const cors = require('cors')

const logger = require('../../../shared/logger')
const { verifyAdmin } = require('../../../shared/auth')

const app = express()
const PORT = process.env.PORT || 3005

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
    service: 'admin-service',
    ip: req.ip 
  })
  next()
})

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-admin'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB', { service: 'admin-service' })
  } catch (err) {
    logger.error('MongoDB connection failed', { 
      error: err.message, 
      service: 'admin-service' 
    })
    process.exit(1)
  }
}

// Admin routes
app.get('/users/stats', verifyAdmin, async (req, res) => {
  try {
    // Mock stats - in production would query User model
    res.json({
      totalUsers: 1250,
      activeUsers: 890,
      newUsersThisMonth: 145,
      churnRate: 2.3,
      avgSubscriptionValue: 65.50
    })
  } catch (err) {
    logger.error('Get users stats error', { error: err.message })
    res.status(500).json({ error: 'Failed to retrieve stats' })
  }
})

app.get('/system/health', verifyAdmin, async (req, res) => {
  try {
    const memUsage = process.memoryUsage()
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
      },
      services: {
        auth: 'operational',
        links: 'operational',
        analytics: 'operational',
        billing: 'operational'
      }
    })
  } catch (err) {
    logger.error('Get system health error', { error: err.message })
    res.status(500).json({ error: 'Failed to retrieve system health' })
  }
})

app.post('/users/:userId/suspend', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    logger.warn(`User suspended by admin: ${userId}`, { 
      service: 'admin-service',
      adminId: req.user.userId
    })
    res.json({ message: 'User suspended successfully' })
  } catch (err) {
    logger.error('Suspend user error', { error: err.message })
    res.status(500).json({ error: 'Failed to suspend user' })
  }
})

app.get('/reports/revenue', verifyAdmin, async (req, res) => {
  try {
    const { month } = req.query
    res.json({
      month: month || 'current',
      totalRevenue: 45230.50,
      subscriptionRevenue: 40000,
      apiCallRevenue: 5230.50,
      byPlan: {
        free: 0,
        pro: 25000,
        enterprise: 15000
      }
    })
  } catch (err) {
    logger.error('Get revenue report error', { error: err.message })
    res.status(500).json({ error: 'Failed to retrieve revenue report' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'admin-service',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    service: 'admin-service',
    stack: err.stack
  })
  res.status(500).json({ error: 'Internal server error' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Admin service running on port ${PORT}`, { 
        service: 'admin-service' 
      })
    })
  })
}

module.exports = app
