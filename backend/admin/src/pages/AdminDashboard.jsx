import { useEffect, useState } from 'react'
import { BarChart3, Database, Zap } from 'lucide-react'
import api from '../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({ leads: 0, jobs: 0, scrapes: 0 })

  useEffect(() => {
    api.get('/leads').then(res => setStats({ leads: res.data.length }))
      .catch(console.error)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <BarChart3 className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">{stats.leads}</h2>
          <p className="text-gray-600">Total Leads</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Database className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">{stats.jobs}</h2>
          <p className="text-gray-600">Scraping Jobs</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Zap className="w-12 h-12 text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">{stats.scrapes}</h2>
          <p className="text-gray-600">Recent Scrapes</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

