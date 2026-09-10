export type ReportType = 'UNSAFE_ACT' | 'UNSAFE_CONDITION' | 'NEAR_MISS' | 'INCIDENT' | 'OBSERVATION';

export type ProcessingStatus = 'PENDING' | 'ANALYZING' | 'ANALYZED' | 'FAILED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface SafetyReportForm {
  reportType: ReportType;
  description: string;
  site: string;
  department: string;
  activity: string;
  contractorType: string;
  workPhase: string;
  eventDate?: string;
}

export interface SafetyReportSubmissionResult {
  id: string;
  reportNumber: string;
  status: ProcessingStatus;
  createdAt: string;
  report: SafetyReport;
}

export interface SafetyReport {
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
  createdAt: string;
  updatedAt: string;
  latestAnalysis?: SafetyAnalysis | null;
}

export interface SafetyAnalysis {
  id: string;
  reportId: string;
  sifPotential: boolean;
  probability: number;
  riskLevel: RiskLevel;
  hazards: string[];
  exposures: string[];
  criticalControls: string[];
  controlFailures: string[];
  barrierStatus?: string | null;
  potentialConsequences: string[];
  iogpRules: string[];
  explanation: string;
  modelVersion: string;
  isLatest: boolean;
  createdAt: string;
}

export interface SafetyPattern {
  id: string;
  title: string;
  description?: string;
  hazardCategory?: string;
  iogpRule?: string;
  site?: string;
  activity?: string;
  riskLevel: RiskLevel;
  reportCount: number;
  patternType: string;
  firstDetectedAt: string;
  lastDetectedAt: string;
  status: string;
}
