import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { DashboardKpiCards } from '../components/dashboard/DashboardKpiCards';
import { SifDistributionChart } from '../components/dashboard/SifDistributionChart';
import { RiskDistributionChart } from '../components/dashboard/RiskDistributionChart';
import { SafetyTrendChart } from '../components/dashboard/SafetyTrendChart';
import { TopHazardsChart } from '../components/dashboard/TopHazardsChart';
import { IogpRulesBreakdown } from '../components/dashboard/IogpRulesBreakdown';
import { ReportsBySiteChart } from '../components/dashboard/ReportsBySiteChart';
import { EmergingPatternsWidget } from '../components/dashboard/EmergingPatternsWidget';
import { SafetyInsightsSection } from '../components/dashboard/SafetyInsightsSection';
import { HighPriorityReportsSection } from '../components/dashboard/HighPriorityReportsSection';
import { RecentReportsTable } from '../components/dashboard/RecentReportsTable';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData, DashboardFilterState } from '../types/dashboard.types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilterState>({
    dateRange: '30d',
    site: 'ALL',
    department: 'ALL',
    activity: 'ALL'
  });

  const loadDashboardMetrics = useCallback(async (currentFilters: DashboardFilterState) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await dashboardService.getDashboardData(currentFilters);
      setData(response);
    } catch (err: any) {
      console.error('Failed to load dashboard metrics:', err);
      setErrorMessage(err.message || 'Unable to load HSE dashboard analytics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardMetrics(filters);
  }, [filters, loadDashboardMetrics]);

  const handleFilterChange = (updated: Partial<DashboardFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleRefresh = () => {
    loadDashboardMetrics(filters);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="HSE Safety Intelligence Command Center"
        description="Continuous SIF Precursor monitoring, barrier degradation analytics, and IOGP Life-Saving Rules compliance across operations."
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
            <ShieldAlert size={12} />
            SIF-Guard Active
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

      {/* Dashboard Filter Toolbar */}
      <DashboardFilters
        filters={filters}
        onChange={handleFilterChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Error state if query fails completely */}
      {errorMessage && !data ? (
        <ErrorState
          title="Unable to load dashboard analytics"
          message={errorMessage}
          onRetry={handleRefresh}
          isRetrying={isLoading}
        />
      ) : isLoading && !data ? (
        /* SKELETON DASHBOARD LOADING STATE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 5 Top KPI Card Skeletons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            <SkeletonCard count={5} height="120px" lines={1} />
          </div>

          {/* SIF & Risk Distribution Skeletons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '20px'
            }}
          >
            <SkeletonCard height="240px" lines={3} />
            <SkeletonCard height="240px" lines={3} />
          </div>

          {/* Trend Timeline Skeleton */}
          <SkeletonCard height="280px" lines={4} />

          {/* Hazards & LSR Skeletons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '20px'
            }}
          >
            <SkeletonCard height="260px" lines={4} />
            <SkeletonCard height="260px" lines={4} />
          </div>
        </div>
      ) : data ? (
        <>
          {/* Top 5 KPI Metrics */}
          <DashboardKpiCards summary={data.summary} />

          {/* SIF Potential & Risk Level Distribution (2 Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            <SifDistributionChart distribution={data.sifDistribution} />
            <RiskDistributionChart distribution={data.riskDistribution} />
          </div>

          {/* Safety Reports Trend Timeline (Full Width) */}
          <div style={{ marginBottom: '24px' }}>
            <SafetyTrendChart trends={data.trends} />
          </div>

          {/* Top Hazards & IOGP Life-Saving Rules (2 Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            <TopHazardsChart hazards={data.hazards} />
            <IogpRulesBreakdown rules={data.iogpRules} />
          </div>

          {/* Reports by Site & Emerging Patterns Widget (2 Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            <ReportsBySiteChart distribution={data.siteDistribution} />
            <EmergingPatternsWidget
              patterns={data.emergingPatterns}
              totalActiveCount={data.summary.activePatternsCount || 5}
            />
          </div>

          {/* AI Safety Insights Section */}
          <SafetyInsightsSection insights={data.insights} />

          {/* High Priority Safety Reports Section */}
          <HighPriorityReportsSection reports={data.highPriorityReports} />

          {/* Recent Safety Reports Table */}
          <RecentReportsTable reports={data.recentReports} />
        </>
      ) : null}
    </PageContainer>
  );
};
