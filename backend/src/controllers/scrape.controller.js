const {
  scrapeGoogle,
  scrapeWebsite,
  scrapeLinkedInPublic
} = require("../services/scraping/scrape.service");

/**
 * Trigger scraping based on source
 * Body:
 * {
 *   "source": "google | website | linkedin",
 *   "query": "ERP consultants in India",
 *   "url": "https://example.com"
 * }
 */
exports.startScraping = async (req, res, next) => {
  try {
    const { source, query, url } = req.body;

    if (!source) {
      return res.status(400).json({ message: "Scraping source is required" });
    }

    let result;

    switch (source) {
      case "google":
        if (!query)
          return res.status(400).json({ message: "Query is required" });
        result = await scrapeGoogle(query);
        break;

      case "website":
        if (!url)
          return res.status(400).json({ message: "URL is required" });
        result = await scrapeWebsite(url);
        break;

      case "linkedin":
        if (!url)
          return res.status(400).json({ message: "LinkedIn public URL required" });
        result = await scrapeLinkedInPublic(url);
        break;

      default:
        return res.status(400).json({ message: "Invalid scraping source" });
    }

    res.status(200).json({
      success: true,
      source,
      totalLeads: result.length,
      leads: result
    });

  } catch (error) {
    next(error);
  }
};
