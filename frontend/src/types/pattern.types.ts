import type { RiskLevel } from './safety.types';

export type PatternTrend = 'INCREASING' | 'STABLE' | 'DECREASING';

export interface PatternSummary {
  activePatterns: number;
  highPriorityPatterns: number;
  sifRelatedPatterns: number;
  increasingPatterns: number;
}

export interface PatternLinkedReport {
  id: string;
  reportNumber: string;
  eventDate: string;
  site: string;
  activity: string;
  headline: string;
  sifPotential: boolean;
  riskLevel: RiskLevel;
}

export interface SafetyPatternItem {
  id: string;
  title: string;
  shortExplanation: string;
  description: string;
  hazardCategory: string;
  iogpRules: string[];
  riskLevel: RiskLevel;
  trend: PatternTrend;
  reportCount: number;
  sifCount: number;
  affectedSites: string[];
  affectedActivities: string[];
  commonHazards: string[];
  commonControlFailures: string[];
  recommendedActions: string[];
  firstDetectedAt: string;
  lastDetectedAt: string;
  frequencySummary: string;
  linkedReports: PatternLinkedReport[];
}
