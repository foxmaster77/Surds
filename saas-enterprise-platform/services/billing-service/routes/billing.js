const express = require('express')
const router = express.Router()
const { 
  getSubscription, 
  upgradePlan, 
  recordUsage, 
  getInvoices,
  cancelSubscription
} = require('../controllers/billingController')
const { verifyToken } = require('../../../shared/auth')

// All routes require authentication
router.get('/subscription', verifyToken, getSubscription)
router.post('/upgrade', verifyToken, upgradePlan)
router.post('/usage', verifyToken, recordUsage)
router.get('/invoices', verifyToken, getInvoices)
router.post('/cancel', verifyToken, cancelSubscription)

module.exports = router
