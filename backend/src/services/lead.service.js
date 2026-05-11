const Lead = require("../models/Lead.model");
const logger = require("../utils/logger");

function cleanText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeLeadData(leadData = {}) {
  return {
    name: cleanText(leadData.name),
    address: cleanText(leadData.address),
    email: cleanText(leadData.email).toLowerCase(),
    phone: cleanText(leadData.phone),
    company: cleanText(leadData.company),
    designation: cleanText(leadData.designation),
    industry: cleanText(leadData.industry),
    location: cleanText(leadData.location),
    keyword: cleanText(leadData.keyword),
    website: cleanText(leadData.website),
    linkedin_url: cleanText(leadData.linkedin_url || leadData.linkedin),
    linkedin: cleanText(leadData.linkedin),
    source: leadData.source || "manual",
    status: leadData.status || "scraped",
    emails: Array.isArray(leadData.emails) ? leadData.emails : [],
    phones: Array.isArray(leadData.phones) ? leadData.phones : []
  };
}

function buildLeadFilter(leadData) {
  if (leadData.website) {
    return {
      website: leadData.website,
      keyword: leadData.keyword || "",
      location: leadData.location || ""
    };
  }

  return {
    name: leadData.name,
    keyword: leadData.keyword || "",
    location: leadData.location || ""
  };
}

async function createLead(leadData) {
  const lead = new Lead(normalizeLeadData(leadData));
  await lead.save();
  logger.info(`Lead created: ${lead._id}`);
  return lead;
}

async function saveScrapedLeads(leads = []) {
  const saved = [];

  for (const leadData of leads) {
    const normalizedLead = normalizeLeadData(leadData);
    if (!normalizedLead.name) {
      continue;
    }

    try {
      const lead = await Lead.findOneAndUpdate(
        buildLeadFilter(normalizedLead),
        { $set: normalizedLead },
        {
          new: true,
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      saved.push(lead);
    } catch (error) {
      logger.error(`Failed to save lead: ${JSON.stringify(normalizedLead)}`, error);
    }
  }

  logger.info(`Saved ${saved.length} scraped leads`);
  return saved;
}

async function bulkCreateLeads(leads) {
  return saveScrapedLeads(leads);
}

async function getLeads(page = 1, limit = 50, filters = {}) {
  const query = {};

  if (filters.keyword) {
    query.keyword = new RegExp(filters.keyword, "i");
  }

  if (filters.location) {
    query.location = new RegExp(filters.location, "i");
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.company) {
    query.company = new RegExp(filters.company, "i");
  }

  const skip = (page - 1) * limit;
  const leads = await Lead.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Lead.countDocuments(query);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

async function updateLead(id, updateData) {
  const lead = await Lead.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  logger.info(`Lead updated: ${id}`);
  return lead;
}

async function deleteLead(id) {
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new Error("Lead not found");
  }

  logger.info(`Lead deleted: ${id}`);
  return lead;
}

async function filterLeads(filterQuery) {
  const filter = {};

  if (filterQuery.industry) {
    filter.industry = new RegExp(filterQuery.industry, "i");
  }

  if (filterQuery.location) {
    filter.location = new RegExp(filterQuery.location, "i");
  }

  if (filterQuery.keyword) {
    filter.keyword = new RegExp(filterQuery.keyword, "i");
  }

  if (filterQuery.source) {
    filter.source = filterQuery.source;
  }

  if (filterQuery.company) {
    filter.company = new RegExp(filterQuery.company, "i");
  }

  return Lead.find(filter).sort({ createdAt: -1 });
}

module.exports = {
  createLead,
  saveScrapedLeads,
  bulkCreateLeads,
  getLeads,
  updateLead,
  deleteLead,
  filterLeads
};
