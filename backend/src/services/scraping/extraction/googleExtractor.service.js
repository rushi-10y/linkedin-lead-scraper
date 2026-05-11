// const XLSX = require('xlsx');
const PuppeteerBrowser = require('../browser/puppeteerBrowser');
const path = require('path');

class GoogleExtractor {
  constructor(browser) {
    this.browser = browser;
  }

async searchLeads(keywordsFile = 'ERP india') {
  const [keyword, location] = keywordsFile.split(' ');
  const query = `site:linkedin.com/in "${keyword}" ${location}`;
  console.log(`🔍 Searching: ${query}`);
  
  await this.browser.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
  
  const profiles = await this.browser.page.$$eval('a[href*="linkedin.com/in"]', anchors => 
    anchors.slice(0, 5).map(a => a.href).filter(href => href.includes('linkedin.com/in'))
  );
  
  const leads = profiles.map(url => ({
    name: keyword,
    linkedin_url: url,
    source: 'google_linkedin',
    keyword,
    location
  }));
  
  return leads;
  }
}

module.exports = GoogleExtractor;
