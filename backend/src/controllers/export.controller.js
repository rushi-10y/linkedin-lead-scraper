const express = require("express");
const router = express.Router();

const {
  exportLeadsAsCSV,
  exportLeadsAsExcel
} = require("../services/export.service");

// 📤 Export leads as CSV
// Example: /api/export/csv?industry=IT&location=India
router.get("/csv", exportLeadsAsCSV);

// 📤 Export leads as Excel
// Example: /api/export/excel?source=google
router.get("/excel", exportLeadsAsExcel);

module.exports = router;
