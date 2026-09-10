import React from 'react';
import { FileText, Zap, AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardSummary } from '../../types/dashboard.types';

interface DashboardKpiCardsProps {
  summary: DashboardSummary;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({ summary }) => {
  const cards = [
    {
      id: 'total-reports',
      title: 'Total Reports',
      value: summary.totalReports.toLocaleString(),
      subtext: `${summary.openCorrectiveActions} open corrective actions`,
      change: summary.changeFromLastPeriod.totalReports,
      changeText: 'vs prior period',
      icon: FileText,
      accentColor: 'var(--color-primary)',
      badgeBg: 'rgba(2, 132, 199, 0.1)',
      badgeBorder: 'rgba(2, 132, 199, 0.25)',
      isHighlight: false
    },
    {
      id: 'sif-potential',
      title: 'SIF Potential',
      value: summary.sifPotentialReports.toLocaleString(),
      subtext: `${summary.sifPotentialRate}% of evaluated events`,
      change: summary.changeFromLastPeriod.sifPotential,
      changeText: 'precursor events',
      icon: Zap,
      accentColor: 'var(--color-sif)',
      badgeBg: 'var(--color-sif-subtle)',
      badgeBorder: 'rgba(168, 85, 247, 0.4)',
      isHighlight: true,
      tag: 'Critical Focus'
    },
    {
      id: 'high-risk',
      title: 'High / Critical Risk',
      value: summary.highRiskReports.toLocaleString(),
      subtext: `${summary.highRiskRate}% of total reports`,
      change: summary.changeFromLastPeriod.highRisk,
      changeText: 'requires mitigation',
      icon: AlertTriangle,
      accentColor: 'var(--color-danger)',
      badgeBg: 'var(--color-danger-subtle)',
      badgeBorder: 'rgba(239, 68, 68, 0.35)',
      isHighlight: false
    },
    {
      id: 'pending-analysis',
      title: 'Pending Analysis',
      value: summary.pendingAnalysis.toLocaleString(),
      subtext: 'Awaiting AI pipeline evaluation',
      change: summary.changeFromLastPeriod.pending,
      changeText: 'in queue',
      icon: Clock,
      accentColor: 'var(--color-warning)',
      badgeBg: 'var(--color-warning-subtle)',
      badgeBorder: 'rgba(234, 179, 8, 0.35)',
      isHighlight: false
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change > 0;
        const isNeutral = card.change === 0;

        return (
          <div
            key={card.id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: `1px solid ${card.isHighlight ? card.accentColor : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: card.isHighlight ? '0 0 16px rgba(168, 85, 247, 0.12)' : 'none',
              transition: 'transform 0.15s ease, border-color 0.15s ease'
            }}
          >
            {/* Top Row: Title + Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {card.title}
                </span>
                {card.tag && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: card.accentColor,
                      backgroundColor: card.badgeBg,
                      border: `1px solid ${card.badgeBorder}`,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {card.tag}
                  </span>
                )}
              </div>

              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: card.badgeBg,
                  border: `1px solid ${card.badgeBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.accentColor
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Middle Row: Main Metric Value */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                marginBottom: '8px'
              }}
            >
              <span
                style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}
              >
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Subtext & Trend Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '10px',
                marginTop: '4px'
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)'
                }}
              >
                {card.subtext}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color:
                    card.id === 'pending-analysis'
                      ? 'var(--color-text-muted)'
                      : isNeutral
                      ? 'var(--color-text-muted)'
                      : card.id === 'sif-potential'
                      ? isPositive
                        ? 'var(--color-danger)'
                        : 'var(--color-safe)'
                      : isPositive
                      ? 'var(--color-warning)'
                      : 'var(--color-safe)'
                }}
              >
                {isPositive ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}
                <span>
                  {isPositive ? `+${card.change}%` : `${card.change}%`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
