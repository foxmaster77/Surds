const { nanoid } = require('nanoid')
const Link = require('../models/Link')
const logger = require('../../../shared/logger')

const createLink = async (req, res) => {
  try {
    const { originalUrl, customAlias, title, description, tags, expiresAt } = req.body
    const userId = req.user.userId

    if (!originalUrl) {
      return res.status(400).json({ 
        error: 'Original URL is required' 
      })
    }

    const shortCode = customAlias || nanoid(7)

    const existingLink = await Link.findOne({ 
      $or: [{ shortCode }, { customAlias: customAlias }] 
    })

    if (existingLink) {
      return res.status(409).json({ 
        error: 'Short code or alias already exists' 
      })
    }

    const link = new Link({
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      title: title || originalUrl,
      description,
      tags: tags || [],
      expiresAt
    })

    await link.save()
    logger.info(`Link created: ${shortCode}`, { 
      service: 'link-service',
      userId
    })

    res.status(201).json({
      message: 'Link created successfully',
      link: {
        id: link._id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        shortUrl: `${process.env.SHORT_URL_BASE || 'http://localhost:3000/l'}/${link.shortCode}`,
        title: link.title,
        createdAt: link.createdAt
      }
    })
  } catch (err) {
    logger.error('Create link error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to create link' 
    })
  }
}

const getLinks = async (req, res) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 20, tag } = req.query

    const query = { userId, isActive: true }
    if (tag) {
      query.tags = { $in: [tag] }
    }

    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-clickDetails')

    const total = await Link.countDocuments(query)

    res.json({
      links,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    logger.error('Get links error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve links' 
    })
  }
}

const getLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)

    if (!link || link.userId.toString() !== req.user.userId) {
      return res.status(404).json({ 
        error: 'Link not found' 
      })
    }

    res.json(link)
  } catch (err) {
    logger.error('Get link error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve link' 
    })
  }
}

const updateLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)

    if (!link || link.userId.toString() !== req.user.userId) {
      return res.status(404).json({ 
        error: 'Link not found' 
      })
    }

    const { title, description, tags, isActive } = req.body
    link.title = title || link.title
    link.description = description !== undefined ? description : link.description
    link.tags = tags || link.tags
    link.isActive = isActive !== undefined ? isActive : link.isActive
    link.updatedAt = new Date()

    await link.save()
    logger.info(`Link updated: ${link.shortCode}`, { 
      service: 'link-service',
      userId: req.user.userId
    })

    res.json({
      message: 'Link updated successfully',
      link
    })
  } catch (err) {
    logger.error('Update link error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to update link' 
    })
  }
}

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)

    if (!link || link.userId.toString() !== req.user.userId) {
      return res.status(404).json({ 
        error: 'Link not found' 
      })
    }

    await Link.deleteOne({ _id: req.params.id })
    logger.info(`Link deleted: ${link.shortCode}`, { 
      service: 'link-service',
      userId: req.user.userId
    })

    res.json({
      message: 'Link deleted successfully'
    })
  } catch (err) {
    logger.error('Delete link error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to delete link' 
    })
  }
}

const trackClick = async (req, res) => {
  try {
    const { shortCode } = req.params
    const link = await Link.findOne({ shortCode, isActive: true })

    if (!link) {
      return res.status(404).json({ 
        error: 'Link not found' 
      })
    }

    link.clicks += 1
    link.clickDetails.push({
      referer: req.headers.referer,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      country: req.headers['cf-ipcountry'] || 'unknown'
    })

    // Keep only last 1000 click details
    if (link.clickDetails.length > 1000) {
      link.clickDetails = link.clickDetails.slice(-1000)
    }

    await link.save()

    res.json({
      redirect: link.originalUrl
    })
  } catch (err) {
    logger.error('Track click error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to track click' 
    })
  }
}

const getLinkStats = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)

    if (!link || link.userId.toString() !== req.user.userId) {
      return res.status(404).json({ 
        error: 'Link not found' 
      })
    }

    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentClicks = link.clickDetails.filter(
      click => click.timestamp >= last7Days
    )

    res.json({
      shortCode: link.shortCode,
      totalClicks: link.clicks,
      recentClicks: recentClicks.length,
      topCountries: getTopCountries(link.clickDetails),
      clickTrend: getClickTrend(link.clickDetails)
    })
  } catch (err) {
    logger.error('Get link stats error', { 
      error: err.message, 
      service: 'link-service' 
    })
    res.status(500).json({ 
      error: 'Failed to retrieve stats' 
    })
  }
}

const getTopCountries = (clickDetails) => {
  const countries = {}
  clickDetails.forEach(click => {
    countries[click.country] = (countries[click.country] || 0) + 1
  })
  return Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }))
}

const getClickTrend = (clickDetails) => {
  const trend = {}
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  clickDetails.forEach(click => {
    if (click.timestamp >= last7Days) {
      const date = click.timestamp.toISOString().split('T')[0]
      trend[date] = (trend[date] || 0) + 1
    }
  })

  return Object.entries(trend).map(([date, clicks]) => ({ date, clicks }))
}

module.exports = {
  createLink,
  getLinks,
  getLink,
  updateLink,
  deleteLink,
  trackClick,
  getLinkStats
}
