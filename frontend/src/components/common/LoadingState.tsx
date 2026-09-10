import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  height?: string | number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading safety data...',
  subtext,
  height = '320px'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: height,
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(2, 132, 199, 0.12)',
          border: '1px solid rgba(2, 132, 199, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          marginBottom: '1rem'
        }}
      >
        <Loader2
          size={22}
          style={{ animation: 'spin 1s linear infinite' }}
        />
      </div>
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: subtext ? '4px' : 0 }}>
        {message}
      </p>
      {subtext && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '380px' }}>
          {subtext}
        </p>
      )}
    </div>
  );
};
