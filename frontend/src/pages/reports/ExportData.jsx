import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const ExportData = () => {
  const [exportType, setExportType] = useState('leads');
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (exporting) return;

    setExporting(true);
    setMessage('');

    // Simulate export
    await new Promise((res) => setTimeout(res, 2000));

    setExporting(false);
    setMessage(
      `Exported ${exportType} data as ${format.toUpperCase()}`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>

      <div className="max-w-2xl space-y-6">
        {/* Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Export Configuration
          </h2>

          <Select
            label="Data Type"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            options={[
              { value: 'leads', label: 'Leads Data' },
              { value: 'companies', label: 'Companies Data' },
              { value: 'activities', label: 'Activity Log' },
              { value: 'reports', label: 'Generated Reports' }
            ]}
          />

          <Select
            label="Export Format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { value: 'csv', label: 'CSV' },
              { value: 'xlsx', label: 'Excel (XLSX)' },
              { value: 'json', label: 'JSON' },
              { value: 'pdf', label: 'PDF Report' }
            ]}
          />

          <Select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'last30', label: 'Last 30 Days' },
              { value: 'last90', label: 'Last 90 Days' },
              { value: 'last365', label: 'Last Year' },
              { value: 'custom', label: 'Custom Range' }
            ]}
          />

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4">
            Exporting <strong>{exportType}</strong> as{' '}
            <strong>{format.toUpperCase()}</strong>
          </p>

          <Button
            variant="primary"
            icon={Download}
            onClick={handleExport}
            disabled={exporting}
            className="w-full mt-6"
          >
            {exporting ? 'Exporting…' : 'Export Data'}
          </Button>

          {message && (
            <p className="text-green-600 text-sm mt-3">
              {message}
            </p>
          )}
        </div>

        {/* Formats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Export Formats
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormatCard
              icon={FileSpreadsheet}
              color="text-green-600"
              title="CSV"
              desc="Simple spreadsheet format"
            />
            <FormatCard
              icon={FileSpreadsheet}
              color="text-blue-600"
              title="Excel"
              desc="Advanced spreadsheet features"
            />
            <FormatCard
              icon={FileText}
              color="text-gray-600"
              title="JSON"
              desc="Structured data format"
            />
            <FormatCard
              icon={FileText}
              color="text-red-600"
              title="PDF"
              desc="Formatted report"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FormatCard = ({ icon: Icon, color, title, desc }) => (
  <div className="flex items-center p-4 border rounded-lg">
    <Icon className={`w-8 h-8 mr-3 ${color}`} />
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  </div>
);

export default ExportData;
