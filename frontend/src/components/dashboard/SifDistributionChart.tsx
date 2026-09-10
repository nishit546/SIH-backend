import React from 'react';
import { Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import type { SifDistribution } from '../../types/dashboard.types';

interface SifDistributionChartProps {
  distribution: SifDistribution;
}

export const SifDistributionChart: React.FC<SifDistributionChartProps> = ({ distribution }) => {
  const total = distribution.sifPotential + distribution.notSifPotential + distribution.unanalyzed;
  const sifPct = total > 0 ? Math.round((distribution.sifPotential / total) * 100) : 0;
  const nonSifPct = total > 0 ? Math.round((distribution.notSifPotential / total) * 100) : 0;
  const unanalyzedPct = total > 0 ? Math.max(0, 100 - sifPct - nonSifPct) : 0;

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const sifStroke = (sifPct / 100) * circumference;
  const nonSifStroke = (nonSifPct / 100) * circumference;
  const unanalyzedStroke = (unanalyzedPct / 100) * circumference;

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
          <Zap size={18} color="var(--color-sif)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            SIF Potential Distribution
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
          {total} Total Evaluated
        </span>
      </div>

      {/* Chart and Legend Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: '16px',
          flex: 1,
          padding: '8px 0'
        }}
      >
        {/* Crisp SVG Donut */}
        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="var(--color-bg-subtle)"
              strokeWidth="16"
            />
            {/* Non-SIF segment (Slate / Teal) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#0284c7"
              strokeWidth="16"
              strokeDasharray={`${nonSifStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* SIF segment (Violet) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#a855f7"
              strokeWidth="16"
              strokeDasharray={`${sifStroke} ${circumference}`}
              strokeDashoffset={`-${nonSifStroke}`}
            />
            {/* Unanalyzed segment (Amber) */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="#eab308"
              strokeWidth="16"
              strokeDasharray={`${unanalyzedStroke} ${circumference}`}
              strokeDashoffset={`-${nonSifStroke + sifStroke}`}
            />
          </svg>

          {/* Center text in donut */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                lineHeight: 1
              }}
            >
              {sifPct}%
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--color-sif)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: '3px'
              }}
            >
              SIF Precursor
            </span>
          </div>
        </div>

        {/* Legend / Metrics List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '210px' }}>
          {/* SIF Potential */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={14} color="var(--color-sif)" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                SIF Potential
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-sif)' }}>
                {distribution.sifPotential}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                ({sifPct}%)
              </span>
            </div>
          </div>

          {/* Not SIF Potential */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-main)' }}>
                Non-SIF Events
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {distribution.notSifPotential}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                ({nonSifPct}%)
              </span>
            </div>
          </div>

          {/* Unanalyzed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="var(--color-warning)" />
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                Unanalyzed
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {distribution.unanalyzed}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                ({unanalyzedPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
