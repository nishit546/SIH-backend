import { RiskLevel } from '@prisma/client';

/**
 * Expected JSON response format returned by the Python FastAPI AI service:
 * POST http://127.0.0.1:8000/api/analyze
 */
export interface AIAnalysisResult {
  sif_probability: number;
  sif_potential: boolean;
  confidence: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  iogp_rules: string[];
  hazards: string[];
  exposure: string[];
  control_failures: string[];
  potential_consequence: string;
  explanation: string;
}

/**
 * Request payload sent to the FastAPI AI service
 */
export interface AIAnalysisRequest {
  text: string;
}

/**
 * Canonical normalized AI analysis result for Prisma database persistence
 */
export interface NormalizedAIAnalysisResult {
  sifPotential: boolean;
  probability: number;
  confidence: number;
  riskLevel: RiskLevel;
  hazards: string[];
  exposures: string[];
  criticalControls: string[];
  controlFailures: string[];
  barrierStatus: string | null;
  potentialConsequences: string[];
  iogpRules: string[];
  explanation: string;
  modelVersion: string;
  ontologyVersion: string;
  rawResponse: Record<string, unknown>;
}

/**
 * Batch request / response contracts for future bulk processing
 */
export interface AIBatchAnalysisRequest {
  reports: Array<{
    id: string;
    text: string;
  }>;
}

export interface AIBatchAnalysisResponse {
  results: Array<{
    id: string;
    analysis: AIAnalysisResult;
  }>;
}
