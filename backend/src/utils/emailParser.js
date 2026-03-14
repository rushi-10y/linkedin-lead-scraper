/**
 * Extract emails from text
 * @param {string} text
 * @returns {Array<string>}
 */
function extractEmails(text) {
  if (!text) return [];

  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  const matches = text.match(emailRegex) || [];

  // Remove duplicates + lowercase
  return [...new Set(matches.map(email => email.toLowerCase()))];
}

module.exports = { extractEmails };
