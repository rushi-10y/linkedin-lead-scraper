import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { Menu, X } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Sidebar toggle (mobile only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1" />

      {/* User section */}
      <div className="flex items-center space-x-4">
        <span className="hidden sm:block text-sm text-gray-600">
          Welcome, {user?.name || 'User'}
        </span>

        <button
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold"
          aria-label="User menu"
        >
          {user?.name?.charAt(0) || 'U'}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
