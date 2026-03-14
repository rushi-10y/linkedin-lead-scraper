const express = require("express");
const router = express.Router();

const {
  startScraping
} = require("../controllers/scrape.controller");

const auth = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware");

/**
 * Trigger scraping job
 * POST /api/scrape
 *
 * Body:
 * {
 *   "source": "google" | "website" | "linkedin",
 *   "query": "ERP consultants in India",
 *   "url": "https://example.com"
 * }
 */
router.post(
  "/",
  auth,
  rateLimiter,
  startScraping
);

module.exports = router;
