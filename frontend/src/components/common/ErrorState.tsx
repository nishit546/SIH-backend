import React from 'react';
import { AlertCircle, AlertTriangle, WifiOff, ShieldAlert } from 'lucide-react';
import { RetryButton } from './RetryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'network' | 'ai';
  icon?: React.ReactNode;
  onRetry?: () => void;
  isRetrying?: boolean;
  action?: React.ReactNode;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to complete the safety operation. Please verify your connection or try again.',
  type = 'error',
  icon,
  onRetry,
  isRetrying = false,
  action,
  compact = false
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff size={compact ? 16 : 28} />;
      case 'warning':
        return <AlertTriangle size={compact ? 16 : 28} />;
      case 'ai':
        return <ShieldAlert size={compact ? 16 : 28} />;
      case 'error':
      default:
        return <AlertCircle size={compact ? 16 : 28} />;
    }
  };

  const colors = {
    error: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.35)',
      text: 'var(--color-critical)',
      iconBg: 'rgba(239, 68, 68, 0.15)'
    },
    warning: {
      bg: 'rgba(234, 179, 8, 0.08)',
      border: 'rgba(234, 179, 8, 0.35)',
      text: 'var(--color-medium)',
      iconBg: 'rgba(234, 179, 8, 0.15)'
    },
    network: {
      bg: 'rgba(148, 163, 184, 0.08)',
      border: 'rgba(148, 163, 184, 0.35)',
      text: 'var(--text-muted)',
      iconBg: 'rgba(148, 163, 184, 0.15)'
    },
    ai: {
      bg: 'rgba(168, 85, 247, 0.08)',
      border: 'rgba(168, 85, 247, 0.35)',
      text: 'var(--color-sif)',
      iconBg: 'rgba(168, 85, 247, 0.15)'
    }
  }[type];

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          gap: '12px',
          margin: '12px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text, fontSize: '13px' }}>
          {icon || getDefaultIcon()}
          <div>
            <strong>{title}</strong>
            {message && <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{message}</span>}
          </div>
        </div>

        {onRetry && (
          <RetryButton onRetry={onRetry} isLoading={isRetrying} size="sm" variant="outline" label="Retry" />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-lg)',
        margin: '20px auto',
        maxWidth: '560px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: colors.iconBg,
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        {icon || getDefaultIcon()}
      </div>

      <h3
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '6px'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          maxWidth: '420px',
          marginBottom: onRetry || action ? '20px' : 0
        }}
      >
        {message}
      </p>

      {(onRetry || action) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onRetry && (
            <RetryButton onRetry={onRetry} isLoading={isRetrying} size="md" variant="primary" label="Retry Operation" />
          )}
          {action}
        </div>
      )}
    </div>
  );
};
