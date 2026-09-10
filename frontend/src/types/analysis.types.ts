import type { RiskLevel, ReportType, ProcessingStatus } from './safety.types';

export interface DetailedSafetyReport {
  id: string;
  reportNumber: string;
  description: string;
  reportType: ReportType;
  site: string;
  department?: string | null;
  activity: string;
  contractorType?: string | null;
  workPhase?: string | null;
  eventDate: string;
  status: ProcessingStatus;
}

export interface DetailedAIAnalysis {
  sifPotential: boolean;
  probability: number;
  riskLevel: RiskLevel;
  hazards: string[];
  exposures: string[];
  criticalControls: string[];
  controlFailures: string[];
  barrierStatus: string | null;
  potentialConsequences: string[];
  iogpRules: string[];
  explanation: string;
  modelVersion?: string;
  ontologyVersion?: string;
  evaluatedAt?: string;
}

export interface AnalysisPageData {
  report: DetailedSafetyReport;
  analysis: DetailedAIAnalysis;
}
