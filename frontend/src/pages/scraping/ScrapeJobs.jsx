import React, { useState } from 'react';
import { useScraping } from '../../hooks/useScraping.js';
import Button from '../../components/common/Button.jsx';
import { Play, Square, RefreshCw, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const ScrapeJobs = () => {
  const {
    scraping,
    progress,
    results,
    startScraping,
    stopScraping
  } = useScraping();

  const [config, setConfig] = useState({
    keywords: '',
    location: '',
    maxResults: 100,
    excelData: []
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleStart = () => {
    if (!config.keywords.trim()) return;
    startScraping(config);
  };

  const handleStop = () => {
    stopScraping();
  };

  const handleClear = () => {
    stopScraping();
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Job Scraping
      </h1>

      <div className="max-w-2xl space-y-6">
        {/* Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Scraping Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Excel File
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const data = new Uint8Array(evt.target.result);
                      const workbook = XLSX.read(data, { type: 'array' });
                      const sheetName = workbook.SheetNames[0];
                      const worksheet = workbook.Sheets[sheetName];
                      const jsonData = XLSX.utils.sheet_to_json(worksheet);
                      setConfig({ ...config, excelData: jsonData });
                    };
                    reader.readAsArrayBuffer(file);
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <InputField
              label="Keywords"
              value={config.keywords}
              placeholder="e.g., Software Engineer, Product Manager"
              onChange={(v) =>
                setConfig({ ...config, keywords: v })
              }
            />

            <InputField
              label="Location"
              value={config.location}
              placeholder="e.g., San Francisco, CA"
              onChange={(v) =>
                setConfig({ ...config, location: v })
              }
            />

            <InputField
              label="Max Results"
              type="number"
              value={config.maxResults}
              min={1}
              max={1000}
              onChange={(v) =>
                setConfig({
                  ...config,
                  maxResults: Number(v) || 100
                })
              }
            />
          </div>

          <div className="flex gap-3 mt-6">
            {!scraping ? (
              <Button
                variant="primary"
                icon={Play}
                onClick={handleStart}
                disabled={!config.keywords.trim()}
              >
                Start Scraping
              </Button>
            ) : (
              <Button
                variant="danger"
                icon={Square}
                onClick={handleStop}
              >
                Stop Scraping
              </Button>
            )}

            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={handleClear}
              disabled={scraping && progress > 0}
            >
              Clear Results
            </Button>
          </div>
        </div>

        {/* Progress */}
        {scraping && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Progress
            </h2>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {progress}% Complete
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Results ({results.length})
            </h2>

            <div className="space-y-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium">{r.name}</h3>
                  <p className="text-sm text-gray-600">
                    {r.company}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.position}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.roles}
                  </p>
                  {r.linkedinId && (
                    <p className="text-sm text-gray-600">
                      LinkedIn ID: {r.linkedinId}
                    </p>
                  )}
                  {r.followers && (
                    <p className="text-sm text-gray-600">
                      Followers: {r.followers}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default ScrapeJobs;
