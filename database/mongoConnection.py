#!/usr/bin/env python3
"""
MongoDB Connection for Python scrapers
"""

from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../config/config.env')

class MongoDB:
    
    @staticmethod
    def get_mongo_db():
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        
        client = MongoClient(uri)
        
        # Database name
        db = client["leadscraper"]
        
        return db