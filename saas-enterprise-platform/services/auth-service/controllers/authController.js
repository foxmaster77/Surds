const jwt = require('jsonwebtoken')
const User = require('../models/User')
const logger = require('../../../shared/logger')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'
const JWT_EXPIRY = '7d'

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password required' 
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered' 
      })
    }

    const user = new User({
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'user'
    })

    await user.save()
    logger.info(`User registered: ${email}`, { service: 'auth-service' })

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    )

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    })
  } catch (err) {
    logger.error('Registration error', { 
      error: err.message, 
      service: 'auth-service' 
    })
    res.status(500).json({ 
      error: 'Registration failed' 
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password required' 
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      })
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    )

    logger.info(`User logged in: ${email}`, { service: 'auth-service' })

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription
      },
      token
    })
  } catch (err) {
    logger.error('Login error', { 
      error: err.message, 
      service: 'auth-service' 
    })
    res.status(500).json({ 
      error: 'Login failed' 
    })
  }
}

const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscription: user.subscription
      }
    })
  } catch (err) {
    logger.error('Verify error', { 
      error: err.message, 
      service: 'auth-service' 
    })
    res.status(500).json({ 
      error: 'Verification failed' 
    })
  }
}

const generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      })
    }

    const apiKey = jwt.sign(
      { userId: user._id, type: 'api-key' },
      JWT_SECRET,
      { expiresIn: '1y' }
    )

    user.apiKeys.push({
      key: apiKey,
      name: req.body.name || `API Key ${new Date().toLocaleDateString()}`
    })

    await user.save()
    logger.info(`API key generated for: ${user.email}`, { 
      service: 'auth-service' 
    })

    res.json({
      message: 'API key generated',
      apiKey: apiKey,
      expiresIn: '1 year'
    })
  } catch (err) {
    logger.error('API key generation error', { 
      error: err.message, 
      service: 'auth-service' 
    })
    res.status(500).json({ 
      error: 'Failed to generate API key' 
    })
  }
}

module.exports = {
  register,
  login,
  verify,
  generateApiKey
}
