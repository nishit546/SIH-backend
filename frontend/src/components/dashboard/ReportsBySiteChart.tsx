import React from 'react';
import { MapPin, ShieldAlert } from 'lucide-react';
import type { SiteDistributionItem } from '../../types/dashboard.types';

interface ReportsBySiteChartProps {
  distribution: SiteDistributionItem[];
}

export const ReportsBySiteChart: React.FC<ReportsBySiteChartProps> = ({ distribution }) => {
  const maxTotal = Math.max(...distribution.map((d) => d.totalReports), 1);

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
          <MapPin size={18} color="var(--color-primary)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            Safety Reports by Facility Site
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
          {distribution.length} Active Sites
        </span>
      </div>

      {/* Facilities List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          justifyContent: 'space-around'
        }}
      >
        {distribution.map((item) => {
          const barWidth = (item.totalReports / maxTotal) * 100;
          const sifRatio = item.totalReports > 0 ? (item.sifReports / item.totalReports) * 100 : 0;

          return (
            <div key={item.site}>
              {/* Site Name and Counts */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)'
                    }}
                  >
                    {item.site}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    ({item.percentage}%)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-sif)',
                      backgroundColor: 'var(--color-sif-subtle)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    <ShieldAlert size={11} />
                    {item.sifReports} SIF
                  </span>

                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      minWidth: '24px',
                      textAlign: 'right'
                    }}
                  >
                    {item.totalReports}
                  </span>
                </div>
              </div>

              {/* Progress Bar with SIF Overlay */}
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${barWidth}%`,
                    backgroundColor: 'rgba(2, 132, 199, 0.4)',
                    borderRadius: 'var(--radius-full)',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${sifRatio}%`,
                      backgroundColor: 'var(--color-sif)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
