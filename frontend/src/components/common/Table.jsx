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
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(2,6,23,0.38)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.04]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, idx) => {
                const key = row[rowKey] ?? row._id ?? idx;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition duration-300 ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-white/[0.04]'
                        : ''
                    }`}
                    role={onRowClick ? 'button' : undefined}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-sm text-slate-100"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key] ?? '--'}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
