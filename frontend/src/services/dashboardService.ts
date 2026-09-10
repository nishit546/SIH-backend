import { apiClient } from '../api/apiClient';
import type {
  DashboardData,
  DashboardFilterState,
  DashboardSummary,
  SifDistribution,
  RiskDistributionItem,
  HazardStat,
  IogpRuleStat,
  SiteDistributionItem,
  SafetyTrendPoint,
  SafetyInsight,
  RecentReport
} from '../types/dashboard.types';
import { MOCK_DASHBOARD_DATA } from '../mock/mockDashboardData';

export interface IDashboardService {
  getDashboardData(filters?: Partial<DashboardFilterState>): Promise<DashboardData>;
}

// Backend API response payload shapes
interface BackendSummary {
  totalReports: number;
  analyzedReports: number;
  pendingReports: number;
  sifPotentialReports: number;
  nonSifPotentialReports: number;
  highRiskReports: number;
  mediumRiskReports: number;
  lowRiskReports: number;
  openCorrectiveActions: number;
  completedCorrectiveActions: number;
}

interface BackendSifDistribution {
  sifPotential: number;
  notSifPotential: number;
  unanalyzed: number;
}

interface BackendRiskItem {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  count: number;
}

interface BackendHazardItem {
  hazard: string;
  count: number;
}

interface BackendIogpRuleItem {
  rule: string;
  count: number;
}

interface BackendSiteItem {
  site: string;
  totalReports: number;
  analyzedReports: number;
  sifPotentialReports: number;
}

interface BackendTrendItem {
  period: string;
  totalReports: number;
  sifPotentialReports: number;
}

/**
 * Real Backend Dashboard Service
 * Fetches live analytics from Node.js / Express backend endpoints under /api/dashboard.
 */
export class RealDashboardService implements IDashboardService {
  async getDashboardData(filters?: Partial<DashboardFilterState>): Promise<DashboardData> {
    // 1. Build query parameters conforming to backend dashboardFilterSchema
    const params: Record<string, string | number> = {};

    if (filters?.site && filters.site !== 'ALL') {
      params.site = filters.site;
    }
    if (filters?.department && filters.department !== 'ALL') {
      params.department = filters.department;
    }
    if (filters?.activity && filters.activity !== 'ALL') {
      params.activity = filters.activity;
    }

    if (filters?.dateRange && filters.dateRange !== 'custom') {
      const now = new Date();
      let days = 30;
      if (filters.dateRange === '7d') days = 7;
      else if (filters.dateRange === '30d') days = 30;
      else if (filters.dateRange === '90d') days = 90;
      else if (filters.dateRange === '1y') days = 365;

      params.from = new Date(now.getTime() - days * 86400000).toISOString();
      params.to = now.toISOString();
    }

    if (filters?.from) params.from = filters.from;
    if (filters?.to) params.to = filters.to;

    // 2. Fetch all independent dashboard datasets concurrently
    const [
      summaryRes,
      sifRes,
      riskRes,
      hazardsRes,
      iogpRes,
      sitesRes,
      trendsRes,
      recentReportsRes
    ] = await Promise.all([
      apiClient.get<{ success: boolean; data: BackendSummary }>('/dashboard/summary', params),
      apiClient.get<{ success: boolean; data: BackendSifDistribution }>('/dashboard/sif-distribution', params),
      apiClient.get<{ success: boolean; data: BackendRiskItem[] }>('/dashboard/risk-distribution', params),
      apiClient.get<{ success: boolean; data: BackendHazardItem[] }>('/dashboard/hazards', {
        ...params,
        limit: 10
      }),
      apiClient.get<{ success: boolean; data: BackendIogpRuleItem[] }>('/dashboard/iogp-rules', {
        ...params,
        limit: 10
      }),
      apiClient.get<{ success: boolean; data: BackendSiteItem[] }>('/dashboard/sites', params),
      apiClient.get<{ success: boolean; data: BackendTrendItem[] }>('/dashboard/trends', {
        ...params,
        period: 'monthly'
      }),
      apiClient.get<{ success: boolean; data: any[]; pagination: any }>('/reports', {
        limit: 6
      })
    ]);

    // 3. Map Backend Summary
    const sum = summaryRes.data.data;
    const total = sum.totalReports || 0;
    const sifCount = sum.sifPotentialReports || 0;
    const highRiskCount = sum.highRiskReports || 0;
    const pendingCount = sum.pendingReports || 0;

    const summary: DashboardSummary = {
      totalReports: total,
      sifPotentialReports: sifCount,
      sifPotentialRate: total > 0 ? parseFloat(((sifCount / total) * 100).toFixed(1)) : 0,
      highRiskReports: highRiskCount,
      highRiskRate: total > 0 ? parseFloat(((highRiskCount / total) * 100).toFixed(1)) : 0,
      pendingAnalysis: pendingCount,
      activePatternsCount: 0,
      openCorrectiveActions: sum.openCorrectiveActions || 0,
      completedCorrectiveActions: sum.completedCorrectiveActions || 0,
      changeFromLastPeriod: {
        totalReports: 0,
        sifPotential: 0,
        highRisk: 0,
        pending: 0,
        patterns: 0
      }
    };

    // 4. Map SIF Distribution
    const sifData = sifRes.data.data;
    const sifDistribution: SifDistribution = {
      sifPotential: sifData.sifPotential || 0,
      notSifPotential: sifData.notSifPotential || 0,
      unanalyzed: sifData.unanalyzed || 0
    };

    // 5. Map Risk Level Distribution
    const riskItems = riskRes.data.data || [];
    const riskTotal = riskItems.reduce((acc, cur) => acc + (cur.count || 0), 0);
    const riskColorMap: Record<string, string> = {
      LOW: 'var(--color-safe)',
      MEDIUM: 'var(--color-warning)',
      HIGH: 'var(--color-danger)',
      CRITICAL: 'var(--color-sif)'
    };
    const riskLevels: Array<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = [
      'CRITICAL',
      'HIGH',
      'MEDIUM',
      'LOW'
    ];
    const riskDistribution: RiskDistributionItem[] = riskLevels.map((level) => {
      const item = riskItems.find((r) => r.riskLevel === level);
      const count = item ? item.count : 0;
      return {
        level,
        count,
        percentage: riskTotal > 0 ? Math.round((count / riskTotal) * 100) : 0,
        color: riskColorMap[level] || 'var(--color-primary)'
      };
    });

    // 6. Map Hazards
    const rawHazards = hazardsRes.data.data || [];
    const totalHazardsCount = rawHazards.reduce((acc, cur) => acc + (cur.count || 0), 0);
    const hazards: HazardStat[] = rawHazards.map((h) => ({
      hazard: h.hazard,
      count: h.count,
      sifCount: 0,
      percentage: totalHazardsCount > 0 ? Math.round((h.count / totalHazardsCount) * 100) : 0
    }));

    // 7. Map IOGP Rules
    const rawRules = iogpRes.data.data || [];
    const totalRulesCount = rawRules.reduce((acc, cur) => acc + (cur.count || 0), 0);
    const iogpRules: IogpRuleStat[] = rawRules.map((r, idx) => ({
      rule: r.rule,
      code: `LSR-0${(idx % 9) + 1}`,
      count: r.count,
      sifCount: 0,
      percentage: totalRulesCount > 0 ? Math.round((r.count / totalRulesCount) * 100) : 0
    }));

    // 8. Map Site Distribution
    const rawSites = sitesRes.data.data || [];
    const siteDistribution: SiteDistributionItem[] = rawSites.map((s) => ({
      site: s.site,
      totalReports: s.totalReports,
      sifReports: s.sifPotentialReports,
      highRiskReports: 0,
      percentage: total > 0 ? Math.round((s.totalReports / total) * 100) : 0
    }));

    // 9. Map Trends
    const rawTrends = trendsRes.data.data || [];
    const trends: SafetyTrendPoint[] = rawTrends.map((t) => ({
      period: t.period,
      date: t.period,
      totalReports: t.totalReports,
      sifPotentialReports: t.sifPotentialReports,
      highRiskReports: 0
    }));

    // 10. Map Recent Reports & High Priority Reports
    const rawReports = recentReportsRes.data.data || [];
    const recentReports: RecentReport[] = rawReports.map((r: any) => ({
      id: r.id,
      reportNumber: r.reportNumber,
      eventDate: r.eventDate
        ? new Date(r.eventDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : new Date(r.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
      site: r.site,
      activity: r.activity,
      reportType: r.reportType,
      riskLevel: r.latestAnalysis?.riskLevel,
      sifPotential: r.latestAnalysis?.sifPotential,
      status: r.status,
      headline: r.description
        ? r.description.length > 75
          ? r.description.slice(0, 75) + '...'
          : r.description
        : undefined
    }));

    const highPriorityReports: RecentReport[] = recentReports.filter(
      (r) => r.sifPotential === true || r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL'
    );

    // 11. Derive Live Safety Insights from Real Data
    const insights: SafetyInsight[] = [];
    if (sifCount > 0) {
      insights.push({
        id: 'ins-sif',
        type: 'CRITICAL',
        title: 'SIF Precursor Alerts Active',
        message: `${sifCount} safety reports identified with high potential for Serious Injury or Fatality.`,
        metric: `${total > 0 ? ((sifCount / total) * 100).toFixed(1) : 0}% SIF Rate`,
        suggestedAction: 'Review critical barrier degradation and verify Energy Isolation controls.',
        detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    if (rawHazards.length > 0) {
      insights.push({
        id: 'ins-hazard',
        type: 'WARNING',
        title: `Top Hazard Exposure: ${rawHazards[0].hazard}`,
        message: `Hazard "${rawHazards[0].hazard}" recorded highest event frequency (${rawHazards[0].count} reports).`,
        metric: `${rawHazards[0].count} occurrences`,
        suggestedAction: 'Deploy targeted safety walkthroughs and verify job hazard analysis compliance.',
        detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    if (pendingCount > 0) {
      insights.push({
        id: 'ins-pending',
        type: 'INFO',
        title: 'AI Processing Queue Active',
        message: `${pendingCount} safety reports currently in queue awaiting AI precursor evaluation.`,
        metric: `${pendingCount} pending`,
        detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    if (insights.length === 0) {
      insights.push({
        id: 'ins-live',
        type: 'INFO',
        title: 'Live HSE Intelligence Active',
        message:
          'Continuous monitoring running. New safety submissions will automatically update hazard clusters and SIF precursor metrics.',
        detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    return {
      summary,
      sifDistribution,
      riskDistribution,
      hazards,
      iogpRules,
      siteDistribution,
      trends,
      insights,
      emergingPatterns: [],
      highPriorityReports,
      recentReports
    };
  }
}

/**
 * Mock Dashboard Service (retained for development fallback / testing)
 */
export class MockDashboardService implements IDashboardService {
  async getDashboardData(filters?: Partial<DashboardFilterState>): Promise<DashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const data: DashboardData = JSON.parse(JSON.stringify(MOCK_DASHBOARD_DATA));

    if (filters?.site && filters.site !== 'ALL') {
      const selectedSite = filters.site;
      const siteItem = data.siteDistribution.find((s) => s.site === selectedSite);

      const total = siteItem ? siteItem.totalReports : 28;
      const sif = siteItem ? siteItem.sifReports : 8;
      const high = siteItem ? siteItem.highRiskReports : 9;

      data.summary.totalReports = total;
      data.summary.sifPotentialReports = sif;
      data.summary.sifPotentialRate = total > 0 ? parseFloat(((sif / total) * 100).toFixed(1)) : 0;
      data.summary.highRiskReports = high;
      data.summary.highRiskRate = total > 0 ? parseFloat(((high / total) * 100).toFixed(1)) : 0;
      data.summary.pendingAnalysis = Math.max(1, Math.round(total * 0.05));

      data.sifDistribution.sifPotential = sif;
      data.sifDistribution.notSifPotential = total - sif - data.summary.pendingAnalysis;
      data.sifDistribution.unanalyzed = data.summary.pendingAnalysis;
    }

    return data;
  }
}

// Export the singleton service instance using the Real Backend API
export const mockDashboardService = new MockDashboardService();
export const realDashboardService = new RealDashboardService();
export const dashboardService: IDashboardService = realDashboardService;
