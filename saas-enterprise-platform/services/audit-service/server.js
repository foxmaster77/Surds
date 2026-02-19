const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const helmet = require('helmet')
const cors = require('cors')

const logger = require('../../../shared/logger')
const { verifyToken } = require('../../../shared/auth')

const app = express()
const PORT = process.env.PORT || 3006

// Simple audit log schema (in memory for demo, use DB in production)
const auditLogs = []

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
    service: 'audit-service',
    ip: req.ip 
  })
  next()
})

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-audit'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB', { service: 'audit-service' })
  } catch (err) {
    logger.error('MongoDB connection failed', { 
      error: err.message, 
      service: 'audit-service' 
    })
    // Continue without DB for demo
  }
}

// Log audit event
app.post('/log', async (req, res) => {
  try {
    const { userId, action, resource, resourceId, changes, ipAddress } = req.body

    const auditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      action,
      resource,
      resourceId,
      changes,
      ipAddress,
      timestamp: new Date(),
      userAgent: req.headers['user-agent']
    }

    auditLogs.push(auditLog)
    
    // Keep only last 10000 logs in memory
    if (auditLogs.length > 10000) {
      auditLogs.shift()
    }

    logger.info(`Audit logged: ${action} on ${resource}`, { 
      service: 'audit-service',
      userId,
      action
    })

    res.status(201).json({
      message: 'Audit logged',
      logId: auditLog.id
    })
  } catch (err) {
    logger.error('Log audit error', { 
      error: err.message, 
      service: 'audit-service' 
    })
    res.status(500).json({ error: 'Failed to log audit' })
  }
})

// Get user audit logs
app.get('/logs/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 50, action } = req.query

    // Only allow users to view their own logs (unless admin)
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    let filtered = auditLogs.filter(log => log.userId === userId)
    if (action) {
      filtered = filtered.filter(log => log.action === action)
    }

    const start = (page - 1) * limit
    const logs = filtered.slice(start, start + limit)

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      }
    })
  } catch (err) {
    logger.error('Get audit logs error', { error: err.message })
    res.status(500).json({ error: 'Failed to retrieve logs' })
  }
})

// Get all audit logs (admin only)
app.get('/logs-admin', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const { page = 1, limit = 100, action, resource } = req.query

    let filtered = auditLogs
    if (action) filtered = filtered.filter(log => log.action === action)
    if (resource) filtered = filtered.filter(log => log.resource === resource)

    const start = (page - 1) * limit
    const logs = filtered.slice(start, start + limit)

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      }
    })
  } catch (err) {
    logger.error('Get admin audit logs error', { error: err.message })
    res.status(500).json({ error: 'Failed to retrieve logs' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'audit-service',
    logCount: auditLogs.length,
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    service: 'audit-service',
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
      logger.info(`Audit service running on port ${PORT}`, { 
        service: 'audit-service' 
      })
    })
  })
}

module.exports = app
