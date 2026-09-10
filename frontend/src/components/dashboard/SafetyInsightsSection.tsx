import React from 'react';
import { Sparkles, AlertTriangle, AlertCircle, ArrowUpRight, CheckCircle } from 'lucide-react';
import type { SafetyInsight } from '../../types/dashboard.types';

interface SafetyInsightsSectionProps {
  insights: SafetyInsight[];
}

export const SafetyInsightsSection: React.FC<SafetyInsightsSectionProps> = ({ insights }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '24px'
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-sif)'
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                margin: 0
              }}
            >
              Safety Insights & Precursor Intelligence
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                margin: 0
              }}
            >
              AI pattern identification across facility reports and contractor activities
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-sif)',
            backgroundColor: 'var(--color-sif-subtle)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        >
          {insights.length} Active Precursor Signals
        </span>
      </div>

      {/* Insights Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px'
        }}
      >
        {insights.map((insight) => {
          const isCritical = insight.type === 'CRITICAL';
          const isWarning = insight.type === 'WARNING';

          const accentBorder = isCritical
            ? 'var(--color-danger)'
            : isWarning
            ? 'var(--color-warning)'
            : 'var(--color-sif)';

          const tagBg = isCritical
            ? 'var(--color-danger-subtle)'
            : isWarning
            ? 'var(--color-warning-subtle)'
            : 'var(--color-sif-subtle)';

          const tagColor = isCritical
            ? 'var(--color-danger)'
            : isWarning
            ? 'var(--color-warning)'
            : 'var(--color-sif)';

          const Icon = isCritical ? AlertCircle : isWarning ? AlertTriangle : ArrowUpRight;

          return (
            <div
              key={insight.id}
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${accentBorder}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              {/* Card Header: Tag & Metric */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} color={tagColor} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: tagColor,
                      backgroundColor: tagBg,
                      padding: '1px 6px',
                      borderRadius: '3px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {insight.type}
                  </span>
                </div>

                {insight.metric && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {insight.metric}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-main)',
                    margin: '0 0 4px 0'
                  }}
                >
                  {insight.title}
                </h4>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.45,
                    margin: 0
                  }}
                >
                  {insight.message}
                </p>
              </div>

              {/* Suggested Action & Location Footer */}
              <div
                style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {insight.affectedSite && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Target:</span>
                    <strong style={{ color: 'var(--color-text-main)' }}>{insight.affectedSite}</strong>
                  </div>
                )}

                {insight.suggestedAction && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-main)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '5px',
                      marginTop: '2px'
                    }}
                  >
                    <CheckCircle size={13} color="var(--color-safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      <strong style={{ color: 'var(--color-safe)' }}>Action:</strong> {insight.suggestedAction}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
