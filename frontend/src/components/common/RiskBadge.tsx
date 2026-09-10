import React from 'react';
import type { RiskLevel } from '../../types/safety.types';

interface RiskBadgeProps {
  level?: RiskLevel | null;
  sifPotential?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, sifPotential }) => {
  if (!level && sifPotential === undefined) {
    return <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Unassessed</span>;
  }

  let bg = 'rgba(148, 163, 184, 0.15)';
  let color = '#94a3b8';
  let border = 'rgba(148, 163, 184, 0.3)';

  switch (level) {
    case 'CRITICAL':
      bg = 'var(--color-critical-bg)';
      color = 'var(--color-critical)';
      border = 'var(--color-critical-border)';
      break;
    case 'HIGH':
      bg = 'var(--color-high-bg)';
      color = 'var(--color-high)';
      border = 'var(--color-high-border)';
      break;
    case 'MEDIUM':
      bg = 'var(--color-medium-bg)';
      color = 'var(--color-medium)';
      border = 'var(--color-medium-border)';
      break;
    case 'LOW':
      bg = 'var(--color-low-bg)';
      color = 'var(--color-low)';
      border = 'var(--color-low-border)';
      break;
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {level && (
        <span
          className="badge-tag"
          style={{
            backgroundColor: bg,
            color,
            border: `1px solid ${border}`,
          }}
        >
          {level} RISK
        </span>
      )}
      {sifPotential && (
        <span
          className="badge-tag"
          style={{
            backgroundColor: 'var(--color-sif-bg)',
            color: '#c084fc',
            border: '1px solid var(--color-sif-border)',
          }}
        >
          SIF PRECURSOR
        </span>
      )}
    </div>
  );
};
