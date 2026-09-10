import React from 'react';
import { RotateCw } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => void;
  isLoading?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isLoading = false,
  label = 'Try Again',
  size = 'md',
  variant = 'primary'
}) => {
  const sizeStyles = {
    sm: { padding: '5px 10px', fontSize: '11px', iconSize: 12 },
    md: { padding: '7px 14px', fontSize: '12px', iconSize: 14 },
    lg: { padding: '9px 18px', fontSize: '13px', iconSize: 16 }
  }[size];

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#ffffff',
      border: 'none',
      hoverBg: 'var(--color-primary-hover)'
    },
    secondary: {
      backgroundColor: 'var(--bg-card)',
      color: 'var(--text-main)',
      border: '1px solid var(--border-color)',
      hoverBg: 'var(--bg-card-hover)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
      hoverBg: 'rgba(2, 132, 199, 0.1)'
    }
  }[variant];

  return (
    <button
      type="button"
      onClick={onRetry}
      disabled={isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        ...sizeStyles,
        ...variantStyles
      }}
    >
      <RotateCw
        size={sizeStyles.iconSize}
        style={{
          animation: isLoading ? 'spin 1s linear infinite' : 'none'
        }}
      />
      <span>{isLoading ? 'Retrying...' : label}</span>
    </button>
  );
};
