import { Zap, Play, Search } from 'lucide-react'
import { useState } from 'react'

function ScrapeAdmin() {
  const [keywords, setKeywords] = useState('')
  const [location, setLocation] = useState('')

  const handleScrape = () => {
    // Trigger API scrape
    console.log('Scraping', keywords, location)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Scraping Controls</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            Manual Scrape
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React Developer, Fullstack Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="India, Remote"
              />
            </div>
            <button
              onClick={handleScrape}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 font-semibold"
            >
              <Play size={20} />
              <span>Start Scraping</span>
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Search className="w-8 h-8 text-purple-500 mr-3" />
            Recent Jobs
          </h2>
          <p className="text-gray-500">Recent scraping jobs and status will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default ScrapeAdmin

