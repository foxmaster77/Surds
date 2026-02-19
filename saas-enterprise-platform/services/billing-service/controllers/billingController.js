const Subscription = require('../models/Subscription')
const { Invoice } = require('../models/Subscription')
const logger = require('../../../shared/logger')

const PLANS = {
  free: {
    monthlyPrice: 0,
    limits: {
      linksPerMonth: 100,
      customDomains: false,
      teamMembers: 1,
      apiRequests: 10000
    }
  },
  pro: {
    monthlyPrice: 29,
    limits: {
      linksPerMonth: 5000,
      customDomains: true,
      teamMembers: 5,
      apiRequests: 1000000
    }
  },
  enterprise: {
    monthlyPrice: 299,
    limits: {
      linksPerMonth: 100000,
      customDomains: true,
      teamMembers: 50,
      apiRequests: 10000000
    }
  }
}

const getSubscription = async (req, res) => {
  try {
    const userId = req.user.userId
    let subscription = await Subscription.findOne({ userId })

    if (!subscription) {
      // Create free subscription for new user
      subscription = new Subscription({
        userId,
        plan: 'free',
        status: 'active',
        ...PLANS.free,
        billingCycle: {
          start: new Date(),
          renewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      })
      await subscription.save()
      logger.info(`Free subscription created for user: ${userId}`, { 
        service: 'billing-service' 
      })
    }

    res.json({
      subscription,
      limits: PLANS[subscription.plan].limits
    })
  } catch (err) {
    logger.error('Get subscription error', { 
      error: err.message, 
      service: 'billing-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve subscription' 
    })
  }
}

const upgradePlan = async (req, res) => {
  try {
    const userId = req.user.userId
    const { newPlan } = req.body

    if (!PLANS[newPlan]) {
      return res.status(400).json({ 
        error: 'Invalid plan' 
      })
    }

    let subscription = await Subscription.findOne({ userId })

    if (!subscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      })
    }

    const oldPlan = subscription.plan
    subscription.plan = newPlan
    subscription.status = 'active'
    subscription.updatedAt = new Date()

    await subscription.save()

    // Create invoice
    const invoiceNumber = `INV-${userId}-${Date.now()}`
    const invoice = new Invoice({
      subscriptionId: subscription._id,
      userId,
      invoiceNumber,
      amount: PLANS[newPlan].monthlyPrice,
      items: [{
        description: `Upgrade from ${oldPlan} to ${newPlan}`,
        quantity: 1,
        unitPrice: PLANS[newPlan].monthlyPrice,
        total: PLANS[newPlan].monthlyPrice
      }],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    })

    await invoice.save()
    logger.info(`Plan upgraded: ${oldPlan} → ${newPlan}`, { 
      service: 'billing-service',
      userId
    })

    res.json({
      message: 'Plan upgraded successfully',
      subscription,
      invoice: invoiceNumber
    })
  } catch (err) {
    logger.error('Upgrade plan error', { 
      error: err.message, 
      service: 'billing-service' 
    })
    res.status(500).json({ 
      error: 'Failed to upgrade plan' 
    })
  }
}

const recordUsage = async (req, res) => {
  try {
    const userId = req.user.userId
    const { linksCreated, apiCallsUsed } = req.body

    const subscription = await Subscription.findOne({ userId })
    if (!subscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      })
    }

    if (linksCreated !== undefined) {
      subscription.usage.linksCreated += linksCreated
    }
    if (apiCallsUsed !== undefined) {
      subscription.usage.apiCallsUsed += apiCallsUsed
    }

    await subscription.save()
    logger.info(`Usage recorded for user: ${userId}`, { 
      service: 'billing-service' 
    })

    res.json({
      message: 'Usage recorded',
      usage: subscription.usage,
      limits: PLANS[subscription.plan].limits
    })
  } catch (err) {
    logger.error('Record usage error', { 
      error: err.message, 
      service: 'billing-service' 
    })
    res.status(500).json({ 
      error: 'Failed to record usage' 
    })
  }
}

const getInvoices = async (req, res) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 20 } = req.query

    const invoices = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Invoice.countDocuments({ userId })

    res.json({
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    logger.error('Get invoices error', { 
      error: err.message, 
      service: 'billing-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve invoices' 
    })
  }
}

const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.userId
    const subscription = await Subscription.findOne({ userId })

    if (!subscription) {
      return res.status(404).json({ 
        error: 'Subscription not found' 
      })
    }

    subscription.status = 'canceled'
    subscription.updatedAt = new Date()
    await subscription.save()

    logger.info(`Subscription canceled for user: ${userId}`, { 
      service: 'billing-service' 
    })

    res.json({
      message: 'Subscription canceled',
      subscription
    })
  } catch (err) {
    logger.error('Cancel subscription error', { 
      error: err.message, 
      service: 'billing-service' 
    })
    res.status(500).json({ 
      error: 'Failed to cancel subscription' 
    })
  }
}

module.exports = {
  getSubscription,
  upgradePlan,
  recordUsage,
  getInvoices,
  cancelSubscription
}
