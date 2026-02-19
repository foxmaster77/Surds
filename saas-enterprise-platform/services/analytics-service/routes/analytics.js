const express = require('express')
const router = express.Router()
const { 
  trackEvent, 
  getEvents, 
  getDashboard, 
  getResourceStats 
} = require('../controllers/analyticsController')
const { verifyToken } = require('../../../shared/auth')

// All routes require authentication
router.post('/events', verifyToken, trackEvent)
router.get('/events', verifyToken, getEvents)
router.get('/dashboard', verifyToken, getDashboard)
router.get('/resources/stats', verifyToken, getResourceStats)

module.exports = router
