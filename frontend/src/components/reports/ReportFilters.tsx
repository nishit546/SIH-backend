import { Search, RotateCcw } from 'lucide-react';
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
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
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
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '7px 12px',
            flex: 1,
            minWidth: '260px'
          }}
        >
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search report ID, site, activity, observation text..."
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-main)',
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
                color: 'var(--color-text-muted)',
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
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{totalFiltered}</strong> of {totalRecords} reports
          </span>

          {activeFilterCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(2, 132, 199, 0.3)',
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
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: activeFilterCount > 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              cursor: activeFilterCount > 0 ? 'pointer' : 'default',
              opacity: activeFilterCount > 0 ? 1 : 0.5
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px'
        }}
      >
        {/* Site Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Site / Facility
          </label>
          <select
            value={filters.site}
            onChange={(e) => onChange({ site: e.target.value })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
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
        </div>

        {/* Department Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ department: e.target.value })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Departments</option>
            <option value="Mechanical Maintenance">Mechanical Maintenance</option>
            <option value="Operations & Process">Operations & Process</option>
            <option value="Drilling & Well Servicing">Drilling & Well Servicing</option>
            <option value="Electrical & Instrumentation">Electrical & Instrumentation</option>
            <option value="Civil & Scaffolding">Civil & Scaffolding</option>
            <option value="Logistics & Heavy Transport">Logistics & Heavy Transport</option>
          </select>
        </div>

        {/* Report Type Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Report Type
          </label>
          <select
            value={filters.reportType}
            onChange={(e) => onChange({ reportType: e.target.value as ReportType | 'ALL' })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Types</option>
            <option value="UNSAFE_ACT">Unsafe Act</option>
            <option value="UNSAFE_CONDITION">Unsafe Condition</option>
            <option value="NEAR_MISS">Near Miss</option>
            <option value="INCIDENT">Incident</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Risk Tier
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => onChange({ riskLevel: e.target.value as RiskLevel | 'ALL' })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        {/* SIF Potential Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            SIF Potential
          </label>
          <select
            value={filters.sifPotential}
            onChange={(e) => onChange({ sifPotential: e.target.value as 'ALL' | 'SIF_ONLY' | 'NON_SIF' })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All SIF States</option>
            <option value="SIF_ONLY">SIF Potential Only</option>
            <option value="NON_SIF">Non-SIF Only</option>
          </select>
        </div>

        {/* Analysis Status Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Analysis Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as ProcessingStatus | 'ALL' })}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ANALYZED">Analyzed</option>
            <option value="ANALYZING">Analyzing</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
