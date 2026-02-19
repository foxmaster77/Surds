require('dotenv').config()
const express = require('express')
const httpProxy = require('http-proxy')
const helmet = require('helmet')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const logger = require('../../shared/logger')
const { apiLimiter } = require('../../shared/rateLimiter')

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}))
app.use(express.json())
app.use(apiLimiter)

// Service endpoints
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  link: process.env.LINK_SERVICE_URL || 'http://localhost:3002',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3003',
  billing: process.env.BILLING_SERVICE_URL || 'http://localhost:3004',
  admin: process.env.ADMIN_SERVICE_URL || 'http://localhost:3005',
  audit: process.env.AUDIT_SERVICE_URL || 'http://localhost:3006'
}

// Proxy instances
const proxies = Object.entries(SERVICES).reduce((acc, [name, url]) => {
  acc[name] = httpProxy.createProxyServer({ target: url })
  acc[name].on('error', (err, req, res) => {
    logger.error(`Proxy error for ${name}:`, err)
    res.status(503).json({ error: 'Service unavailable' })
  })
  return acc
}, {})

// Auth middleware
const verifyToken = (req, res, next) => {
  // Allow auth service routes
  if (req.path.startsWith('/auth')) {
    return next()
  }

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = decoded
    next()
  } catch (err) {
    logger.warn('Token verification failed:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

app.use(verifyToken)

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    userId: req.user?.id,
    ip: req.ip
  })
  next()
})

// Routes
app.use('/auth', (req, res) => proxies.auth.web(req, res))
app.use('/links', (req, res) => proxies.link.web(req, res))
app.use('/analytics', (req, res) => proxies.analytics.web(req, res))
app.use('/billing', (req, res) => proxies.billing.web(req, res))
app.use('/admin', (req, res) => proxies.admin.web(req, res))
app.use('/audit', (req, res) => proxies.audit.web(req, res))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' })
})

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`)
})
