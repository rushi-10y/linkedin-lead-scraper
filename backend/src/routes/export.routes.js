const express = require("express");
const router = express.Router();

const {
  exportLeadsAsCSV,
  exportLeadsAsExcel
} = require("../services/export.service");

const auth = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware");

/**
 * Export leads as CSV
 * Example:
 * GET /api/export/csv?industry=IT&location=India
 */
router.get(
  "/csv",
  auth,
  rateLimiter,
  exportLeadsAsCSV
);

/**
 * Export leads as Excel
 * Example:
 * GET /api/export/excel?source=google
 */
router.get(
  "/excel",
  auth,
  rateLimiter,
  exportLeadsAsExcel
);

module.exports = router;
