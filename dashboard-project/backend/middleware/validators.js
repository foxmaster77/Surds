// =====================
// Validation Middleware
// =====================

const logger = require('../utils/logger');
const { AppError } = require('../utils/errorHandler');

// Validate email format
const validateEmail = (req, res, next) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (req.body.email && !emailRegex.test(req.body.email)) {
    logger.warn('Invalid email format', { email: req.body.email });
    throw new AppError('Invalid email format', 400);
  }

  next();
};

// Validate password
const validatePassword = (req, res, next) => {
  if (req.body.password && req.body.password.length < 6) {
    logger.warn('Invalid password - too short');
    throw new AppError('Password must be at least 6 characters', 400);
  }

  next();
};

// Validate URL format
const validateUrl = (req, res, next) => {
  if (req.body.url) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(req.body.url)) {
      logger.warn('Invalid URL format', { url: req.body.url });
      throw new AppError('Invalid URL format', 400);
    }
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUrl
};
