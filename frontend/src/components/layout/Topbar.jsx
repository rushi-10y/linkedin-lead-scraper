import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { Activity, Menu, Search, Sparkles, X } from 'lucide-react';

const routeLabels = {
  '/dashboard': { title: 'Command Center', copy: 'Monitor pipeline momentum and signal quality.' },
  '/leads': { title: 'Lead Vault', copy: 'Review, qualify, and enrich every prospect record.' },
  '/scraping': { title: 'Signal Capture', copy: 'Launch premium scraping workflows and watch job health.' },
  '/companies': { title: 'Accounts', copy: 'Track company intelligence and buying committees.' },
  '/reports': { title: 'Insights', copy: 'Turn every scrape into revenue-grade reporting.' },
  '/settings': { title: 'Settings', copy: 'Shape your workspace, permissions, and automations.' }
};

const Topbar = () => {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();

  const route =
    Object.entries(routeLabels).find(([prefix]) => location.pathname.startsWith(prefix))?.[1] ||
    routeLabels['/dashboard'];

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="page-shell px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div>
              <span className="section-label mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Live Workspace
              </span>
              <h2 className="text-2xl font-semibold text-slate-50">{route.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{route.copy}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[220px] flex-1 sm:flex-none sm:min-w-[280px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search leads, jobs, or sources"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 pl-11 pr-20 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Search
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.12] p-2 text-cyan-100">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{user?.name || 'Control User'}</p>
                <p className="text-xs text-slate-500">Realtime sync enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
