import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { RiskLevel } from '../../types/safety.types';
import { RiskBadge } from '../common/RiskBadge';

interface SifStatusProps {
  sifPotential: boolean;
  probability: number;
  riskLevel: RiskLevel;
}

export const SifStatus: React.FC<SifStatusProps> = ({
  sifPotential,
  probability,
  riskLevel
}) => {
  const percentage = Math.round(probability * 100);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: `1px solid ${sifPotential ? 'var(--color-sif)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '22px 24px',
        boxShadow: sifPotential ? '0 0 20px rgba(168, 85, 247, 0.12)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: sifPotential ? 'var(--color-sif)' : 'var(--color-safe)'
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        {/* Column 1: SIF Potential Flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: sifPotential ? 'var(--color-sif-subtle)' : 'var(--color-safe-subtle)',
              border: `1px solid ${sifPotential ? 'rgba(168, 85, 247, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: sifPotential ? 'var(--color-sif)' : 'var(--color-safe)',
              flexShrink: 0
            }}
          >
            {sifPotential ? <ShieldAlert size={26} /> : <CheckCircle2 size={26} />}
          </div>

          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '2px'
              }}
            >
              SIF Precursor Flag
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: sifPotential ? 'var(--color-sif)' : 'var(--color-safe)',
                  letterSpacing: '0.02em'
                }}
              >
                {sifPotential ? 'YES' : 'NO'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: sifPotential ? 'var(--color-sif)' : 'var(--color-safe)',
                  backgroundColor: sifPotential ? 'var(--color-sif-subtle)' : 'var(--color-safe-subtle)',
                  border: `1px solid ${sifPotential ? 'rgba(168, 85, 247, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                  padding: '1px 8px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase'
                }}
              >
                {sifPotential ? 'Critical Focus' : 'Standard Event'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: SIF Precursor Probability Gauge */}
        <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Precursor Probability
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-primary)'
              }}
            >
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${percentage}%`,
                backgroundColor: sifPotential ? 'var(--color-sif)' : 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
            Calculated by NLP feature weighting model
          </span>
        </div>

        {/* Column 3: Evaluated Risk Tier */}
        <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '16px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            Evaluated Risk Tier
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiskBadge level={riskLevel} />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
            Immediate operational attention required
          </span>
        </div>
      </div>
    </div>
  );
};
