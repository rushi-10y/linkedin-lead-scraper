const Lead = require("../models/Lead.model");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

/**
 * Build Mongo filters from query params
 */
function buildFilters(query = {}) {
  const filters = {};

  if (query.industry) filters.industry = query.industry;
  if (query.location) filters.location = query.location;
  if (query.source) filters.source = query.source;
  if (query.company)
    filters.company = new RegExp(query.company, "i");

  return filters;
}

/**
 * Export leads as CSV
 */
async function exportLeadsAsCSV(query) {
  const filters = buildFilters(query);
  const leads = await Lead.find(filters).lean();

  if (!leads.length) return null;

  const fields = [
    "name",
    "email",
    "phone",
    "company",
    "designation",
    "industry",
    "location",
    "website",
    "linkedin",
    "source",
    "scrapedAt"
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  return csv;
}

/**
 * Export leads as Excel
 */
async function exportLeadsAsExcel(query) {
  const filters = buildFilters(query);
  const leads = await Lead.find(filters).lean();

  if (!leads.length) return null;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Leads");

  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Company", key: "company", width: 25 },
    { header: "Designation", key: "designation", width: 20 },
    { header: "Industry", key: "industry", width: 20 },
    { header: "Location", key: "location", width: 20 },
    { header: "Website", key: "website", width: 30 },
    { header: "LinkedIn", key: "linkedin", width: 30 },
    { header: "Source", key: "source", width: 15 },
    { header: "Scraped At", key: "scrapedAt", width: 20 }
  ];

  leads.forEach(lead => sheet.addRow(lead));

  return workbook;
}

module.exports = {
  exportLeadsAsCSV,
  exportLeadsAsExcel
};
