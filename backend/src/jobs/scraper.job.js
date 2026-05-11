const { scrapeGoogle } = require("../services/scraping/google.service");
const { scrapeWebsite } = require("../services/scraping/website.service");
const { scrapeLinkedInPublic } = require("../services/scraping/linkedin.service");
const { bulkCreateLeads } = require("../services/lead.service");
const logger = require("../utils/logger");

/**
 * Background scraper job
 * @param {Object} jobData
 * {
 *   source: "google" | "website" | "linkedin",
 *   query?: string,
 *   url?: string
 * }
 */
async function runScraperJob(jobData) {
  try {
    logger.info(`Scraper job started: ${jobData.source}`);

    let leads = [];

    switch (jobData.source) {
      case "google":
        leads = await scrapeGoogle(jobData.query);
        break;

      case "google_keywords":
        const LeadScraperService = require("../services/scraping/leadScraper.service");
        const keywordsFile = jobData.keywordsFile || '../../../../../data/keywords.xlsx';
        return await LeadScraperService.scrapeLeads({ keywordsFile, platform: 'google' });

      case "website":
        leads = await scrapeWebsite(jobData.url);
        break;

      case "linkedin":
        leads = await scrapeLinkedInPublic(jobData.url);
        break;

      default:
        throw new Error("Invalid scraping source");
    }

    if (!leads.length) {
      logger.info("No leads found");
      return [];
    }

    const savedLeads = await bulkCreateLeads(leads);

    logger.info(
      `Scraper job completed. New leads saved: ${savedLeads.length}`
    );

    return savedLeads;
  } catch (error) {
    logger.error("Scraper job failed", error);
    throw error;
  }
}

module.exports = { runScraperJob };
