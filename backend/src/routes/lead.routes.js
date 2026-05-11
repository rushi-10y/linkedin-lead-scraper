const express = require("express");
const router = express.Router();

const {
  createLead,
  scrapeLeads,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  filterLeads,
  upload,
  importLeads,
  exportLeads
} = require("../controllers/lead.controller");

const auth = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", auth, rateLimiter, asyncHandler(createLead));
router.post("/scrape", auth, rateLimiter, asyncHandler(scrapeLeads));
router.get("/", auth, asyncHandler(getAllLeads));
router.get("/filter", auth, asyncHandler(filterLeads));
router.get("/export", auth, asyncHandler(exportLeads));
router.post(
  "/import",
  auth,
  rateLimiter,
  upload.single("file"),
  asyncHandler(importLeads)
);
router.get("/:id", auth, asyncHandler(getLeadById));
router.put("/:id", auth, rateLimiter, asyncHandler(updateLead));
router.delete("/:id", auth, rateLimiter, asyncHandler(deleteLead));

module.exports = router;
