const express = require('express')
const router = express.Router()
const { register, login, verify, generateApiKey } = require('../controllers/authController')
const { verifyToken } = require('../../../shared/auth')

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/verify', verifyToken, verify)
router.post('/generate-api-key', verifyToken, generateApiKey)

module.exports = router
