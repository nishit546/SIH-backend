import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { SafetyTrendPoint } from '../../types/dashboard.types';

interface SafetyTrendChartProps {
  trends: SafetyTrendPoint[];
}

export const SafetyTrendChart: React.FC<SafetyTrendChartProps> = ({ trends }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!trends || trends.length === 0) {
    return null;
  }

  // Chart dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 25, bottom: 40, left: 35 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Max value for Y scale
  const maxVal = Math.max(...trends.map((d) => Math.max(d.totalReports, d.sifPotentialReports, 30)));
  const yMax = Math.ceil(maxVal / 5) * 5;

  // Coordinates mapping
  const points = trends.map((d, i) => {
    const x = padding.left + (i / (trends.length - 1)) * innerWidth;
    const yTotal = padding.top + innerHeight - (d.totalReports / yMax) * innerHeight;
    const ySif = padding.top + innerHeight - (d.sifPotentialReports / yMax) * innerHeight;
    return { ...d, x, yTotal, ySif };
  });

  // SVG Path generation
  const totalPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTotal}`).join(' ');
  const sifPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.ySif}`).join(' ');

  // Gradient area for Total Reports
  const totalAreaPath = `${totalPath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  // Gradient area for SIF Potential
  const sifAreaPath = `${sifPath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Header & Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--color-primary)" />
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              margin: 0
            }}
          >
            Safety Reports Trend Timeline
          </h3>
        </div>

        {/* Custom Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '3px',
                backgroundColor: 'var(--color-primary)',
                borderRadius: '2px'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Total Reports
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '3px',
                backgroundColor: 'var(--color-sif)',
                borderRadius: '2px'
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              SIF Precursors
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Total reports gradient */}
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>

            {/* SIF reports gradient */}
            <linearGradient id="sifGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((tick) => {
            const y = padding.top + innerHeight - (tick / yMax) * innerHeight;
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="var(--color-border-subtle)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="var(--color-text-muted)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area fills */}
          <path d={totalAreaPath} fill="url(#totalGrad)" />
          <path d={sifAreaPath} fill="url(#sifGrad)" />

          {/* Lines */}
          <path
            d={totalPath}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={sifPath}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Column & X-Axis Labels */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={p.period}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={padding.top}
                    x2={p.x}
                    y2={padding.top + innerHeight}
                    stroke="var(--color-border-strong)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* X Axis label */}
                <text
                  x={p.x}
                  y={height - 12}
                  fill={isHovered ? 'var(--color-text-main)' : 'var(--color-text-muted)'}
                  fontSize="11"
                  fontWeight={isHovered ? 600 : 400}
                  textAnchor="middle"
                >
                  {p.period}
                </text>

                {/* Data point dots */}
                <circle
                  cx={p.x}
                  cy={p.yTotal}
                  r={isHovered ? 6 : 4}
                  fill="#0b0f19"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
                <circle
                  cx={p.x}
                  cy={p.ySif}
                  r={isHovered ? 6 : 4}
                  fill="#0b0f19"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovered */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
              {points[hoveredIndex].period} ({points[hoveredIndex].date})
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-primary)' }}>
                Total: <strong>{points[hoveredIndex].totalReports}</strong>
              </span>
              <span style={{ color: 'var(--color-sif)' }}>
                SIF Precursor: <strong>{points[hoveredIndex].sifPotentialReports}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
