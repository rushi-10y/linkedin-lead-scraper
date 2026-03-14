#!/usr/bin/env python3
"""
Selenium Browser Manager with stealth features
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

class SeleniumBrowser:
    def __init__(self, headless=True):
        self.driver = None
        self.setup_driver(headless)
    
    def setup_driver(self, headless):
        options = Options()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    def get(self, url):
        self.driver.get(url)
        time.sleep(2)
    
    def wait_for_element(self, selector, timeout=10):
        wait = WebDriverWait(self.driver, timeout)
        return wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    
    def quit(self):
        if self.driver:
            self.driver.quit()
