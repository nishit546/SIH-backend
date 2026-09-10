import React from 'react';
import { AlertOctagon } from 'lucide-react';
import type { RiskDistributionItem } from '../../types/dashboard.types';

interface RiskDistributionChartProps {
  distribution: RiskDistributionItem[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution }) => {
  const totalCount = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={18} color="var(--color-danger)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            Risk Level Distribution
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-subtle)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--color-border)'
          }}
        >
          {totalCount} Total Incidents
        </span>
      </div>

      {/* Multi-segment stacked horizontal bar */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            height: '14px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)'
          }}
        >
          {distribution.map((item) => (
            <div
              key={item.level}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                transition: 'width 0.4s ease'
              }}
              title={`${item.level}: ${item.count} reports (${item.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Breakdown Grid for High, Medium, Low, Critical */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          flex: 1
        }}
      >
        {distribution.map((item) => {
          return (
            <div
              key={item.level}
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${item.color}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  {item.level}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: item.color
                  }}
                >
                  {item.percentage}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--color-text-main)'
                  }}
                >
                  {item.count}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  reports
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
