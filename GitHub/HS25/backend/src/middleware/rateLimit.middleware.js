const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to prevent brute force attacks
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum number of requests per window
 * @param {string} message - Error message
 * @returns {Function} Express middleware
 */
exports.createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Auth routes limiter (login, register, forgot password)
exports.authLimiter = this.createRateLimiter(15 * 60 * 1000, 10, 'Too many authentication attempts, please try again after 15 minutes');

// API limiter for general routes
exports.apiLimiter = this.createRateLimiter(10 * 60 * 1000, 100, 'Too many requests, please try again after 10 minutes');