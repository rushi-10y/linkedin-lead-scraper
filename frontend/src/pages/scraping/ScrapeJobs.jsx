import React, { useEffect, useMemo, useState } from 'react';
import { Database, MapPin, Search, Sparkles } from 'lucide-react';

import { useLeads } from '../../context/LeadContext.jsx';
import leadService from '../../services/lead.service.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Table from '../../components/common/Table.jsx';

const ScrapeJobs = () => {
  const { leads, loading, fetchLeads } = useLeads();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const tableRows = useMemo(() => {
    return results.length > 0 ? results : leads;
  }, [results, leads]);

  const handleScrape = async (event) => {
    event.preventDefault();

    if (!keyword.trim() || !location.trim() || scraping) {
      return;
    }

    setScraping(true);
    setMessage('');

    try {
      const response = await leadService.scrapeLeads({
        keyword: keyword.trim(),
        location: location.trim()
      });

      const storedLeads = response.data || [];
      setResults(storedLeads);
      setMessage(
        `Stored ${response.meta?.stored || storedLeads.length} leads for "${keyword.trim()}" in "${location.trim()}".`
      );

      await fetchLeads();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setScraping(false);
    }
  };

  const messageTone = message.startsWith('Error')
    ? 'border-rose-300/20 bg-rose-500/10 text-rose-200'
    : 'border-emerald-300/20 bg-emerald-500/10 text-emerald-200';

  return (
    <div className="space-y-6">
      <section className="page-shell px-6 py-7 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="section-label mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Lead Scraping
            </span>
            <h1 className="page-title">Search by keyword and location, then store the results straight into MongoDB.</h1>
            <p className="page-copy mt-4 max-w-2xl">
              This flow uses manual input only. Enter the market you want, start the scrape, and the app will persist at least five leads before showing them back in the workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="kpi-pill">Manual input only</span>
              <span className="kpi-pill">Minimum 5 leads guaranteed</span>
              <span className="kpi-pill">MongoDB-backed results</span>
            </div>
          </div>

          <div className="panel-muted px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Flow summary
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <p>1. Enter a keyword such as `ERP consultant` or `digital agency`.</p>
              <p>2. Enter a location such as `Bangalore` or `New York`.</p>
              <p>3. Start scraping and review the stored leads immediately below.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="panel px-6 py-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">Manual lead search</h2>
              <p className="mt-2 text-sm text-slate-400">
                No saved configs, no stored defaults, just the exact search you want to run now.
              </p>
            </div>
          </div>

          <form onSubmit={handleScrape} className="space-y-2">
            <Input
              label="Keyword"
              name="keyword"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="ERP consultant"
              required
              disabled={scraping}
            />

            <Input
              label="Location"
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Bangalore"
              required
              disabled={scraping}
            />

            <Button
              type="submit"
              variant="gradient"
              size="xl"
              icon={MapPin}
              className="mt-3 w-full"
              disabled={scraping || !keyword.trim() || !location.trim()}
            >
              {scraping ? 'Scraping leads...' : 'Start Scraping'}
            </Button>
          </form>

          {message && (
            <p className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${messageTone}`}>
              {message}
            </p>
          )}
        </div>

        <div className="panel px-6 py-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 p-3 text-emerald-100">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">Stored leads</h2>
              <p className="mt-2 text-sm text-slate-400">
                These rows are returned from the backend and stored in MongoDB.
              </p>
            </div>
          </div>

          <Table
            loading={loading || scraping}
            emptyMessage="Run a scrape to load at least five leads."
            rowKey="_id"
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'address', label: 'Address' },
              { key: 'phone', label: 'Phone' },
              {
                key: 'website',
                label: 'Website',
                render: (value) =>
                  value ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4"
                    >
                      {value.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    '--'
                  )
              }
            ]}
            data={tableRows}
          />
        </div>
      </section>
    </div>
  );
};

export default ScrapeJobs;
