import React, { useRef, useState, useEffect } from 'react';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import { Play, Square, Clock } from 'lucide-react';

const ManualTrigger = () => {
  const [selectedScraper, setSelectedScraper] = useState('');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  const intervalRef = useRef(null);

  const scrapers = [
    { id: 'linkedin', name: 'LinkedIn Scraper', description: 'Scrape leads from LinkedIn' },
    { id: 'google', name: 'Google Search', description: 'Search for leads on Google' },
    { id: 'company_websites', name: 'Company Websites', description: 'Extract contacts from company sites' },
    { id: 'social_media', name: 'Social Media', description: 'Scrape from Twitter, Facebook, etc.' }
  ];

  const handleRunScraper = () => {
    if (!selectedScraper || running) return;

    setRunning(true);
    setProgress(0);
    setResults([]);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          setResults([
            { id: 1, name: 'John Doe', email: 'john@example.com', source: selectedScraper },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', source: selectedScraper },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', source: selectedScraper }
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleStopScraper = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Manual Scraping Trigger
      </h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Select Scraper
          </h2>

          <Select
            label="Scraper Type"
            value={selectedScraper}
            onChange={(e) => setSelectedScraper(e.target.value)}
            options={[
              { value: '', label: 'Choose a scraper...' },
              ...scrapers.map(s => ({
                value: s.id,
                label: s.name
              }))
            ]}
          />

          {selectedScraper && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">
                {scrapers.find(s => s.id === selectedScraper)?.name}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {scrapers.find(s => s.id === selectedScraper)?.description}
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {!running ? (
              <Button
                variant="primary"
                icon={Play}
                onClick={handleRunScraper}
                disabled={!selectedScraper}
              >
                Run Scraper
              </Button>
            ) : (
              <Button
                variant="danger"
                icon={Square}
                onClick={handleStopScraper}
              >
                Stop Scraper
              </Button>
            )}
          </div>
        </div>

        {running && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Scraping Progress
            </h2>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600">
              {progress}% Complete
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Results ({results.length})
            </h2>

            <div className="space-y-3">
              {results.map(result => (
                <div key={result.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-sm text-gray-600">{result.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    {result.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Manual Trigger Notice
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Manual scraping should be used sparingly to avoid rate limits.
                Prefer scheduled jobs for regular data collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualTrigger;
