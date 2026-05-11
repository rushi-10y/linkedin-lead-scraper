const Lead = require("../models/Lead.model");
const leadService = require("../services/lead.service");
const {
  MINIMUM_LEADS,
  scrapeLeadsByKeywordAndLocation
} = require("../services/scraping/manualLeadScrape.service");
const logger = require("../utils/logger");
const multer = require("multer");
const XLSX = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel/CSV files allowed"), false);
    }
  }
});

const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const lead = await leadService.createLead(leadData);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead
    });
  } catch (error) {
    logger.error("Create lead error", error);
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message
    });
  }
};

const scrapeLeads = async (req, res) => {
  try {
    const keyword = req.body.keyword?.trim();
    const location = req.body.location?.trim();

    if (!keyword || !location) {
      return res.status(400).json({
        success: false,
        message: "Keyword and location are required"
      });
    }

    const scrapedLeads = await scrapeLeadsByKeywordAndLocation({ keyword, location });
    const savedLeads = await leadService.saveScrapedLeads(scrapedLeads);

    res.status(201).json({
      success: true,
      message: `Stored ${savedLeads.length} leads`,
      data: savedLeads,
      meta: {
        keyword,
        location,
        minimumRequested: MINIMUM_LEADS,
        stored: savedLeads.length
      }
    });
  } catch (error) {
    logger.error("Scrape leads error", error);
    res.status(500).json({
      success: false,
      message: "Failed to scrape leads",
      error: error.message
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const filters = {
      keyword: req.query.keyword,
      location: req.query.location,
      source: req.query.source,
      company: req.query.company
    };

    const { leads, pagination } = await leadService.getLeads(page, limit, filters);

    res.json({
      success: true,
      data: leads,
      pagination
    });
  } catch (error) {
    logger.error("Get all leads error", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    logger.error("Get lead by ID error", error);
    res.status(400).json({
      success: false,
      message: "Invalid lead ID"
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: lead
    });
  } catch (error) {
    logger.error("Update lead error", error);
    res.status(error.message === "Lead not found" ? 404 : 500).json({
      success: false,
      message: error.message === "Lead not found" ? error.message : "Failed to update lead",
      error: error.message
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    logger.error("Delete lead error", error);
    res.status(error.message === "Lead not found" ? 404 : 400).json({
      success: false,
      message: error.message === "Lead not found" ? error.message : "Invalid lead ID"
    });
  }
};

const filterLeads = async (req, res) => {
  try {
    const leads = await leadService.filterLeads(req.query);

    res.json({
      success: true,
      data: leads
    });
  } catch (error) {
    logger.error("Filter leads error", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter leads",
      error: error.message
    });
  }
};

const importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const leads = jsonData
      .map((row) => ({
        name: row.name || row.Name || "",
        address: row.address || row.Address || "",
        phone: row.phone || row.Phone || "",
        website: row.website || row.Website || "",
        keyword: row.keyword || row.Keyword || "",
        location: row.location || row.Location || "",
        email: row.email || row.Email || "",
        company: row.company || row.Company || "",
        linkedin_url: row.linkedin || row["LinkedIn URL"] || ""
      }))
      .filter((lead) => lead.name || lead.website);

    const savedLeads = await leadService.saveScrapedLeads(leads);

    res.json({
      success: true,
      message: `Imported ${savedLeads.length} leads`,
      imported: savedLeads.length,
      data: savedLeads
    });
  } catch (error) {
    logger.error("Import leads error", error);
    res.status(500).json({
      success: false,
      message: "Failed to import leads",
      error: error.message
    });
  }
};

const exportLeads = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 1000, 5000);
    const { leads } = await leadService.getLeads(page, limit, req.query);

    const csvData = leads.map((lead) => ({
      name: lead.name,
      address: lead.address,
      phone: lead.phone,
      website: lead.website,
      keyword: lead.keyword,
      location: lead.location,
      source: lead.source
    }));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leads-${Date.now()}.csv`
    );

    const csv = csvData
      .map((row) => Object.values(row).map((value) => `"${value || ""}"`).join(","))
      .join("\n");

    res.send(csv);
  } catch (error) {
    logger.error("Export leads error", error);
    res.status(500).json({
      success: false,
      message: "Failed to export leads",
      error: error.message
    });
  }
};

module.exports = {
  createLead,
  scrapeLeads,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  filterLeads,
  importLeads,
  exportLeads,
  upload
};
