import React from 'react';
import { Calendar, MapPin, Building2, Activity, RefreshCw } from 'lucide-react';
import type { DashboardFilterState } from '../../types/dashboard.types';
import { MOCK_FILTER_OPTIONS } from '../../mock/mockDashboardData';

interface DashboardFiltersProps {
  filters: DashboardFilterState;
  onChange: (updated: Partial<DashboardFilterState>) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  onChange,
  onRefresh,
  isLoading = false
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      {/* Left side: Filter controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {/* Date Range Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={15} color="var(--color-text-muted)" />
          <select
            value={filters.dateRange}
            onChange={(e) => onChange({ dateRange: e.target.value as DashboardFilterState['dateRange'] })}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90d)</option>
            <option value="1y">Year to Date (YTD)</option>
          </select>
        </div>

        {/* Site Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={15} color="var(--color-text-muted)" />
          <select
            value={filters.site}
            onChange={(e) => onChange({ site: e.target.value })}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              outline: 'none',
              maxWidth: '200px',
              cursor: 'pointer'
            }}
          >
            {MOCK_FILTER_OPTIONS.sites.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={15} color="var(--color-text-muted)" />
          <select
            value={filters.department}
            onChange={(e) => onChange({ department: e.target.value })}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              outline: 'none',
              maxWidth: '180px',
              cursor: 'pointer'
            }}
          >
            {MOCK_FILTER_OPTIONS.departments.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={15} color="var(--color-text-muted)" />
          <select
            value={filters.activity}
            onChange={(e) => onChange({ activity: e.target.value })}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              outline: 'none',
              maxWidth: '180px',
              cursor: 'pointer'
            }}
          >
            {MOCK_FILTER_OPTIONS.activities.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Refresh & Active status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-safe)'
            }}
          />
          Live Analytics Engine
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '5px 10px',
            fontSize: '12px',
            color: 'var(--color-text-main)',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          title="Refresh metrics"
        >
          <RefreshCw
            size={13}
            style={{
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};
