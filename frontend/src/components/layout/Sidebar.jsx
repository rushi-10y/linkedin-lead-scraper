import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import {
  BarChart3,
  Building2,
  ChevronRight,
  LogOut,
  Search,
  Settings2,
  Sparkles,
  Users,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();

  const menuItems = [
    { id: '/dashboard', label: 'Command Center', icon: BarChart3, hint: 'Overview' },
    { id: '/leads', label: 'Lead Vault', icon: Users, hint: 'Pipeline' },
    { id: '/scraping', label: 'Signal Capture', icon: Search, hint: 'Automation' },
    { id: '/companies', label: 'Accounts', icon: Building2, hint: 'Targets' },
    { id: '/reports', label: 'Insights', icon: BarChart3, hint: 'Reports' },
    { id: '/settings', label: 'Settings', icon: Settings2, hint: 'Workspace' }
  ];

  const stackHealth = [
    { label: 'Crawler', status: 'Ready' },
    { label: 'Enrichment', status: 'Stable' },
    { label: 'Exports', status: 'Synced' }
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/[0.72] backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[18.5rem] flex-col border-r border-white/10 bg-slate-950/[0.88] px-5 py-5 text-white backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="section-label mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Midnight Ops
            </span>
            <h1 className="text-2xl font-semibold text-slate-50">LeadScraper Pro</h1>
            <p className="mt-2 max-w-[14rem] text-sm text-slate-400">
              A cinematic outbound workspace for fast-moving revenue teams.
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="panel-muted mb-6 px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Operator
            </span>
            <span className="rounded-full bg-emerald-400/[0.12] px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-300">
              Live
            </span>
          </div>
          <p className="text-base font-semibold text-slate-100">{user?.name || 'Control User'}</p>
          <p className="mt-1 truncate text-sm text-slate-400">{user?.email || 'ops@leadscraper.io'}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.id);

            return (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center justify-between rounded-[22px] border px-4 py-3 transition duration-300 ${
                  isActive
                    ? 'border-cyan-300/25 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(14,165,233,0.08))] text-white shadow-[0_18px_40px_rgba(34,211,238,0.12)]'
                    : 'border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl border p-2 ${isActive ? 'border-cyan-200/20 bg-cyan-300/[0.12] text-cyan-100' : 'border-white/10 bg-white/[0.03]'}`}>
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.hint}</p>
                  </div>
                </div>

                <ChevronRight className={`h-4 w-4 transition ${isActive ? 'translate-x-0 text-cyan-200' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="panel-muted mt-6 px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Stack Health
            </span>
            <span className="text-xs text-cyan-200">99.2%</span>
          </div>

          <div className="space-y-3">
            {stackHealth.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-rose-300/20 hover:bg-rose-400/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Exit Workspace
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
