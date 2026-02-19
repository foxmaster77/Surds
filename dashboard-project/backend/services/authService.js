// =====================
// Authentication Service
// =====================

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class AuthService {
  // Register user
  async registerUser(email, password) {
    try {
      logger.info('Attempting user registration', { email });

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn('Registration failed - user exists', { email });
        throw new AppError('User already exists', 400);
      }

      // Create user
      const user = await User.create({ email, password });
      logger.info('User registered successfully', { userId: user._id, email });

      return {
        id: user._id,
        email: user.email
      };
    } catch (error) {
      logger.error('Registration error', error);
      throw error;
    }
  }

  // Login user
  async loginUser(email, password) {
    try {
      logger.info('Attempting user login', { email });

      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password required', 400);
      }

      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        logger.warn('Login failed - user not found', { email });
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        logger.warn('Login failed - invalid password', { email });
        throw new AppError('Invalid credentials', 401);
      }

      logger.info('User logged in successfully', { userId: user._id, email });

      return {
        id: user._id,
        email: user.email
      };
    } catch (error) {
      logger.error('Login error', error);
      throw error;
    }
  }

  // Generate JWT token
  generateToken(userId) {
    try {
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      logger.debug('Token generated', { userId });
      return token;
    } catch (error) {
      logger.error('Token generation error', error);
      throw error;
    }
  }

  // Verify token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.debug('Token verified', { userId: decoded.id });
      return decoded;
    } catch (error) {
      logger.error('Token verification error', error);
      throw new AppError('Invalid token', 401);
    }
  }
}

module.exports = new AuthService();
