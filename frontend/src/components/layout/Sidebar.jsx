import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import {
  BarChart3,
  Users,
  Search,
  Database,
  TrendingUp,
  Settings,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();

  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: '/leads', label: 'Leads', icon: Users },
    { id: '/scraping', label: 'Scraping', icon: Search },
    { id: '/companies', label: 'Companies', icon: Database },
    { id: '/reports', label: 'Reports', icon: TrendingUp },
    { id: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static z-50 w-64 h-screen bg-gray-900 text-white flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">LeadScraper Pro</h1>
            <p className="text-sm text-gray-400 mt-1 truncate">
              {user?.email}
            </p>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.id);
            return (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900'
                    : 'hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
