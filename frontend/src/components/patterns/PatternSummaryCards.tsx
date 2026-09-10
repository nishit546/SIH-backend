import React from 'react';
import { Layers, AlertOctagon, ShieldAlert, TrendingUp } from 'lucide-react';
import type { PatternSummary } from '../../types/pattern.types';

interface PatternSummaryCardsProps {
  summary: PatternSummary;
}

export const PatternSummaryCards: React.FC<PatternSummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      id: 'active-patterns',
      title: 'Active Patterns',
      value: summary.activePatterns,
      subtext: 'Cross-report recurring clusters',
      icon: Layers,
      color: 'var(--color-primary)',
      bg: 'rgba(2, 132, 199, 0.1)',
      border: 'rgba(2, 132, 199, 0.25)'
    },
    {
      id: 'high-priority',
      title: 'High Priority Patterns',
      value: summary.highPriorityPatterns,
      subtext: 'Critical & High severity tiers',
      icon: AlertOctagon,
      color: 'var(--color-danger)',
      bg: 'var(--color-danger-subtle)',
      border: 'rgba(239, 68, 68, 0.35)'
    },
    {
      id: 'sif-related',
      title: 'SIF-Related Patterns',
      value: summary.sifRelatedPatterns,
      subtext: 'Clusters containing SIF precursors',
      icon: ShieldAlert,
      color: 'var(--color-sif)',
      bg: 'var(--color-sif-subtle)',
      border: 'rgba(168, 85, 247, 0.4)'
    },
    {
      id: 'increasing',
      title: 'Increasing Patterns',
      value: summary.increasingPatterns,
      subtext: 'Escalating frequency vs baseline',
      icon: TrendingUp,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-subtle)',
      border: 'rgba(234, 179, 8, 0.35)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: `1px solid ${card.border}`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  marginBottom: '2px'
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  lineHeight: 1.1
                }}
              >
                {card.value}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  marginTop: '4px'
                }}
              >
                {card.subtext}
              </span>
            </div>

            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: card.bg,
                border: `1px solid ${card.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0
              }}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
