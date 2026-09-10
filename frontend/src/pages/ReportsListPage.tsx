import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportTable } from '../components/reports/ReportTable';
import { ReportPagination } from '../components/reports/ReportPagination';
import { MOCK_REPORTS_LIST } from '../mock/mockReportsList';
import type { ReportFilterState } from '../types/reportFilter.types';

const INITIAL_FILTERS: ReportFilterState = {
  search: '',
  site: 'ALL',
  department: 'ALL',
  activity: 'ALL',
  reportType: 'ALL',
  riskLevel: 'ALL',
  sifPotential: 'ALL',
  status: 'ALL'
};

const PAGE_SIZE = 6;

export const ReportsListPage: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleFilterChange = (updated: Partial<ReportFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to page 1 on filter modification
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Filter the mock reports based on all active criteria
  const filteredReports = useMemo(() => {
    return MOCK_REPORTS_LIST.filter((report) => {
      // 1. Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesSearch =
          report.reportNumber?.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.site.toLowerCase().includes(query) ||
          report.activity.toLowerCase().includes(query) ||
          report.department?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // 2. Site filter
      if (filters.site !== 'ALL' && report.site !== filters.site) {
        return false;
      }

      // 3. Department filter
      if (filters.department !== 'ALL' && report.department !== filters.department) {
        return false;
      }

      // 4. Report Type filter
      if (filters.reportType !== 'ALL' && report.reportType !== filters.reportType) {
        return false;
      }

      // 5. Risk Level filter
      if (filters.riskLevel !== 'ALL') {
        const risk = report.latestAnalysis?.riskLevel;
        if (risk !== filters.riskLevel) return false;
      }

      // 6. SIF Potential filter
      if (filters.sifPotential === 'SIF_ONLY') {
        if (!report.latestAnalysis?.sifPotential) return false;
      } else if (filters.sifPotential === 'NON_SIF') {
        if (report.latestAnalysis?.sifPotential) return false;
      }

      // 7. Status filter
      if (filters.status !== 'ALL' && report.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Paginate filtered results
  const totalRecords = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, currentPage]);

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Safety Observations & Precursor Log"
        description="Comprehensive audit register of field observations, near misses, and AI SIF precursor assessments across operational sites."
        badge={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            <ShieldAlert size={12} />
            {MOCK_REPORTS_LIST.length} Total Registered
          </span>
        }
        actions={
          <Link
            to="/reports/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Plus size={16} />
            Submit Safety Report
          </Link>
        }
      />

      {/* Multi-Dimensional Filter Bar */}
      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={totalRecords}
        totalRecords={MOCK_REPORTS_LIST.length}
      />

      {/* Reports Table */}
      <ReportTable reports={paginatedReports} />

      {/* Pagination Controls */}
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </PageContainer>
  );
};
