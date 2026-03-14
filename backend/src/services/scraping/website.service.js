const axios = require("axios");
const cheerio = require("cheerio");
const { extractEmails } = require("../../utils/emailParser");
const { extractPhones } = require("../../utils/phoneParser");

/**
 * Scrape a company website for lead data
 * @param {string} url
 * @returns {Array} leads
 */
async function scrapeWebsite(url) {
  const { data } = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120"
    }
  });

  const $ = cheerio.load(data);
  const text = $("body").text();

  const emails = extractEmails(text);
  const phones = extractPhones(text);

  const leads = emails.map((email, index) => ({
    email,
    phone: phones[index] || "",
    website: url,
    source: "website"
  }));

  return leads;
}

module.exports = { scrapeWebsite };
