const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Scrape public LinkedIn page (company / profile)
 * @param {string} url
 * @returns {Array} leads
 */
async function scrapeLinkedInPublic(url) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      "Accept-Language": "en-US,en;q=0.9"
    },
    timeout: 10000
  });

  const $ = cheerio.load(data);
  const leads = [];

  // Public LinkedIn pages usually expose basic meta info
  const name =
    $("h1").first().text().trim() ||
    $("title").text().split("|")[0].trim();

  const designation =
    $("h2").first().text().trim() || "N/A";

  leads.push({
    name,
    designation,
    linkedin: url,
    source: "linkedin"
  });

  return leads;
}

module.exports = { scrapeLinkedInPublic };
