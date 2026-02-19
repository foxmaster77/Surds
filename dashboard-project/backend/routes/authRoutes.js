// =====================
// Refactored Auth Routes
// =====================

const express = require('express');
const authController = require('../controllers/authController');
const { validateEmail, validatePassword } = require('../middleware/validators');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateEmail, validatePassword, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateEmail, validatePassword, authController.login);

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Public
router.get('/verify', authController.verifyToken);

module.exports = router;
