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
    if (scraping) return; // prevent duplicate starts

    setScraping(true);
    setProgress(0);
    setResults([]);
    setError(null);

    // Simulated scraping
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearScraping();
          setScraping(false);

          // Use Excel data if available, otherwise fallback to sample data
          const excelResults = config.excelData && config.excelData.length > 0
            ? config.excelData.map((row, index) => ({
                id: crypto.randomUUID(),
                name: row['Name'] || row['Linkedin Name'] || `Person ${index + 1}`,
                email: row['Email'] || '', // Assuming no email column, or add if present
                company: row['Company Name'] || '',
                linkedinId: row['Linkedin ID'] || '',
                followers: row['Followers'] || '',
                position: row['Position'] || '',
                location: row['Location'] || '',
                roles: row['Roles'] || ''
              }))
            : [
                {
                  id: crypto.randomUUID(),
                  name: 'John Doe',
                  email: 'john@example.com',
                  company: 'Tech Corp'
                },
                {
                  id: crypto.randomUUID(),
                  name: 'Jane Smith',
                  email: 'jane@acme.com',
                  company: 'Acme Inc'
                }
              ];

          setResults(excelResults);

          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
