const leadService = require("../services/lead.service");
const {
  MINIMUM_LEADS,
  scrapeLeadsByKeywordAndLocation
} = require("../services/scraping/manualLeadScrape.service");

exports.startScraping = async (req, res) => {
  try {
    const keyword = req.body.keyword?.trim() || req.body.query?.trim();
    const location = req.body.location?.trim() || req.body.options?.location?.trim();

    if (!keyword || !location) {
      return res.status(400).json({
        success: false,
        message: "Keyword and location are required"
      });
    }

    const scrapedLeads = await scrapeLeadsByKeywordAndLocation({ keyword, location });
    const savedLeads = await leadService.saveScrapedLeads(scrapedLeads);

    res.json({
      success: true,
      message: `Stored ${savedLeads.length} leads`,
      keyword,
      location,
      minimumRequested: MINIMUM_LEADS,
      scraped: savedLeads.length,
      saved: savedLeads.length,
      data: savedLeads
    });
  } catch (error) {
    console.error("Scraping error:", error);

    res.status(500).json({
      success: false,
      message: "Scraping failed",
      error: error.message
    });
  }
};
