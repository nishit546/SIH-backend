import prisma from '../config/database';
import {
  DashboardFilterQuery,
  LimitFilterQuery,
  TrendFilterQuery,
  DashboardSummaryResponse,
  SifDistributionResponse,
  RiskDistributionItem,
  HazardFrequencyItem,
  IogpRuleFrequencyItem,
  ReportTypeCountItem,
  SiteAnalyticsItem,
  DepartmentAnalyticsItem,
  ActivityAnalyticsItem,
  TrendDataPoint,
} from '../types/dashboard.types';
import { ActionStatus, ProcessingStatus, RiskLevel, Prisma } from '@prisma/client';

export class DashboardService {
  /**
   * Helper to build Prisma where filter for SafetyReport
   */
  private buildReportWhere(filters: DashboardFilterQuery): Prisma.SafetyReportWhereInput {
    const where: Prisma.SafetyReportWhereInput = {};

    if (filters.site) {
      where.site = { contains: filters.site };
    }
    if (filters.department) {
      where.department = { contains: filters.department };
    }
    if (filters.activity) {
      where.activity = { contains: filters.activity };
    }
    if (filters.reportType) {
      where.reportType = filters.reportType;
    }
    if (filters.from || filters.to) {
      where.eventDate = {};
      if (filters.from) {
        where.eventDate.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.eventDate.lte = new Date(filters.to);
      }
    }

    return where;
  }

  /**
   * 1. GET /api/dashboard/summary
   */
  async getSummary(filters: DashboardFilterQuery): Promise<DashboardSummaryResponse> {
    const reportWhere = this.buildReportWhere(filters);

    const [
      totalReports,
      analyzedReports,
      pendingReports,
      sifPotentialReports,
      nonSifPotentialReports,
      highRiskReports,
      mediumRiskReports,
      lowRiskReports,
      openCorrectiveActions,
      completedCorrectiveActions,
    ] = await Promise.all([
      prisma.safetyReport.count({ where: reportWhere }),
      prisma.safetyReport.count({
        where: { ...reportWhere, status: ProcessingStatus.ANALYZED },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          status: { in: [ProcessingStatus.PENDING, ProcessingStatus.ANALYZING] },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, sifPotential: true } },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, sifPotential: false } },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: {
            some: { isLatest: true, riskLevel: { in: [RiskLevel.HIGH, RiskLevel.CRITICAL] } },
          },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, riskLevel: RiskLevel.MEDIUM } },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, riskLevel: RiskLevel.LOW } },
        },
      }),
      prisma.correctiveAction.count({
        where: {
          status: { in: [ActionStatus.OPEN, ActionStatus.IN_PROGRESS] },
          report: reportWhere,
        },
      }),
      prisma.correctiveAction.count({
        where: {
          status: ActionStatus.COMPLETED,
          report: reportWhere,
        },
      }),
    ]);

    return {
      totalReports,
      analyzedReports,
      pendingReports,
      sifPotentialReports,
      nonSifPotentialReports,
      highRiskReports,
      mediumRiskReports,
      lowRiskReports,
      openCorrectiveActions,
      completedCorrectiveActions,
    };
  }

  /**
   * 2. GET /api/dashboard/sif-distribution
   */
  async getSifDistribution(filters: DashboardFilterQuery): Promise<SifDistributionResponse> {
    const reportWhere = this.buildReportWhere(filters);

    const [sifPotential, notSifPotential, unanalyzed] = await Promise.all([
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, sifPotential: true } },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          analyses: { some: { isLatest: true, sifPotential: false } },
        },
      }),
      prisma.safetyReport.count({
        where: {
          ...reportWhere,
          status: { not: ProcessingStatus.ANALYZED },
        },
      }),
    ]);

    return {
      sifPotential,
      notSifPotential,
      unanalyzed,
    };
  }

  /**
   * 3. GET /api/dashboard/risk-distribution
   */
  async getRiskDistribution(filters: DashboardFilterQuery): Promise<RiskDistributionItem[]> {
    const reportWhere = this.buildReportWhere(filters);

    const riskLevels = Object.values(RiskLevel);

    const counts = await Promise.all(
      riskLevels.map(async (level) => {
        const count = await prisma.safetyReport.count({
          where: {
            ...reportWhere,
            analyses: { some: { isLatest: true, riskLevel: level } },
          },
        });
        return { riskLevel: level, count };
      })
    );

    // Return only active levels with counts or ordered by severity
    return counts;
  }

  /**
   * 4. GET /api/dashboard/hazards
   */
  async getHazards(filters: LimitFilterQuery): Promise<HazardFrequencyItem[]> {
    const reportWhere = this.buildReportWhere(filters);
    const limit = filters.limit || 10;

    const analyses = await prisma.safetyAnalysis.findMany({
      where: {
        isLatest: true,
        report: reportWhere,
      },
      select: {
        hazards: true,
      },
    });

    const hazardMap = new Map<string, number>();

    for (const item of analyses) {
      if (Array.isArray(item.hazards)) {
        for (const h of item.hazards as string[]) {
          const trimmed = typeof h === 'string' ? h.trim() : '';
          if (trimmed.length > 0) {
            hazardMap.set(trimmed, (hazardMap.get(trimmed) || 0) + 1);
          }
        }
      }
    }

    const sortedHazards = Array.from(hazardMap.entries())
      .map(([hazard, count]) => ({ hazard, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedHazards;
  }

  /**
   * 5. GET /api/dashboard/iogp-rules
   */
  async getIogpRules(filters: LimitFilterQuery): Promise<IogpRuleFrequencyItem[]> {
    const reportWhere = this.buildReportWhere(filters);
    const limit = filters.limit || 10;

    const analyses = await prisma.safetyAnalysis.findMany({
      where: {
        isLatest: true,
        report: reportWhere,
      },
      select: {
        iogpRules: true,
      },
    });

    const ruleMap = new Map<string, number>();

    for (const item of analyses) {
      if (Array.isArray(item.iogpRules)) {
        for (const r of item.iogpRules as string[]) {
          const trimmed = typeof r === 'string' ? r.trim() : '';
          if (trimmed.length > 0) {
            ruleMap.set(trimmed, (ruleMap.get(trimmed) || 0) + 1);
          }
        }
      }
    }

    const sortedRules = Array.from(ruleMap.entries())
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedRules;
  }

  /**
   * 6. GET /api/dashboard/report-types
   */
  async getReportTypes(filters: DashboardFilterQuery): Promise<ReportTypeCountItem[]> {
    const reportWhere = this.buildReportWhere(filters);

    const groups = await prisma.safetyReport.groupBy({
      by: ['reportType'],
      where: reportWhere,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          reportType: 'desc',
        },
      },
    });

    return groups.map((g) => ({
      reportType: g.reportType,
      count: g._count._all,
    }));
  }

  /**
   * 7. GET /api/dashboard/sites
   */
  async getSites(filters: DashboardFilterQuery): Promise<SiteAnalyticsItem[]> {
    const reportWhere = this.buildReportWhere(filters);

    const siteGroups = await prisma.safetyReport.groupBy({
      by: ['site'],
      where: reportWhere,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          site: 'desc',
        },
      },
    });

    const results: SiteAnalyticsItem[] = await Promise.all(
      siteGroups.map(async (group) => {
        const siteFilter = { ...reportWhere, site: group.site };

        const [analyzedReports, sifPotentialReports] = await Promise.all([
          prisma.safetyReport.count({
            where: {
              ...siteFilter,
              status: ProcessingStatus.ANALYZED,
            },
          }),
          prisma.safetyReport.count({
            where: {
              ...siteFilter,
              analyses: { some: { isLatest: true, sifPotential: true } },
            },
          }),
        ]);

        return {
          site: group.site,
          totalReports: group._count._all,
          analyzedReports,
          sifPotentialReports,
        };
      })
    );

    return results;
  }

  /**
   * 8. GET /api/dashboard/departments
   */
  async getDepartments(filters: DashboardFilterQuery): Promise<DepartmentAnalyticsItem[]> {
    const reportWhere = this.buildReportWhere(filters);

    const deptGroups = await prisma.safetyReport.groupBy({
      by: ['department'],
      where: {
        ...reportWhere,
        department: { not: null },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          department: 'desc',
        },
      },
    });

    const results: DepartmentAnalyticsItem[] = await Promise.all(
      deptGroups.map(async (group) => {
        const deptName = group.department || 'Unassigned';
        const deptFilter = { ...reportWhere, department: group.department };

        const [analyzedReports, sifPotentialReports] = await Promise.all([
          prisma.safetyReport.count({
            where: {
              ...deptFilter,
              status: ProcessingStatus.ANALYZED,
            },
          }),
          prisma.safetyReport.count({
            where: {
              ...deptFilter,
              analyses: { some: { isLatest: true, sifPotential: true } },
            },
          }),
        ]);

        return {
          department: deptName,
          totalReports: group._count._all,
          analyzedReports,
          sifPotentialReports,
        };
      })
    );

    return results;
  }

  /**
   * 9. GET /api/dashboard/activities
   */
  async getActivities(filters: DashboardFilterQuery): Promise<ActivityAnalyticsItem[]> {
    const reportWhere = this.buildReportWhere(filters);

    const activityGroups = await prisma.safetyReport.groupBy({
      by: ['activity'],
      where: reportWhere,
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          activity: 'desc',
        },
      },
    });

    const results: ActivityAnalyticsItem[] = await Promise.all(
      activityGroups.map(async (group) => {
        const actFilter = { ...reportWhere, activity: group.activity };

        const [analyzedReports, sifPotentialReports] = await Promise.all([
          prisma.safetyReport.count({
            where: {
              ...actFilter,
              status: ProcessingStatus.ANALYZED,
            },
          }),
          prisma.safetyReport.count({
            where: {
              ...actFilter,
              analyses: { some: { isLatest: true, sifPotential: true } },
            },
          }),
        ]);

        return {
          activity: group.activity,
          totalReports: group._count._all,
          analyzedReports,
          sifPotentialReports,
        };
      })
    );

    return results;
  }

  /**
   * 10. GET /api/dashboard/trends
   */
  async getTrends(filters: TrendFilterQuery): Promise<TrendDataPoint[]> {
    const reportWhere = this.buildReportWhere(filters);
    const periodType = filters.period || 'monthly';

    // Fetch reports with their latest analysis within the date range
    const reports = await prisma.safetyReport.findMany({
      where: reportWhere,
      select: {
        eventDate: true,
        analyses: {
          where: { isLatest: true },
          select: { sifPotential: true },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    });

    const trendMap = new Map<string, { totalReports: number; sifPotentialReports: number }>();

    for (const report of reports) {
      const date = new Date(report.eventDate);
      let key = '';

      if (periodType === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (periodType === 'weekly') {
        const year = date.getUTCFullYear();
        const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
        key = `${year}-W${String(weekNum).padStart(2, '0')}`;
      } else {
        // default monthly: YYYY-MM
        key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
      }

      const existing = trendMap.get(key) || { totalReports: 0, sifPotentialReports: 0 };
      existing.totalReports += 1;

      const isSif = report.analyses && report.analyses.length > 0 && report.analyses[0].sifPotential;
      if (isSif) {
        existing.sifPotentialReports += 1;
      }

      trendMap.set(key, existing);
    }

    const trendData: TrendDataPoint[] = Array.from(trendMap.entries()).map(([period, data]) => ({
      period,
      totalReports: data.totalReports,
      sifPotentialReports: data.sifPotentialReports,
    }));

    return trendData;
  }
}

export const dashboardService = new DashboardService();
