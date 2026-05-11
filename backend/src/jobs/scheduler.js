const cron = require('node-cron');
const LeadScraperService = require('../services/scraping/leadScraper.service');
const Job = require('../models/Job.model');
const logger = require('../utils/logger');
let isRunning = false;

/**
 * Run scheduled scraper job (port cronScheduler.py)
 */
async function runScheduledScraper() {
  if (isRunning) {
    logger.warn('Scraper already running');
    return;
  }

  isRunning = true;
  
  const jobDoc = new Job({
    type: 'scrape',
    source: 'google_keywords',
    status: 'running',
    startedAt: new Date()
  });
  await jobDoc.save();

  try {
  await LeadScraperService.scrapeLeads({ keywordsFile: 'ERP india', platform: 'google' });
    
    jobDoc.status = 'completed';
    jobDoc.completedAt = new Date();
    await jobDoc.save();
    
    logger.info('✅ Daily scheduler job completed');
  } catch (error) {
    jobDoc.status = 'failed';
    jobDoc.errorMessage = error.message;
    jobDoc.completedAt = new Date();
    await jobDoc.save();
    
    logger.error(`❌ Scheduler job failed: ${error.message}`);
  } finally {
    isRunning = false;
  }
}

// Schedule daily at 2AM (cronScheduler.py equiv)
const scheduledJob = cron.schedule('0 2 * * *', runScheduledScraper, {
  scheduled: false // manual start
});

module.exports = {
  startScheduler: () => {
    scheduledJob.start();
    logger.info('📅 Scheduler started (daily 10AM)');
  },
  stopScheduler: () => {
    scheduledJob.stop();
    logger.info('⏹️ Scheduler stopped');
  },
  runScheduledScraper // for testing/manual
};

