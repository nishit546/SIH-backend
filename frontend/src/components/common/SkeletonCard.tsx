import React from 'react';

interface SkeletonCardProps {
  height?: string | number;
  count?: number;
  columns?: number;
  showHeader?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = '140px',
  count = 1,
  columns,
  showHeader = true,
  lines = 2
}) => {
  const renderSingle = (index: number) => (
    <div
      key={index}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {showHeader && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div
            className="skeleton-pulse"
            style={{
              width: '40%',
              height: '14px',
              borderRadius: '4px'
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)'
            }}
          />
        </div>
      )}

      {/* Main Metric / Content area */}
      <div style={{ marginBottom: '12px' }}>
        <div
          className="skeleton-pulse"
          style={{
            width: '60%',
            height: '28px',
            borderRadius: '6px',
            marginBottom: '10px'
          }}
        />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton-pulse"
            style={{
              width: i === lines - 1 ? '75%' : '90%',
              height: '10px',
              borderRadius: '4px',
              marginBottom: '6px'
            }}
          />
        ))}
      </div>

      {/* Footer bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          className="skeleton-pulse"
          style={{
            width: '30%',
            height: '10px',
            borderRadius: '4px'
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: '20%',
            height: '10px',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );

  if (count === 1) {
    return renderSingle(0);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns
          ? `repeat(${columns}, 1fr)`
          : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}
    >
      {Array.from({ length: count }).map((_, i) => renderSingle(i))}
    </div>
  );
};
