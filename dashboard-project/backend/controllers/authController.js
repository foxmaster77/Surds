// =====================
// Authentication Controller
// =====================

const authService = require('../services/authService');
const { catchAsync, AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class AuthController {
  // Register
  register = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password required', 400);
    }

    // Register user
    const user = await authService.registerUser(email, password);

    // Generate token
    const token = authService.generateToken(user.id);

    logger.info('User registration successful', { userId: user.id });

    res.status(201).json({
      success: true,
      token,
      user
    });
  });

  // Login
  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Authenticate user
    const user = await authService.loginUser(email, password);

    // Generate token
    const token = authService.generateToken(user.id);

    logger.info('User login successful', { userId: user.id });

    res.status(200).json({
      success: true,
      token,
      user
    });
  });

  // Verify token
  verifyToken = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = authService.verifyToken(token);

    res.status(200).json({
      success: true,
      user: { id: decoded.id }
    });
  });
}

module.exports = new AuthController();
