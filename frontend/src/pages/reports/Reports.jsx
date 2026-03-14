import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import BarChart from '../../components/charts/BarChart.jsx';
import PieChart from '../../components/charts/PieChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { Download, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('leads');
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const [chartData, setChartData] = useState({
    barData: [],
    pieData: []
  });

  const metrics = [
    { label: 'Total Leads', value: 245, color: 'text-blue-600' },
    { label: 'Conversion Rate', value: '32%', color: 'text-green-600' },
    { label: 'Avg Deal Size', value: '$45,230', color: 'text-yellow-600' },
    { label: 'Active Campaigns', value: 89, color: 'text-purple-600' }
  ];

  const generateReport = useCallback(async () => {
    setLoading(true);

    // Simulate report generation
    await new Promise((res) => setTimeout(res, 1000));

    setChartData({
      barData: [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 59 },
        { label: 'Mar', value: 80 },
        { label: 'Apr', value: 81 },
        { label: 'May', value: 56 },
        { label: 'Jun', value: 55 }
      ],
      pieData: [
        { label: 'New', value: 40, color: '#3B82F6' },
        { label: 'Contacted', value: 30, color: '#F59E0B' },
        { label: 'Qualified', value: 20, color: '#10B981' },
        { label: 'Converted', value: 10, color: '#8B5CF6' }
      ]
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    generateReport();
  }, [generateReport, reportType, dateRange]);

  const handleExport = async () => {
    setExportMessage('');
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1000));

    setLoading(false);
    setExportMessage('Report exported successfully');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        <Button variant="primary" icon={Download} onClick={handleExport}>
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Select
          label="Report Type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          options={[
            { value: 'leads', label: 'Lead Performance' },
            { value: 'sources', label: 'Lead Sources' },
            { value: 'conversion', label: 'Conversion Rates' }
          ]}
        />

        <Select
          label="Date Range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          options={[
            { value: 'last7', label: 'Last 7 Days' },
            { value: 'last30', label: 'Last 30 Days' },
            { value: 'last90', label: 'Last 90 Days' },
            { value: 'last365', label: 'Last Year' }
          ]}
        />

        <div className="flex items-end">
          <Button
            variant="secondary"
            icon={TrendingUp}
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={chartData.barData}
            title={`${reportType.toUpperCase()} Trends`}
          />
          <PieChart
            data={chartData.pieData}
            title="Lead Status Distribution"
          />
        </div>
      )}

      {/* Metrics */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className={`text-2xl font-bold ${m.color}`}>
                {m.value}
              </p>
              <p className="text-sm text-gray-600">{m.label}</p>
            </div>
          ))}
        </div>

        {exportMessage && (
          <p className="text-green-600 text-sm mt-4">
            {exportMessage}
          </p>
        )}
      </div>
    </>
  );
};

export default Reports;
