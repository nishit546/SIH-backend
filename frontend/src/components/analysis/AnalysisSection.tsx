import React from 'react';

interface AnalysisSectionProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  icon,
  title,
  subtitle,
  badge,
  children,
  style
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: subtitle ? '6px' : '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            {title}
          </h3>
        </div>
        {badge}
      </div>

      {subtitle && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            margin: '0 0 16px 0',
            lineHeight: 1.4
          }}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
};
