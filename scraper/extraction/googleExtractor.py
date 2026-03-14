#!/usr/bin/env python3
"""
Google Search Lead Extractor
"""

import pandas as pd
from .browser.seleniumDriver import SeleniumBrowser

class GoogleExtractor:
    def __init__(self, browser):
        self.browser = browser
    
    def search_leads(self, keywords_file):
        """
        Extract leads from Google search (site:linkedin.com keywords)
        """
        df = pd.read_excel(keywords_file)
        leads = []
        
        for index, row in df.iterrows():
            query = f'site:linkedin.com/in "{row["keyword"]}" {row["location"]}'
            print(f"🔍 Searching: {query}")
            
            self.browser.get(f'https://www.google.com/search?q={query}')
            
            # Extract LinkedIn profiles from SERP
            profiles = self.browser.driver.find_elements("css selector", 'a[href*="linkedin.com/in"]')
            for profile in profiles[:5]:  # Top 5
                url = profile.get_attribute('href')
                leads.append({
                    'name': row['keyword'],
                    'linkedin_url': url,
                    'source': 'google_linkedin',
                    'keyword': row['keyword']
                })
        
        return leads
