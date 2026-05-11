import React from 'react';

const BarChart = ({ data, title, barColor = 'from-cyan-500 to-sky-500' }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <div className="relative h-72 flex items-end gap-4">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-1 flex-col items-center">
            <span className="chart-value">{item.value}</span>
            <div className="relative w-full max-w-[56px]">
              <div
                className={`chart-bar bg-gradient-to-t ${barColor}`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="chart-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
