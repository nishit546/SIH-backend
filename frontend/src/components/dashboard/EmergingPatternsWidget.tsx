import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import type { EmergingPatternPreview } from '../../types/dashboard.types';

interface EmergingPatternsWidgetProps {
  patterns: EmergingPatternPreview[];
  totalActiveCount?: number;
}

export const EmergingPatternsWidget: React.FC<EmergingPatternsWidgetProps> = ({
  patterns,
  totalActiveCount = 5
}) => {
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
          <Layers size={18} color="var(--color-primary)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            Emerging Safety Patterns
          </h3>
        </div>
        <Link
          to="/patterns"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none'
          }}
        >
          View All ({totalActiveCount})
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Pattern Cards List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        {patterns.slice(0, 3).map((pattern) => {
          const isCritical = pattern.riskLevel === 'CRITICAL';

          return (
            <Link
              key={pattern.id}
              to="/patterns"
              style={{
                textDecoration: 'none',
                display: 'block',
                backgroundColor: 'var(--color-bg-subtle)',
                border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            >
              {/* Pattern Title & Trend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="var(--color-sif)" />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      lineHeight: 1.3
                    }}
                  >
                    {pattern.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {pattern.sifCount > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--color-sif)',
                        backgroundColor: 'var(--color-sif-subtle)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}
                    >
                      <ShieldAlert size={10} />
                      {pattern.sifCount} SIF
                    </span>
                  )}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: pattern.trend === 'INCREASING' ? 'var(--color-danger)' : 'var(--color-text-muted)',
                      backgroundColor: pattern.trend === 'INCREASING' ? 'var(--color-danger-subtle)' : 'var(--color-bg-surface)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <TrendingUp size={10} />
                    {pattern.trend}
                  </span>
                </div>
              </div>

              {/* Short explanation */}
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  margin: '0 0 6px 0',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {pattern.shortExplanation}
              </p>

              {/* Bottom metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--color-text-subtle)'
                }}
              >
                <span>
                  <strong>{pattern.reportCount}</strong> clustered reports
                </span>
                <span>
                  {pattern.affectedSites.join(', ')}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
