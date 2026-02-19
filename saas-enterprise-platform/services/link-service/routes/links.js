const express = require('express')
const router = express.Router()
const { 
  createLink, 
  getLinks, 
  getLink, 
  updateLink, 
  deleteLink,
  trackClick,
  getLinkStats
} = require('../controllers/linkController')
const { verifyToken } = require('../../../shared/auth')

// Protected routes - require authentication
router.post('/create', verifyToken, createLink)
router.get('/list', verifyToken, getLinks)
router.get('/:id', verifyToken, getLink)
router.put('/:id', verifyToken, updateLink)
router.delete('/:id', verifyToken, deleteLink)
router.get('/:id/stats', verifyToken, getLinkStats)

// Public route - track click (no auth needed)
router.get('/redirect/:shortCode', trackClick)

module.exports = router
