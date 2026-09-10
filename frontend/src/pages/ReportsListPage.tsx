import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, RefreshCw } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonTable } from '../components/common/SkeletonTable';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportTable } from '../components/reports/ReportTable';
import { ReportPagination } from '../components/reports/ReportPagination';
import { reportService } from '../services/reportService';
import { MOCK_REPORTS_LIST } from '../mock/mockReportsList';
import type { SafetyReport } from '../types/safety.types';
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
  const [reports, setReports] = useState<SafetyReport[]>(MOCK_REPORTS_LIST);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await reportService.getReports(1, 100);
      setReports(response.data || []);
    } catch (err: any) {
      console.warn('Backend reports fetch failed or offline:', err);
      setReports(MOCK_REPORTS_LIST);
      // If we already have reports, keep them, otherwise show error
      if (reports.length === 0) {
        setErrorMessage(err.message || 'Unable to load safety reports.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [reports.length]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (updated: Partial<ReportFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to page 1 on filter modification
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.site !== 'ALL' ||
    filters.department !== 'ALL' ||
    filters.activity !== 'ALL' ||
    filters.reportType !== 'ALL' ||
    filters.riskLevel !== 'ALL' ||
    filters.sifPotential !== 'ALL' ||
    filters.status !== 'ALL';

  // Filter the reports based on all active criteria
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
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
  }, [reports, filters]);

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
            {reports.length} Total Registered
          </span>
        }
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={fetchReports}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              title="Refresh reports list"
            >
              <RefreshCw size={14} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
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
          </div>
        }
      />

      {/* Multi-Dimensional Filter Bar */}
      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={totalRecords}
        totalRecords={reports.length}
      />

      {errorMessage && reports.length === 0 ? (
        <ErrorState
          title="Unable to load safety reports"
          message={errorMessage}
          onRetry={fetchReports}
          isRetrying={isLoading}
        />
      ) : isLoading && reports.length === 0 ? (
        <SkeletonTable rows={6} columns={6} />
      ) : reports.length === 0 ? (
        <EmptyState
          type="reports"
          title="No safety reports found"
          description="No safety observations, near misses, or precursor incidents have been registered in the database yet."
          action={
            <Link
              to="/reports/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Plus size={15} />
              Submit First Report
            </Link>
          }
        />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          type="search"
          title="No reports match your filters"
          description="No safety reports matched your active search or filter criteria. Try broadening your filter selection."
          action={
            hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
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
                Reset All Filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
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
        </>
      )}
    </PageContainer>
  );
};
