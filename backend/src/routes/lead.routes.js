const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  filterLeads
} = require("../controllers/lead.controller");

const auth = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware");

/**
 * Create a new lead (manual entry)
 * POST /api/leads
 */
router.post(
  "/",
  auth,
  rateLimiter,
  createLead
);

/**
 * Get all leads
 * GET /api/leads
 */
router.get(
  "/",
  auth,
  getAllLeads
);

/**
 * Filter leads
 * GET /api/leads/filter?industry=IT&location=India
 */
router.get(
  "/filter",
  auth,
  filterLeads
);

/**
 * Get single lead by ID
 * GET /api/leads/:id
 */
router.get(
  "/:id",
  auth,
  getLeadById
);

/**
 * Update a lead
 * PUT /api/leads/:id
 */
router.put(
  "/:id",
  auth,
  updateLead
);

/**
 * Delete a lead
 * DELETE /api/leads/:id
 */
router.delete(
  "/:id",
  auth,
  deleteLead
);

module.exports = router;
