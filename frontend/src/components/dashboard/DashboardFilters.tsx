import React from 'react';
import { Calendar, MapPin, Building2, Activity, RefreshCw, ChevronDown, Filter } from 'lucide-react';
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
    <div className="dashboard-filter-bar">
      {/* Left side: Filter controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
          <Filter size={14} color="var(--color-primary)" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Filters:
          </span>
        </div>

        {/* Date Range Selector */}
        <div className="custom-dropdown-container" title="Filter by time period">
          <div className="custom-dropdown-icon">
            <Calendar size={14} />
          </div>
          <select
            className="custom-dropdown-select"
            value={filters.dateRange}
            onChange={(e) => onChange({ dateRange: e.target.value as DashboardFilterState['dateRange'] })}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90d)</option>
            <option value="1y">Year to Date (YTD)</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Site Filter */}
        <div className="custom-dropdown-container" title="Filter by operational facility">
          <div className="custom-dropdown-icon">
            <MapPin size={14} />
          </div>
          <select
            className="custom-dropdown-select"
            value={filters.site}
            onChange={(e) => onChange({ site: e.target.value })}
            style={{ maxWidth: '180px' }}
          >
            {MOCK_FILTER_OPTIONS.sites.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Department Filter */}
        <div className="custom-dropdown-container" title="Filter by department">
          <div className="custom-dropdown-icon">
            <Building2 size={14} />
          </div>
          <select
            className="custom-dropdown-select"
            value={filters.department}
            onChange={(e) => onChange({ department: e.target.value })}
            style={{ maxWidth: '170px' }}
          >
            {MOCK_FILTER_OPTIONS.departments.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Activity Filter */}
        <div className="custom-dropdown-container" title="Filter by activity">
          <div className="custom-dropdown-icon">
            <Activity size={14} />
          </div>
          <select
            className="custom-dropdown-select"
            value={filters.activity}
            onChange={(e) => onChange({ activity: e.target.value })}
            style={{ maxWidth: '170px' }}
          >
            {MOCK_FILTER_OPTIONS.activities.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>
      </div>

      {/* Right side: Refresh & Active status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)'
            }}
          />
          Live Analytics Engine
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-main)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-main)';
            }
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
