import React from 'react';
import { TrendingUp, Users, Target, DollarSign, BarChart3, PieChart } from 'lucide-react';

const LeadAnalytics = () => {
  // Sample data - in a real app, this would come from props or API
  const trendsData = [
    { month: 'Jan', leads: 65 },
    { month: 'Feb', leads: 59 },
    { month: 'Mar', leads: 80 },
    { month: 'Apr', leads: 81 },
    { month: 'May', leads: 56 },
    { month: 'Jun', leads: 55 }
  ];

  const statusData = [
    { status: 'New', count: 40, color: '#3B82F6' },
    { status: 'Contacted', count: 30, color: '#F59E0B' },
    { status: 'Qualified', count: 20, color: '#10B981' },
    { status: 'Converted', count: 10, color: '#8B5CF6' }
  ];

  const keyMetrics = [
    {
      label: 'Total Leads',
      value: '245',
      icon: Users,
      color: 'from-cyan-300/30 to-sky-400/10',
      borderColor: 'border-cyan-300/20'
    },
    {
      label: 'Conversion Rate',
      value: '32%',
      icon: Target,
      color: 'from-emerald-300/30 to-teal-400/10',
      borderColor: 'border-emerald-300/20'
    },
    {
      label: 'Avg Deal Size',
      value: '$45,230',
      icon: DollarSign,
      color: 'from-amber-300/30 to-orange-400/10',
      borderColor: 'border-amber-300/20'
    },
    {
      label: 'Active Campaigns',
      value: '89',
      icon: BarChart3,
      color: 'from-fuchsia-300/20 to-cyan-300/10',
      borderColor: 'border-fuchsia-300/20'
    }
  ];

  const maxLeads = Math.max(...trendsData.map(d => d.leads));
  const minLeads = Math.min(...trendsData.map(d => d.leads));
  const range = maxLeads - minLeads;

  const getY = (value) => range === 0 ? 50 : 100 - ((value - minLeads) / range) * 80;

  const points = trendsData
    .map((point, index) => `${(index / (trendsData.length - 1)) * 100},${getY(point.leads)}`)
    .join(' ');

  const totalStatus = statusData.reduce((sum, item) => sum + item.count, 0);
  const statusSlices = statusData.reduce(
    (acc, item) => {
      const percent = (item.count / totalStatus) * 100;
      const start = acc.current;
      const end = start + percent;

      acc.slices.push({ ...item, start, end, percent });
      acc.current = end;
      return acc;
    },
    { slices: [], current: 0 }
  ).slices;

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className="panel px-5 py-5"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className={`mb-5 inline-flex rounded-[22px] border ${metric.borderColor} bg-gradient-to-br ${metric.color} p-3 text-slate-50`}>
              <metric.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">{metric.value}</p>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Leads Trends Chart */}
        <div className="panel px-6 py-6">
          <div className="mb-6">
            <span className="section-label mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              Leads Trends
            </span>
            <h2 className="text-2xl font-semibold text-slate-50">Monthly Lead Generation</h2>
          </div>

          <div className="lead-trends-chart rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <svg viewBox="0 0 100 100" className="w-full h-64 rounded-3xl overflow-visible">
              {/* Grid lines */}
              {[20, 40, 60, 80].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} className="chart-grid-line" />
              ))}

              {/* Line */}
              <polyline
                fill="none"
                stroke="#67e8f9"
                strokeWidth="3"
                points={points}
                className="drop-shadow-sm"
              />

              {/* Points */}
              {trendsData.map((point, index) => (
                <circle
                  key={index}
                  cx={(index / (trendsData.length - 1)) * 100}
                  cy={getY(point.leads)}
                  r="4"
                  fill="#67e8f9"
                  stroke="#050816"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                >
                  <title>{`${point.month}: ${point.leads} leads`}</title>
                </circle>
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4 text-xs text-slate-400 tracking-wide">
              {trendsData.map((point, index) => (
                <span key={index} className="text-center w-full">{point.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Status Distribution */}
        <div className="panel px-6 py-6">
          <div className="mb-6">
            <span className="section-label mb-3">
              <PieChart className="h-3.5 w-3.5" />
              Lead Status Distribution
            </span>
            <h2 className="text-2xl font-semibold text-slate-50">Current Pipeline Status</h2>
          </div>

          <div className="status-card w-full rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <div className="status-chart mx-auto mb-6 w-52 h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full rounded-full overflow-visible">
                {statusSlices.map((slice, index) => {
                  const startAngle = (slice.start / 100) * 360;
                  const endAngle = (slice.end / 100) * 360;

                  const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);

                  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      className="drop-shadow-sm"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="status-legend w-full">
              {statusData.map((item) => (
                <div key={item.status} className="status-legend-item">
                  <div className="flex items-center gap-3">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="status-label">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-50">{item.count}</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({((item.count / totalStatus) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadAnalytics;