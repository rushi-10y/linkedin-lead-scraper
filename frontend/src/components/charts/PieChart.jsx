import React from 'react';

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const slices = data.reduce(
    (acc, item) => {
      const percent = (item.value / total) * 100;
      const start = acc.current;
      const end = start + percent;

      acc.slices.push({ ...item, start, end });
      acc.current = end;
      return acc;
    },
    { slices: [], current: 0 }
  ).slices;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="flex items-center">
        <div className="w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slices.map((slice, index) => {
              const startAngle = (slice.start / 100) * 360;
              const endAngle = (slice.end / 100) * 360;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={slice.color}
                >
                  <title>{`${slice.label}: ${slice.value}`}</title>
                </path>
              );
            })}
          </svg>
        </div>

        <div className="ml-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
