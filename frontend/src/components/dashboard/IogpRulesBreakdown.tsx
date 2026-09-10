import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { IogpRuleStat } from '../../types/dashboard.types';

interface IogpRulesBreakdownProps {
  rules: IogpRuleStat[];
}

export const IogpRulesBreakdown: React.FC<IogpRulesBreakdownProps> = ({ rules }) => {
  const maxCount = Math.max(...rules.map((r) => r.count), 1);

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
          <ShieldCheck size={18} color="var(--color-primary)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            IOGP Life-Saving Rules
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
          Rule Precursors
        </span>
      </div>

      {/* Rules List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          justifyContent: 'space-around'
        }}
      >
        {rules.map((item) => {
          const barWidth = (item.count / maxCount) * 100;

          return (
            <div key={item.rule}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.code && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        backgroundColor: 'rgba(2, 132, 199, 0.1)',
                        border: '1px solid rgba(2, 132, 199, 0.25)',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}
                    >
                      {item.code}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-text-main)'
                    }}
                  >
                    {item.rule}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.sifCount > 0 && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-sif)',
                        backgroundColor: 'var(--color-sif-subtle)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      <ShieldAlert size={11} />
                      {item.sifCount} SIF
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      minWidth: '24px',
                      textAlign: 'right'
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${barWidth}%`,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
