// =====================
// Authentication Middleware
// =====================

const authService = require('../services/authService');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Auth failed - no token', { ip: req.ip });
      throw new AppError('No token, authorization denied', 401);
    }

    const decoded = authService.verifyToken(token);
    req.user = decoded;

    logger.debug('Auth successful', { userId: decoded.id });
    next();
  } catch (error) {
    logger.warn('Auth failed', { error: error.message });
    throw error;
  }
};

module.exports = auth;
