import { ReportType, RiskLevel } from '@prisma/client';

export interface DashboardFilterQuery {
  site?: string;
  department?: string;
  activity?: string;
  reportType?: ReportType;
  from?: string;
  to?: string;
}

export interface LimitFilterQuery extends DashboardFilterQuery {
  limit?: number;
}

export interface TrendFilterQuery extends DashboardFilterQuery {
  period?: 'daily' | 'weekly' | 'monthly';
}

export interface DashboardSummaryResponse {
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

export interface SifDistributionResponse {
  sifPotential: number;
  notSifPotential: number;
  unanalyzed: number;
}

export interface RiskDistributionItem {
  riskLevel: RiskLevel;
  count: number;
}

export interface HazardFrequencyItem {
  hazard: string;
  count: number;
}

export interface IogpRuleFrequencyItem {
  rule: string;
  count: number;
}

export interface ReportTypeCountItem {
  reportType: ReportType;
  count: number;
}

export interface SiteAnalyticsItem {
  site: string;
  totalReports: number;
  analyzedReports: number;
  sifPotentialReports: number;
}

export interface DepartmentAnalyticsItem {
  department: string;
  totalReports: number;
  analyzedReports: number;
  sifPotentialReports: number;
}

export interface ActivityAnalyticsItem {
  activity: string;
  totalReports: number;
  analyzedReports: number;
  sifPotentialReports: number;
}

export interface TrendDataPoint {
  period: string;
  totalReports: number;
  sifPotentialReports: number;
}
