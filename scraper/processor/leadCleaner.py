#!/usr/bin/env python3
"""
Lead Data Cleaner and Normalizer
"""

import re
import json
from typing import List, Dict

class LeadCleaner:
    def __init__(self):
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        self.phone_pattern = re.compile(r'[\+]?[1-9][\d]{0,15}$')
    
    def process(self, leads: List[Dict]) -> List[Dict]:
        """
        Clean and normalize leads
        """
        cleaned = []
        for lead in leads:
            clean_lead = self._clean_single(lead)
            if self._is_valid_lead(clean_lead):
                cleaned.append(clean_lead)
        return cleaned
    
    def _clean_single(self, lead: Dict) -> Dict:
        clean = lead.copy()
        clean['name'] = self._clean_name(clean.get('name', ''))
        clean['emails'] = list(self.email_pattern.findall(str(clean.get('linkedin_url', '')) + str(clean.get('bio', ''))))
        clean['phones'] = self._extract_phones(clean)
        clean['company'] = self._extract_company(clean.get('linkedin_url', ''))
        return clean
    
    def _clean_name(self, name: str) -> str:
        return ' '.join(name.split())[:100].strip()
    
    def _extract_phones(self, lead: Dict) -> List[str]:
        # Extract from bio/text
        text = str(lead.get('bio', '') + lead.get('description', ''))
        return self.phone_pattern.findall(text)
    
    def _extract_company(self, url: str) -> str:
        return url.split('/company/')[-1].split('?')[0] if '/company/' in url else ''
    
    def _is_valid_lead(self, lead: Dict) -> bool:
        return bool(lead.get('name'))
