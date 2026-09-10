import React from 'react';
import { Flame, ShieldAlert } from 'lucide-react';
import type { HazardStat } from '../../types/dashboard.types';

interface TopHazardsChartProps {
  hazards: HazardStat[];
}

export const TopHazardsChart: React.FC<TopHazardsChartProps> = ({ hazards }) => {
  const maxCount = Math.max(...hazards.map((h) => h.count), 1);

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
          <Flame size={18} color="var(--color-warning)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            Top Detected Hazards
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
          By Incident Volume
        </span>
      </div>

      {/* Hazards List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          justifyContent: 'space-around'
        }}
      >
        {hazards.map((item) => {
          const barWidth = (item.count / maxCount) * 100;
          const sifBarWidth = item.count > 0 ? (item.sifCount / item.count) * 100 : 0;

          return (
            <div key={item.hazard}>
              {/* Row Header: Hazard name + counts */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-text-main)',
                    maxWidth: '260px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.hazard}
                >
                  {item.hazard}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.sifCount > 0 && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-sif)',
                        backgroundColor: 'var(--color-sif-subtle)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      <ShieldAlert size={11} />
                      {item.sifCount} SIF
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      minWidth: '24px',
                      textAlign: 'right'
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>

              {/* Dual-layer Progress Meter */}
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Total Hazard Bar */}
                <div
                  style={{
                    height: '100%',
                    width: `${barWidth}%`,
                    backgroundColor: 'rgba(2, 132, 199, 0.4)',
                    borderRadius: 'var(--radius-full)',
                    position: 'relative'
                  }}
                >
                  {/* SIF component embedded inside the bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${sifBarWidth}%`,
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
