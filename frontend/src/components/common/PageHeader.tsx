import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
    </div>
  );
};
