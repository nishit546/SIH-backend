import React, { useState } from 'react';
import { Layers, Sparkles, Filter } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { PatternSummaryCards } from '../components/patterns/PatternSummaryCards';
import { PatternCard } from '../components/patterns/PatternCard';
import { PatternDetailModal } from '../components/patterns/PatternDetailModal';
import { MOCK_PATTERN_SUMMARY, MOCK_SAFETY_PATTERNS } from '../mock/mockPatternsData';
import type { SafetyPatternItem } from '../types/pattern.types';

export const PatternsPage: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<SafetyPatternItem | null>(null);
  const [trendFilter, setTrendFilter] = useState<string>('ALL');

  const filteredPatterns = MOCK_SAFETY_PATTERNS.filter((p) => {
    if (trendFilter === 'ALL') return true;
    return p.trend === trendFilter;
  });

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Emerging Safety Patterns & Systemic Hotspots"
        description="Cross-report AI cluster detection identifying recurring barrier breakdowns, repeated control gaps, and facility risk concentrations."
        badge={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-sif)',
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            <Sparkles size={12} />
            Cross-Report Intelligence
          </span>
        }
      />

      {/* Top 4 Summary Cards */}
      <PatternSummaryCards summary={MOCK_PATTERN_SUMMARY} />

      {/* Filter & Subheader Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            Active Precursor Pattern Clusters ({filteredPatterns.length})
          </h3>
        </div>

        {/* Trend Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginRight: '4px' }}>
            Trajectory:
          </span>

          {[
            { id: 'ALL', label: 'All Patterns' },
            { id: 'INCREASING', label: 'Increasing (Escalating)' },
            { id: 'STABLE', label: 'Stable' },
            { id: 'DECREASING', label: 'Decreasing' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTrendFilter(item.id)}
              style={{
                backgroundColor: trendFilter === item.id ? 'var(--color-primary)' : 'var(--bg-card)',
                border: `1px solid ${trendFilter === item.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                color: trendFilter === item.id ? '#ffffff' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patterns List or Empty State */}
      {filteredPatterns.length === 0 ? (
        <EmptyState
          type="patterns"
          title="No emerging patterns detected"
          description={`No recurring failure patterns match the "${trendFilter}" trajectory filter.`}
          action={
            <button
              type="button"
              onClick={() => setTrendFilter('ALL')}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '7px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Show All Patterns
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPatterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} onSelect={(pat) => setSelectedPattern(pat)} />
          ))}
        </div>
      )}

      {/* Deep Inspection Modal */}
      <PatternDetailModal pattern={selectedPattern} onClose={() => setSelectedPattern(null)} />
    </PageContainer>
  );
};
