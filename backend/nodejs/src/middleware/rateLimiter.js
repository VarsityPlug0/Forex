const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // tighter limit for auth endpoints
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again in 15 minutes.',
  },
});

module.exports = rateLimiter;
module.exports.authLimiter = authLimiter;
