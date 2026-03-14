import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { Search, Plus, X } from 'lucide-react';

const MAX_KEYWORDS = 5;

const KeywordInput = () => {
  const [keywords, setKeywords] = useState(['']);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');

  const addKeyword = () => {
    if (keywords.length >= MAX_KEYWORDS) return;
    setKeywords([...keywords, '']);
  };

  const removeKeyword = (index) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const updateKeyword = (index, value) => {
    const updated = [...keywords];
    updated[index] = value;
    setKeywords(updated);
  };

  const validKeywords = keywords
    .map(k => k.trim())
    .filter(Boolean);

  const handleSearch = async () => {
    if (validKeywords.length === 0 || searching) return;

    setSearching(true);
    setMessage('');

    // Simulate search
    await new Promise((res) => setTimeout(res, 2000));

    setSearching(false);
    setMessage(`Searching for: ${validKeywords.join(', ')}`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Keyword-Based Lead Search
      </h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Search Keywords
          </h2>

          <div className="space-y-3 mb-6">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={keyword}
                  onChange={(e) =>
                    updateKeyword(index, e.target.value)
                  }
                  placeholder={`Keyword ${index + 1}`}
                />

                {keywords.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              icon={Plus}
              onClick={addKeyword}
              disabled={keywords.length >= MAX_KEYWORDS}
            >
              Add Keyword
            </Button>

            <Button
              variant="primary"
              icon={Search}
              onClick={handleSearch}
              disabled={searching || validKeywords.length === 0}
            >
              {searching ? 'Searching…' : 'Search Leads'}
            </Button>
          </div>

          {message && (
            <p className="text-sm text-green-600 mt-4">
              {message}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Max {MAX_KEYWORDS} keywords allowed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Search Tips
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Use specific job titles (e.g., “CTO”, “Marketing Manager”)</li>
            <li>• Include location keywords (e.g., “Remote”, “Bangalore”)</li>
            <li>• Add industry terms (e.g., “SaaS”, “Fintech”)</li>
            <li>• Combine keywords for precise targeting</li>
            <li>• Avoid overly generic terms</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default KeywordInput;
