// =====================
// Link Service
// =====================

const Link = require('../models/Link');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

class LinkService {
  // Get all links for user
  async getUserLinks(userId) {
    try {
      logger.info('Fetching user links', { userId });

      const links = await Link.find({ userId }).sort({ createdAt: -1 });
      logger.debug('Links fetched', { userId, count: links.length });

      return links;
    } catch (error) {
      logger.error('Error fetching links', error);
      throw error;
    }
  }

  // Create link
  async createLink(userId, shortLink, url) {
    try {
      logger.info('Creating link', { userId, shortLink });

      // Validate input
      if (!shortLink || !url) {
        throw new AppError('Short link and URL required', 400);
      }

      // Check if short link already exists
      const existingLink = await Link.findOne({ short: shortLink });
      if (existingLink) {
        logger.warn('Link creation failed - short link exists', { shortLink });
        throw new AppError('Short link already exists', 400);
      }

      // Validate URL format
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(url)) {
        throw new AppError('Invalid URL format', 400);
      }

      // Create link
      const link = await Link.create({
        short: shortLink,
        url,
        userId,
        time: 'just now',
        clicks: 0
      });

      logger.info('Link created successfully', { userId, linkId: link._id });
      return link;
    } catch (error) {
      logger.error('Error creating link', error);
      throw error;
    }
  }

  // Get link by ID
  async getLinkById(linkId) {
    try {
      const link = await Link.findById(linkId);
      if (!link) {
        throw new AppError('Link not found', 404);
      }
      return link;
    } catch (error) {
      logger.error('Error fetching link', error);
      throw error;
    }
  }

  // Delete link
  async deleteLink(linkId, userId) {
    try {
      logger.info('Deleting link', { linkId, userId });

      const link = await this.getLinkById(linkId);

      // Verify ownership
      if (link.userId.toString() !== userId) {
        logger.warn('Delete failed - unauthorized', { linkId, userId });
        throw new AppError('Not authorized to delete this link', 403);
      }

      await Link.findByIdAndDelete(linkId);
      logger.info('Link deleted successfully', { linkId });

      return { message: 'Link deleted' };
    } catch (error) {
      logger.error('Error deleting link', error);
      throw error;
    }
  }

  // Increment click count
  async incrementClicks(shortLink) {
    try {
      const link = await Link.findOneAndUpdate(
        { short: shortLink },
        { $inc: { clicks: 1 } },
        { new: true }
      );

      if (!link) {
        throw new AppError('Link not found', 404);
      }

      logger.debug('Click incremented', { shortLink, clicks: link.clicks });
      return link;
    } catch (error) {
      logger.error('Error incrementing clicks', error);
      throw error;
    }
  }

  // Get analytics
  async getAnalytics(userId) {
    try {
      logger.info('Fetching analytics', { userId });

      const links = await Link.find({ userId }).sort({ clicks: -1 });
      
      const analytics = {
        totalLinks: links.length,
        totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
        topLinks: links.slice(0, 5),
        allLinks: links
      };

      logger.debug('Analytics generated', { userId, ...analytics });
      return analytics;
    } catch (error) {
      logger.error('Error fetching analytics', error);
      throw error;
    }
  }
}

module.exports = new LinkService();
