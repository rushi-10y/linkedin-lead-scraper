/**
 * Extract phone numbers from raw text or HTML
 * Supports international & Indian formats
 * @param {string} text
 * @returns {string[]} unique phone numbers
 */
function extractPhones(text = "") {
  if (!text) return [];

  const phoneRegex =
    /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}/g;

  const matches = text.match(phoneRegex) || [];

  // Clean, normalize & remove duplicates
  const cleaned = matches
    .map(phone => phone.replace(/\s+/g, "").replace(/[-()]/g, ""))
    .filter(phone => phone.length >= 8 && phone.length <= 15);

  return [...new Set(cleaned)];
}

module.exports = { extractPhones };
