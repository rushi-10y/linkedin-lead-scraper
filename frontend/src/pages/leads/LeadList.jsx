import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search } from 'lucide-react';

import { useLeads } from '../../context/LeadContext.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';

const LeadList = () => {
  const navigate = useNavigate();
  const { leads, loading, fetchLeads } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Stored Leads</h1>
          <p className="mt-2 text-sm text-slate-400">
            Every lead here comes from MongoDB and reflects the latest manual scrape runs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon={RefreshCw} onClick={fetchLeads}>
            Refresh
          </Button>
          <Button variant="gradient" icon={Search} onClick={() => navigate('/scraping/jobs')}>
            Open Scraper
          </Button>
        </div>
      </div>

      <Table
        rowKey="_id"
        emptyMessage="No leads stored yet. Run a scrape to populate MongoDB."
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
          },
          { key: 'keyword', label: 'Keyword' },
          { key: 'location', label: 'Location' }
        ]}
        data={leads}
      />
    </div>
  );
};

export default LeadList;
