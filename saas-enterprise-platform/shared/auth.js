const jwt = require('jsonwebtoken')
const logger = require('./logger')

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    logger.error('Token verification failed:', err)
    res.status(401).json({ error: 'Invalid token' })
  }
}

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

const verifyApiKey = (apiKeyMiddleware) => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' })
    }
    // Validate API key (implemented in each service)
    next()
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyApiKey
}
