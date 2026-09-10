import React from 'react';
import { ShieldAlert, MapPin, Activity, ArrowRight, Layers, Tag } from 'lucide-react';
import type { SafetyPatternItem } from '../../types/pattern.types';
import { RiskBadge } from '../common/RiskBadge';
import { TrendBadge } from './TrendBadge';

interface PatternCardProps {
  pattern: SafetyPatternItem;
  onSelect: (pattern: SafetyPatternItem) => void;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern, onSelect }) => {
  const isCritical = pattern.riskLevel === 'CRITICAL';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: isCritical ? '0 0 16px rgba(239, 68, 68, 0.08)' : 'none',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      {/* Header: Title + Status/Trend Badges */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isCritical ? 'var(--color-danger-subtle)' : 'var(--color-sif-subtle)',
                border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCritical ? 'var(--color-danger)' : 'var(--color-sif)',
                flexShrink: 0
              }}
            >
              <Layers size={16} />
            </div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                margin: 0,
                lineHeight: 1.3
              }}
            >
              {pattern.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <RiskBadge level={pattern.riskLevel} />
            <TrendBadge trend={pattern.trend} />
          </div>
        </div>

        {/* Short Explanation */}
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            margin: '0 0 14px 0'
          }}
        >
          {pattern.shortExplanation}
        </p>

        {/* Metric Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {pattern.reportCount} Associated Reports
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-sif)',
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-md)',
              textTransform: 'uppercase'
            }}
          >
            <ShieldAlert size={12} />
            {pattern.sifCount} SIF Precursors
          </span>

          {pattern.iogpRules.map((rule) => (
            <span
              key={rule}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Tag size={11} />
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Affected Sites & Activities + Inspection Button */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            <MapPin size={13} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
            <span>Sites:</span>
            <strong style={{ color: 'var(--color-text-main)' }}>{pattern.affectedSites.join(', ')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            <Activity size={13} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
            <span>Activities:</span>
            <span style={{ color: 'var(--color-text-main)' }}>{pattern.affectedActivities.join(', ')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(pattern)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            color: 'var(--color-primary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          Inspect Pattern Details
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
