import type { ReportType, RiskLevel, ProcessingStatus } from './safety.types';

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
  openCorrectiveActions: number;
  completedCorrectiveActions: number;
  changeFromLastPeriod: {
    totalReports: number;
    sifPotential: number;
    highRisk: number;
    pending: number;
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
  trends: SafetyTrendPoint[];
  insights: SafetyInsight[];
  recentReports: RecentReport[];
}
