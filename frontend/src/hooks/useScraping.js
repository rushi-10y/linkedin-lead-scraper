 import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export const useScraping = () => {
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const intervalRef = useRef(null);

  const clearScraping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startScraping = async (config) => {
    if (scraping) return;

    const controller = new AbortController();
    setScraping(true);
    setProgress(0);
    setResults([]);
    setError(null);

    try {
      // Simulate progress during API call (long-running)
      intervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 80));
      }, 800);

      let url = config.url || '';
      let options = config.options || {};
      let excelData = config.excelData || [];

      if (config.keywords && !url) {
        const keywords = config.keywords.trim();
        const location = config.location?.trim() || 'Worldwide';
        url = `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;
      }

      if (!url) throw new Error('URL is required for API scraping');

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          source: 'api',
          url,
          options: {
            javascript_rendering: options.javascript_rendering || false,
            generate_screenshot: options.generate_screenshot || false,
            country_code: options.country_code || 'None',
            device_type: options.device_type || 'desktop',
            session_number: options.session_number || 1,
            max_cost: options.max_cost,
            disable_follow_redirects: options.disable_follow_redirects || false,
            retry_404_responses: options.retry_404_responses || false,
            ...options // extra options
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const { leads } = await response.json();

      // Transform backend leads to frontend format
      const transformedResults = leads.map(lead => ({
        id: crypto.randomUUID(),
        name: 'Lead from ' + new URL(lead.website || url).hostname,
        email: lead.email || '',
        company: lead.website ? lead.website.replace(/^https?:\/\//, '').replace(/\/+/g, '') : '',
        phone: lead.phone || '',
        linkedinId: '',
        position: '',
        location: '',
        website: lead.website || url,
        rawContent: lead.rawContent
      }));

      // Merge with excel if provided (full mapping)
      const finalResults = excelData && excelData.length > 0 
        ? [...transformedResults, ...excelData.map((row, i) => ({
            id: crypto.randomUUID(),
            name: row.Name || row['Linkedin Name'] || `Person ${i+1}`,
            email: row.Email || row['Email'] || '',
            company: row['Company Name'] || '',
            linkedinId: row['Linkedin ID'] || '',
            followers: row.Followers || row['Followers'] || '',
            position: row.Position || row['Position'] || '',
            location: row.Location || row['Location'] || '',
            roles: row.Roles || row['Roles'] || ''
          }))]
        : transformedResults;

      setResults(finalResults);
      setProgress(100);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      clearScraping();
      setScraping(false);
      setProgress(0);
    }
  };

  const stopScraping = () => {
    clearScraping();
    setScraping(false);
    setProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearScraping();
  }, []);

  return {
    scraping,
    progress,
    results,
    error,
    startScraping,
    stopScraping
  };
};
