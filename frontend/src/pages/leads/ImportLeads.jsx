import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import api from '../../services/api.js';

const ImportLeads = () => {
  const [loading, setLoading] = useState(false);

  const handleStartScraping = async () => {
    try {
      setLoading(true);

      const data = await api.post('/scrape', {
        source: 'google_keywords',
        keywordsFile: 'ERP india 100'
      });

      alert(`Scraping started! Found ${data.scraped || 0} leads 🚀`);
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Auto Lead Scraping</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        <p className="mb-6 text-gray-600 text-center">
          ERP leads from India (100 results)
        </p>

        <Button 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={handleStartScraping} 
          disabled={loading}
        >
          {loading ? 'Scraping...' : 'Start Scraping'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Uses Google → LinkedIn scraping
        </p>
      </div>
    </>
  );
};

export default ImportLeads;
