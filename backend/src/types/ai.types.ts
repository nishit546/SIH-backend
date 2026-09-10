import { RiskLevel } from '@prisma/client';

export interface AIAnalysisInput {
  reportId: string;
  reportNumber?: string | null;
  reportText: string;
  reportType: string;
  site: string;
  department?: string | null;
  activity: string;
  contractorType?: string | null;
  workPhase?: string | null;
  eventDate?: string | Date;
}

export interface AIAnalysisResult {
  sifPotential: boolean;
  confidence: number; // 0.0 to 1.0 (stored as probability in DB)
  riskLevel: RiskLevel;
  hazards: string[];
  exposures: string[];
  criticalControls: string[];
  controlFailures: string[];
  barrierStatus?: string | null;
  potentialConsequences: string[];
  iogpRules: string[];
  explanation: string;
  modelVersion?: string;
  ontologyVersion?: string;
  rawResponse?: Record<string, unknown>;
}
