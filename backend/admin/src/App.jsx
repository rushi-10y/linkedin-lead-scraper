import { Routes, Route, Link, Outlet } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import LeadsAdmin from './pages/LeadsAdmin'
import ScrapeAdmin from './pages/ScrapeAdmin'
import api from './services/api'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">Lead Scraper Admin</Link>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Dashboard</Link>
              <Link to="/leads" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Leads</Link>
              <Link to="/scrape" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Scrape</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/leads" element={<LeadsAdmin />} />
          <Route path="/scrape" element={<ScrapeAdmin />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

