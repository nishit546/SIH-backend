import React from 'react';
import { Inbox, FileQuestion, SearchX, Layers } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'default' | 'search' | 'reports' | 'patterns';
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no safety records matching your current filter criteria.',
  type = 'default',
  icon,
  action,
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'search':
        return <SearchX size={24} />;
      case 'reports':
        return <FileQuestion size={24} />;
      case 'patterns':
        return <Layers size={24} />;
      case 'default':
      default:
        return <Inbox size={24} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        margin: '16px 0'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          marginBottom: '1rem'
        }}
      >
        {icon || getDefaultIcon()}
      </div>

      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 400, marginBottom: action ? '1.25rem' : 0, lineHeight: 1.5 }}>
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
};
