import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no safety observations matching your selected criteria.',
  icon,
  action,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1.5rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', marginBottom: '1rem' }}>
        {icon || <Inbox size={24} />}
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 360, marginBottom: action ? '1.25rem' : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
