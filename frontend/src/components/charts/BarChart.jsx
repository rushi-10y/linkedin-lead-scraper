import React from 'react';

const BarChart = ({ data, title, barColor = 'bg-blue-500' }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="h-64 flex items-end justify-center space-x-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-xs mb-1">{item.value}</span>

            <div
              className={`${barColor} w-8 rounded-t transition-all`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />

            <span className="text-xs mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
