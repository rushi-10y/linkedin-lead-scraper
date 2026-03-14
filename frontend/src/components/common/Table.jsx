import React from 'react';

const Table = ({
  columns = [],
  data = [],
  onRowClick,
  loading = false,
  rowKey = 'id',
  emptyMessage = 'No records found'
}) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-6 text-center text-sm text-gray-500"
              >
                Loading...
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-6 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, idx) => {
              const key = row[rowKey] ?? idx;

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`${
                    onRowClick
                      ? 'cursor-pointer hover:bg-gray-50'
                      : ''
                  }`}
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
