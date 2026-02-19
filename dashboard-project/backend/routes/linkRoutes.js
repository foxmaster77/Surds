// =====================
// Refactored Link Routes
// =====================

const express = require('express');
const linkController = require('../controllers/linkController');
const auth = require('../middleware/auth');
const { validateUrl } = require('../middleware/validators');

const router = express.Router();

// @route   GET /api/links
// @desc    Get all links for logged-in user
// @access  Private
router.get('/', auth, linkController.getLinks);

// @route   POST /api/links
// @desc    Create a new link
// @access  Private
router.post('/', auth, validateUrl, linkController.createLink);

// @route   DELETE /api/links/:id
// @desc    Delete a link
// @access  Private
router.delete('/:id', auth, linkController.deleteLink);

// @route   GET /api/links/analytics
// @desc    Get user analytics
// @access  Private
router.get('/analytics', auth, linkController.getAnalytics);

// @route   GET /api/links/:shortCode
// @desc    Get link by short code (public)
// @access  Public
router.get('/:shortCode', linkController.getShortLink);

module.exports = router;
