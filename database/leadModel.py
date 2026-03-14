#!/usr/bin/env python3
"""
Lead Model operations using PyMongo
"""

from database.mongoConnection import MongoDB
from typing import Dict, List
import datetime

class LeadModel:
    @staticmethod
    def create_lead(lead_data: Dict) -> Dict:
        db = MongoDB.get_mongo_db()
        collection = db['leads']
        lead_data['created_at'] = datetime.datetime.now()
        lead_data['source'] = lead_data.get('source', 'python_scraper')
        result = collection.insert_one(lead_data)
        return collection.find_one({'_id': result.inserted_id})
    
    @staticmethod
    def get_leads(limit=50) -> List[Dict]:
        db = MongoDB.get_mongo_db()
        return list(db['leads'].find().sort('created_at', -1).limit(limit))
    
    @staticmethod
    def update_lead_status(linkedin_url: str, status: str):
        db = MongoDB.get_mongo_db()
        db['leads'].update_many(
            {'linkedin_url': linkedin_url},
            {'$set': {'status': status, 'updated_at': datetime.datetime.now()}}
        )
