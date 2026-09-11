import React from 'react';
import { Search, RotateCcw, ChevronDown, MapPin, Building2, AlertTriangle, ShieldCheck, FileSpreadsheet, Activity } from 'lucide-react';
import type { ReportFilterState } from '../../types/reportFilter.types';
import type { ReportType, RiskLevel, ProcessingStatus } from '../../types/safety.types';

interface ReportFiltersProps {
  filters: ReportFilterState;
  onChange: (updated: Partial<ReportFilterState>) => void;
  onReset: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalFiltered,
  totalRecords
}) => {
  // Count active non-default filters
  const activeFilterCount = [
    filters.search !== '',
    filters.site !== 'ALL',
    filters.department !== 'ALL',
    filters.activity !== 'ALL',
    filters.reportType !== 'ALL',
    filters.riskLevel !== 'ALL',
    filters.sifPotential !== 'ALL',
    filters.status !== 'ALL',
    Boolean(filters.fromDate),
    Boolean(filters.toDate)
  ].filter(Boolean).length;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* Top Search & Filter Summary Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '100px',
            padding: '7px 16px',
            flex: 1,
            minWidth: '260px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search report ID, site, activity, observation text..."
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              outline: 'none',
              width: '100%',
              fontSize: '13px'
            }}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '0 4px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Summary & Reset Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <strong>{totalFiltered}</strong> of {totalRecords} reports
          </span>

          {activeFilterCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-subtle)',
                border: '1px solid rgba(255, 72, 0, 0.2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={activeFilterCount === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: activeFilterCount > 0 ? 'var(--text-main)' : 'var(--text-dim)',
              cursor: activeFilterCount > 0 ? 'pointer' : 'default',
              opacity: activeFilterCount > 0 ? 1 : 0.5,
              transition: 'all 0.15s ease'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px'
        }}
      >
        {/* Site Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <MapPin size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.site}
            onChange={(e) => onChange({ site: e.target.value })}
          >
            <option value="ALL">All Sites</option>
            <option value="Digboi Refinery - Unit 4">Digboi Refinery - Unit 4</option>
            <option value="Digboi Refinery - Tank Farm B">Digboi Refinery - Tank Farm B</option>
            <option value="Duliajan Drilling Rig #7">Duliajan Drilling Rig #7</option>
            <option value="Moran Gathering Station">Moran Gathering Station</option>
            <option value="Numaligarh Terminal">Numaligarh Terminal</option>
            <option value="Jorhat Crude Pumping Station">Jorhat Crude Pumping Station</option>
            <option value="Offshore Platform Alpha">Offshore Platform Alpha</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Department Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <Building2 size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.department}
            onChange={(e) => onChange({ department: e.target.value })}
          >
            <option value="ALL">All Departments</option>
            <option value="Mechanical Maintenance">Mechanical Maintenance</option>
            <option value="Operations & Process">Operations & Process</option>
            <option value="Drilling & Well Servicing">Drilling & Well Servicing</option>
            <option value="Electrical & Instrumentation">Electrical & Instrumentation</option>
            <option value="Civil & Scaffolding">Civil & Scaffolding</option>
            <option value="Logistics & Heavy Transport">Logistics & Heavy Transport</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Report Type Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <FileSpreadsheet size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.reportType}
            onChange={(e) => onChange({ reportType: e.target.value as ReportType | 'ALL' })}
          >
            <option value="ALL">All Report Types</option>
            <option value="UNSAFE_ACT">Unsafe Act</option>
            <option value="UNSAFE_CONDITION">Unsafe Condition</option>
            <option value="NEAR_MISS">Near Miss</option>
            <option value="INCIDENT">Incident</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Risk Level Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <AlertTriangle size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.riskLevel}
            onChange={(e) => onChange({ riskLevel: e.target.value as RiskLevel | 'ALL' })}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* SIF Potential Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <ShieldCheck size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.sifPotential}
            onChange={(e) => onChange({ sifPotential: e.target.value as 'ALL' | 'SIF_ONLY' | 'NON_SIF' })}
          >
            <option value="ALL">All SIF States</option>
            <option value="SIF_ONLY">SIF Potential Only</option>
            <option value="NON_SIF">Non-SIF Only</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>

        {/* Analysis Status Filter */}
        <div className="custom-dropdown-container" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="custom-dropdown-icon">
            <Activity size={13} />
          </div>
          <select
            className="custom-dropdown-select"
            style={{ width: '100%', maxWidth: '100%' }}
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as ProcessingStatus | 'ALL' })}
          >
            <option value="ALL">All Statuses</option>
            <option value="ANALYZED">Analyzed</option>
            <option value="ANALYZING">Analyzing</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <div className="custom-dropdown-chevron">
            <ChevronDown size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};
