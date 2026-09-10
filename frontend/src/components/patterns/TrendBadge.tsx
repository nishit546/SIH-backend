import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PatternTrend } from '../../types/pattern.types';

interface TrendBadgeProps {
  trend: PatternTrend;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ trend }) => {
  switch (trend) {
    case 'INCREASING':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-danger)',
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase'
          }}
        >
          <TrendingUp size={12} />
          Increasing
        </span>
      );
    case 'DECREASING':
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-safe)',
            backgroundColor: 'var(--color-safe-subtle)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase'
          }}
        >
          <TrendingDown size={12} />
          Decreasing
        </span>
      );
    case 'STABLE':
    default:
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase'
          }}
        >
          <Minus size={12} />
          Stable
        </span>
      );
  }
};
