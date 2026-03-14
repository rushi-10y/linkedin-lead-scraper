const rateLimit = require("express-rate-limit");

/**
 * Rate Limiting Middleware
 * Prevents abuse of APIs (scraping, auth, export)
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                // limit each IP to 100 requests per window
  standardHeaders: true,   // return rate limit info in headers
  legacyHeaders: false,    // disable X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

module.exports = apiRateLimiter;
