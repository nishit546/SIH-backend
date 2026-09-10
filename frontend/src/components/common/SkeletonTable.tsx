import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 6,
  columns = 6
}) => {
  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* Header Skeletons */}
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
            {Array.from({ length: columns }).map((_, c) => (
              <th key={c} style={{ padding: '12px 16px' }}>
                <div
                  className="skeleton-pulse"
                  style={{
                    width: c === 0 ? '60px' : c === 1 ? '100px' : '80px',
                    height: '12px',
                    borderRadius: '4px'
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>

        {/* Row Skeletons */}
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} style={{ padding: '14px 16px' }}>
                  <div
                    className="skeleton-pulse"
                    style={{
                      width:
                        c === 0
                          ? '80px'
                          : c === 1
                          ? '120px'
                          : c === columns - 1
                          ? '60px'
                          : `${50 + (c * 15) % 40}%`,
                      height: c === columns - 1 ? '24px' : '14px',
                      borderRadius: c === columns - 1 ? 'var(--radius-sm)' : '4px'
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
