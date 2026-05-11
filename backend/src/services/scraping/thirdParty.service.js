const axios = require("axios");
const cheerio = require("cheerio");
const { extractEmails } = require("../../utils/emailParser");
const { extractPhones } = require("../../utils/phoneParser");
const config = require("../../config/env");

/**
 * Scrape using third-party Structured Data API
 * @param {string} url - Target URL to scrape
 * @param {Object} options - API options
 * @returns {Array} leads
 */
async function scrapeThirdParty(url, options = {}) {
const apiKey = config.SCRAPING_API_KEY;
  if (!apiKey) {
    throw new Error("SCRAPING_API_KEY not configured");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    url: url,
    render_js: options.javascript_rendering ? '1' : '0',
    screenshot: options.generate_screenshot ? '1' : '0',
    country_code: options.country_code || 'None',
    device_type: options.device_type || 'desktop',
    session_number: options.session_number || 1,
    max_cost: options.max_cost || undefined,
    no_follow_redirects: options.disable_follow_redirects ? '1' : '0',
    retry_404: options.retry_404_responses ? '1' : '0',
  });

  // Remove undefined params
  params.forEach((value, key) => {
    if (value === undefined || value === '') params.delete(key);
  });

  const apiUrl = `https://api.scrapingapi.com/scraping?${params}`;

  const { data } = await axios.get(apiUrl, {
    timeout: 30000, // Longer timeout for JS rendering
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
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
    source: "third-party-api",
    rawContent: data.substring(0, 1000) + "..." // First 1KB for debugging
  }));

  return leads;
}

module.exports = { scrapeThirdParty };

