// =====================
// Rate Limiting Middleware
// =====================

const logger = require('../utils/logger');

// Simple in-memory rate limiter
const rateLimit = {
  store: {},
  limit: 100,
  windowMs: 15 * 60 * 1000 // 15 minutes
};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const key = `${ip}-${Math.floor(now / rateLimit.windowMs)}`;

  if (!rateLimit.store[key]) {
    rateLimit.store[key] = 0;
  }

  rateLimit.store[key]++;

  if (rateLimit.store[key] > rateLimit.limit) {
    logger.warn('Rate limit exceeded', { ip, requests: rateLimit.store[key] });
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }

  next();
};

module.exports = rateLimiter;
