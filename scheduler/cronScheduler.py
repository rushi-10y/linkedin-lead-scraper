#!/usr/bin/env python3
"""
Cron-like Scheduler for Automated Scraping
"""

import schedule
import time
import subprocess
import os
from database.mongoConnection import get_mongo_db

def run_scraper():
    """
    Run lead scraper job
    """
    try:
        result = subprocess.run([
            'python', os.path.join(os.path.dirname(__file__), '../scraper/leadScraper.py'),
            '--keywords=data/keywords.xlsx'
        ], capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print("✅ Scheduler job completed")
        else:
            print(f"❌ Job failed: {result.stderr}")
    except Exception as e:
        print(f"❌ Scheduler error: {e}")

def main():
    # Schedule daily at 2AM
    schedule.every().day.at("02:00").do(run_scraper)
    
    # Log current jobs to Mongo
    db = get_mongo_db()
    db.jobs.insert_one({'type': 'scraper', 'status': 'scheduled', 'scheduled_at': time.time()})
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    main()
