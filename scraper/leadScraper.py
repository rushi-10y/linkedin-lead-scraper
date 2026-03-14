#!/usr/bin/env python3
"""
Main Lead Scraper Orchestrator for erpnext-lead-scraper
"""

import sys
import os
from browser.seleniumDriver import SeleniumBrowser
from extraction.googleExtractor import GoogleExtractor
from processor.leadCleaner import LeadCleaner
from database.mongoConnection import get_mongo_db

def main(keywords_file=None, urls=None, platform='linkedin'):
    """
    Main scraping workflow
    """
    print("🚀 Starting Lead Scraper...")
    
    # Init components
    browser = SeleniumBrowser()
    extractor = GoogleExtractor(browser)
    cleaner = LeadCleaner()
    
    leads = []
    
    try:
        # Extract leads
        if platform == 'google':
            leads = extractor.search_leads(keywords_file)
        elif platform == 'linkedin':
            leads = extractor.scrape_linkedin(urls)
        
        # Clean data
        cleaned_leads = cleaner.process(leads)
        
        # Save to MongoDB
        db = get_mongo_db()
        collection = db['leads']
        result = collection.insert_many(cleaned_leads)
        print(f"✅ Saved {len(result.inserted_ids)} leads to database")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        browser.quit()

if __name__ == "__main__":
    main()
