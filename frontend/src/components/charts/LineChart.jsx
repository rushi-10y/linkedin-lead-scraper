import React from 'react';

const LineChart = ({ data, title, color = '#3B82F6' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getX = (index) =>
    data.length === 1 ? 50 : (index / (data.length - 1)) * 100;

  const getY = (value) =>
    range === 0 ? 50 : 100 - ((value - minValue) / range) * 80;

  const points = data
    .map((point, index) => `${getX(index)},${getY(point.value)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <svg viewBox="0 0 100 100" className="w-full h-64">
        {/* Grid */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}

        {/* Line */}
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />

        {/* Points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={getX(index)}
            cy={getY(point.value)}
            r="3"
            fill={color}
          >
            <title>{`${point.label}: ${point.value}`}</title>
          </circle>
        ))}
      </svg>

      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {data.map((point, index) => (
          <span key={index}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
