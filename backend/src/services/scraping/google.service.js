const axios = require("axios");
const cheerio = require("cheerio");
const { extractEmails } = require("../../utils/emailParser");

/**
 * Scrape Google search results for leads
 * @param {string} query
 * @returns {Array} leads
 */
async function scrapeGoogle(query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    query
  )}&num=10`;

  const { data } = await axios.get(searchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120"
    }
  });

  const $ = cheerio.load(data);
  const leads = [];

  $("div.yuRUbf a").each((i, el) => {
    const website = $(el).attr("href");
    const title = $(el).find("h3").text();

    if (website) {
      leads.push({
        name: title || "N/A",
        website,
        source: "google"
      });
    }
  });

  return leads;
}

module.exports = { scrapeGoogle };
