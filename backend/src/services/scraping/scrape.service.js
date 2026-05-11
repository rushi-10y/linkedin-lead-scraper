const { scrapeGoogle } = require('./google.service');
const { scrapeWebsite } = require('./website.service');
const { scrapeLinkedInPublic } = require('./linkedin.service');
const { scrapeThirdParty } = require('./thirdParty.service');

module.exports = {
  scrapeGoogle,
  scrapeWebsite,
  scrapeLinkedInPublic,
  scrapeThirdParty
};
