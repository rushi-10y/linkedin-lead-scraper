import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { Search, Users, Building } from 'lucide-react';

const LinkedInInput = () => {
  const [searchType, setSearchType] = useState('people');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!query.trim() || searching) return;

    setSearching(true);
    setMessage('');

    // Simulate LinkedIn search
    await new Promise((res) => setTimeout(res, 3000));

    setSearching(false);
    setMessage(
      `Searching ${searchType === 'people' ? 'People' : 'Companies'} for “${query}”${
        location ? ` in ${location}` : ''
      }`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        LinkedIn Lead Scraping
      </h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Search Configuration
          </h2>

          {/* Search Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Search Type
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="people"
                  checked={searchType === 'people'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <Users className="w-4 h-4" />
                People
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="companies"
                  checked={searchType === 'companies'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <Building className="w-4 h-4" />
                Companies
              </label>
            </div>
          </div>

          {/* Query */}
          <Input
            label="Search Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'people'
                ? 'e.g., "Software Engineer" OR "Product Manager"'
                : 'e.g., "SaaS Startup" OR "Fintech Company"'
            }
            required
          />

          {/* Location */}
          <Input
            label="Location (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., San Francisco, Remote"
          />

          <Button
            variant="primary"
            icon={Search}
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="w-full mt-4"
          >
            {searching
              ? 'Searching LinkedIn…'
              : `Search ${searchType === 'people' ? 'People' : 'Companies'}`}
          </Button>

          {message && (
            <p className="text-sm text-green-600 mt-3">
              {message}
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            LinkedIn Search Tips
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Use quotes for exact phrases: “Software Engineer”</li>
            <li>• Use OR for alternatives: “CEO” OR “Founder”</li>
            <li>• Add locations for precision</li>
            <li>• Include industry keywords</li>
            <li>• Combine logic: (“PM” OR “Product Manager”) AND “SaaS”</li>
          </ul>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Important Notice
          </h3>
          <p className="text-sm text-yellow-700">
            LinkedIn scraping must comply with their Terms of Service.
            Respect rate limits and prefer official APIs for production use.
          </p>
        </div>
      </div>
    </>
  );
};

export default LinkedInInput;
