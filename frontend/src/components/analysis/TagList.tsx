import React from 'react';

interface TagListProps {
  items: string[];
  variant?: 'primary' | 'hazard' | 'rule' | 'exposure' | 'default';
  emptyMessage?: string;
  icon?: React.ReactNode;
}

export const TagList: React.FC<TagListProps> = ({
  items,
  variant = 'default',
  emptyMessage = 'None identified',
  icon
}) => {
  if (!items || items.length === 0) {
    return (
      <div
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          padding: '8px 12px',
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-border)'
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'hazard':
        return {
          bg: 'rgba(249, 115, 22, 0.1)',
          border: 'rgba(249, 115, 22, 0.3)',
          color: '#fb923c'
        };
      case 'rule':
        return {
          bg: 'var(--color-sif-subtle)',
          border: 'rgba(168, 85, 247, 0.4)',
          color: 'var(--color-sif)'
        };
      case 'exposure':
        return {
          bg: 'rgba(2, 132, 199, 0.1)',
          border: 'rgba(2, 132, 199, 0.3)',
          color: 'var(--color-primary)'
        };
      case 'primary':
        return {
          bg: 'rgba(56, 189, 248, 0.1)',
          border: 'rgba(56, 189, 248, 0.3)',
          color: '#38bdf8'
        };
      default:
        return {
          bg: 'var(--color-bg-subtle)',
          border: 'var(--color-border)',
          color: 'var(--color-text-main)'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            color: style.color,
            padding: '4px 10px',
            borderRadius: 'var(--radius-md)',
            textTransform: 'capitalize'
          }}
        >
          {icon}
          {item}
        </span>
      ))}
    </div>
  );
};
