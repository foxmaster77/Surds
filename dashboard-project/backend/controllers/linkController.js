// =====================
// Link Controller
// =====================

const linkService = require('../services/linkService');
const { catchAsync, AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class LinkController {
  // Get all links for user
  getLinks = catchAsync(async (req, res, next) => {
    const links = await linkService.getUserLinks(req.user.id);

    res.status(200).json({
      success: true,
      data: links
    });
  });

  // Create link
  createLink = catchAsync(async (req, res, next) => {
    const { short, url } = req.body;

    const link = await linkService.createLink(req.user.id, short, url);

    res.status(201).json({
      success: true,
      data: link
    });
  });

  // Delete link
  deleteLink = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const result = await linkService.deleteLink(id, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // Get analytics
  getAnalytics = catchAsync(async (req, res, next) => {
    const analytics = await linkService.getAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      data: analytics
    });
  });

  // Get link by short code (public route)
  getShortLink = catchAsync(async (req, res, next) => {
    const { shortCode } = req.params;

    const link = await linkService.incrementClicks(shortCode);

    res.status(200).json({
      success: true,
      data: link
    });
  });
}

module.exports = new LinkController();
