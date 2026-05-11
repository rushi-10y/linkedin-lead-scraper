const Lead = require('../../models/Lead.model');
const PuppeteerBrowser = require('./browser/puppeteerBrowser');
const GoogleExtractor = require('./extraction/googleExtractor.service');
const LeadCleaner = require('./processor/leadCleaner.service');
class LeadScraperService {
  async scrapeLeads({ keywordsFile, urls, platform = 'google' } = {}) {
    console.log('🚀 Starting Lead Scraper...');
    
    const browser = new PuppeteerBrowser(true);
    const extractor = new GoogleExtractor(browser);
    const cleaner = new LeadCleaner();
    
    let leads = [];
    
    try {
      await browser.setupDriver();

      // Extract leads
      if (platform === 'google' && keywordsFile) {
        leads = await extractor.searchLeads(keywordsFile);
      } else if (platform === 'linkedin' && urls) {
        // Future: linkedin scraper
        console.log('LinkedIn platform not implemented yet');
      }
      
      // Clean data
      const cleanedLeads = cleaner.process(leads);
      
      // Save to MongoDB using model static
      for (const lead of cleanedLeads) {
        await Lead.createLead(lead);
      }
      
      console.log(`✅ Saved ${cleanedLeads.length} leads to database`);
      return cleanedLeads;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

module.exports = new LeadScraperService();

