import type { ReportType, RiskLevel, ProcessingStatus } from './safety.types';
import type { PatternTrend } from './pattern.types';

export interface DashboardFilterState {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom';
  site: string;
  department: string;
  activity: string;
  from?: string;
  to?: string;
}

export interface DashboardSummary {
  totalReports: number;
  sifPotentialReports: number;
  sifPotentialRate: number; // percentage
  highRiskReports: number;
  highRiskRate: number;
  pendingAnalysis: number;
  activePatternsCount: number;
  openCorrectiveActions: number;
  completedCorrectiveActions: number;
  changeFromLastPeriod: {
    totalReports: number;
    sifPotential: number;
    highRisk: number;
    pending: number;
    patterns: number;
  };
}

export interface SifDistribution {
  sifPotential: number;
  notSifPotential: number;
  unanalyzed: number;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
  percentage: number;
  color: string;
}

export interface HazardStat {
  hazard: string;
  count: number;
  sifCount: number;
  percentage: number;
}

export interface IogpRuleStat {
  rule: string;
  code?: string;
  count: number;
  sifCount: number;
  percentage: number;
}

export interface SiteDistributionItem {
  site: string;
  totalReports: number;
  sifReports: number;
  highRiskReports: number;
  percentage: number;
}

export interface SafetyTrendPoint {
  period: string;
  date: string;
  totalReports: number;
  sifPotentialReports: number;
  highRiskReports: number;
}

export interface SafetyInsight {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'TREND' | 'INFO';
  title: string;
  message: string;
  metric?: string;
  affectedSite?: string;
  suggestedAction?: string;
  detectedAt: string;
}

export interface EmergingPatternPreview {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  trend: PatternTrend;
  reportCount: number;
  sifCount: number;
  affectedSites: string[];
  shortExplanation: string;
}

export interface RecentReport {
  id: string;
  reportNumber: string;
  eventDate: string;
  site: string;
  activity: string;
  reportType: ReportType;
  riskLevel?: RiskLevel;
  sifPotential?: boolean;
  status: ProcessingStatus;
  headline?: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  sifDistribution: SifDistribution;
  riskDistribution: RiskDistributionItem[];
  hazards: HazardStat[];
  iogpRules: IogpRuleStat[];
  siteDistribution: SiteDistributionItem[];
  trends: SafetyTrendPoint[];
  insights: SafetyInsight[];
  emergingPatterns: EmergingPatternPreview[];
  highPriorityReports: RecentReport[];
  recentReports: RecentReport[];
}
