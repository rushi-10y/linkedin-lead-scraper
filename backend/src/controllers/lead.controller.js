const Lead = require("../models/Lead.model");
const logger = require("../utils/logger");

/**
 * Create a new lead
 */
const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Check if lead with same email already exists
    if (leadData.email) {
      const existingLead = await Lead.findOne({ email: leadData.email });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: "Lead with this email already exists"
        });
      }
    }

    const lead = new Lead(leadData);
    await lead.save();

    logger.info(`Lead created: ${lead._id}`);

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

/**
 * Get all leads with pagination
 */
const getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments();

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
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

/**
 * Get lead by ID
 */
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message
    });
  }
};

/**
 * Update lead
 */
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    logger.info(`Lead updated: ${lead._id}`);

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: lead
    });
  } catch (error) {
    logger.error("Update lead error", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message
    });
  }
};

/**
 * Delete lead
 */
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    logger.info(`Lead deleted: ${lead._id}`);

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    logger.error("Delete lead error", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message
    });
  }
};

/**
 * Filter leads
 */
const filterLeads = async (req, res) => {
  try {
    const { industry, location, source, company } = req.query;
    const filter = {};

    if (industry) filter.industry = new RegExp(industry, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (source) filter.source = source;
    if (company) filter.company = new RegExp(company, 'i');

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

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

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  filterLeads
};
