const Event = require('../models/Event')
const logger = require('../../../shared/logger')

const trackEvent = async (req, res) => {
  try {
    const { eventType, resourceId, resourceType, metadata } = req.body
    const userId = req.user.userId

    if (!eventType) {
      return res.status(400).json({ 
        error: 'Event type is required' 
      })
    }

    const event = new Event({
      userId,
      eventType,
      resourceId,
      resourceType,
      metadata
    })

    await event.save()
    logger.info(`Event tracked: ${eventType}`, { 
      service: 'analytics-service',
      userId
    })

    res.status(201).json({
      message: 'Event tracked successfully',
      eventId: event._id
    })
  } catch (err) {
    logger.error('Track event error', { 
      error: err.message, 
      service: 'analytics-service' 
    })
    res.status(500).json({ 
      error: 'Failed to track event' 
    })
  }
}

const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId
    const { eventType, startDate, endDate, page = 1, limit = 50 } = req.query

    const query = { userId }
    if (eventType) query.eventType = eventType
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate)
    }

    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Event.countDocuments(query)

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    logger.error('Get events error', { 
      error: err.message, 
      service: 'analytics-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve events' 
    })
  }
}

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId
    const days = parseInt(req.query.days) || 30
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const query = { 
      userId,
      timestamp: { $gte: startDate }
    }

    const events = await Event.find(query)

    // Calculate metrics
    const totalEvents = events.length
    const eventsByType = {}
    const eventsByDay = {}

    events.forEach(event => {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1

      // Count by day
      const date = event.timestamp.toISOString().split('T')[0]
      eventsByDay[date] = (eventsByDay[date] || 0) + 1
    })

    const topCountries = getTopItems(
      events.filter(e => e.metadata?.country),
      e => e.metadata.country
    )

    const topDevices = getTopItems(
      events.filter(e => e.metadata?.device),
      e => e.metadata.device
    )

    res.json({
      summary: {
        totalEvents,
        averagePerDay: Math.round(totalEvents / days),
        uniqueDays: Object.keys(eventsByDay).length
      },
      eventsByType,
      eventsByDay: Object.entries(eventsByDay).map(([date, count]) => ({ 
        date, 
        count 
      })),
      topCountries,
      topDevices
    })
  } catch (err) {
    logger.error('Get dashboard error', { 
      error: err.message, 
      service: 'analytics-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve dashboard data' 
    })
  }
}

const getResourceStats = async (req, res) => {
  try {
    const userId = req.user.userId
    const { resourceType, days = 30 } = req.query
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const query = {
      userId,
      timestamp: { $gte: startDate }
    }
    if (resourceType) query.resourceType = resourceType

    const events = await Event.find(query).select('resourceId eventType timestamp')

    const resourceStats = {}
    events.forEach(event => {
      if (!resourceStats[event.resourceId]) {
        resourceStats[event.resourceId] = {}
      }
      resourceStats[event.resourceId][event.eventType] = 
        (resourceStats[event.resourceId][event.eventType] || 0) + 1
    })

    res.json(resourceStats)
  } catch (err) {
    logger.error('Get resource stats error', { 
      error: err.message, 
      service: 'analytics-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve resource stats' 
    })
  }
}

const getTopItems = (items, keyFn) => {
  const counts = {}
  items.forEach(item => {
    const key = keyFn(item)
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
}

module.exports = {
  trackEvent,
  getEvents,
  getDashboard,
  getResourceStats
}
