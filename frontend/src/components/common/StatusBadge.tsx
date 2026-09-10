import React from 'react';
import type { ProcessingStatus } from '../../types/safety.types';

interface StatusBadgeProps {
  status: ProcessingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bg = 'rgba(148, 163, 184, 0.15)';
  let color = '#94a3b8';
  let border = 'rgba(148, 163, 184, 0.3)';
  let label = status as string;

  switch (status) {
    case 'PENDING':
      bg = 'rgba(234, 179, 8, 0.15)';
      color = '#facc15';
      border = 'rgba(234, 179, 8, 0.3)';
      label = 'Pending AI Review';
      break;
    case 'ANALYZING':
      bg = 'rgba(56, 189, 248, 0.15)';
      color = '#38bdf8';
      border = 'rgba(56, 189, 248, 0.3)';
      label = 'AI Processing...';
      break;
    case 'ANALYZED':
      bg = 'rgba(34, 197, 94, 0.15)';
      color = '#4ade80';
      border = 'rgba(34, 197, 94, 0.3)';
      label = 'Analyzed';
      break;
    case 'FAILED':
      bg = 'rgba(239, 68, 68, 0.15)';
      color = '#f87171';
      border = 'rgba(239, 68, 68, 0.3)';
      label = 'Analysis Failed';
      break;
  }

  return (
    <span
      className="badge-tag"
      style={{
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
      {label}
    </span>
  );
};
