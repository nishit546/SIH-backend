import { RiskLevel } from '@prisma/client';
import { AIAnalysisResult, NormalizedAIAnalysisResult } from './types';
import { normalizeIogpRules } from '../../utils/iogpRules';

export class AIResponseAdapter {
  adaptToContract(rawOutput: any): AIAnalysisResult {
    if (!rawOutput || typeof rawOutput !== 'object') {
      throw new Error('Invalid AI response: output must be a non-null object');
    }

    const sifProbability = typeof rawOutput.sif_probability === 'number'
      ? Math.max(0, Math.min(1, rawOutput.sif_probability))
      : 0.0;

    const sifPotential = typeof rawOutput.sif_potential === 'boolean'
      ? rawOutput.sif_potential
      : sifProbability >= 0.50;

    const confidence = typeof rawOutput.confidence === 'number'
      ? Math.max(0, Math.min(1, rawOutput.confidence))
      : Math.round(Math.min(0.70 + Math.abs(sifProbability - 0.50) * 0.55, 0.98) * 100) / 100;

    const rawRisk = (rawOutput.risk_level || 'HIGH').toString().toUpperCase().trim();
    let riskLevel: RiskLevel;
    if (rawRisk in RiskLevel) {
      riskLevel = rawRisk as RiskLevel;
    } else if (rawRisk.includes('HIGH')) {
      riskLevel = RiskLevel.HIGH;
    } else if (rawRisk.includes('MED')) {
      riskLevel = RiskLevel.MEDIUM;
    } else {
      riskLevel = RiskLevel.LOW;
    }

    const rawIogp = Array.isArray(rawOutput.iogp_rules) ? rawOutput.iogp_rules : [];
    const normalizedIogp = normalizeIogpRules(rawIogp);

    const hazards = Array.isArray(rawOutput.hazards)
      ? rawOutput.hazards.map((h: any) => String(h).trim()).filter(Boolean)
      : [];

    const exposure = Array.isArray(rawOutput.exposure)
      ? rawOutput.exposure.map((e: any) => String(e).trim()).filter(Boolean)
      : [];

    const controlFailures = Array.isArray(rawOutput.control_failures)
      ? rawOutput.control_failures.map((cf: any) => String(cf).trim()).filter(Boolean)
      : [];

    let potentialConsequence = '';
    if (typeof rawOutput.potential_consequence === 'string' && rawOutput.potential_consequence.trim()) {
      potentialConsequence = rawOutput.potential_consequence.trim();
    } else if (sifPotential) {
      potentialConsequence = hazards.length > 0
        ? `Severe personal injury or catastrophic release involving ${hazards.join(', ')}`
        : 'Severe personal injury or fatality potential';
    } else {
      potentialConsequence = 'Minor operational irregularity without significant precursor exposure';
    }

    const explanation = typeof rawOutput.explanation === 'string' && rawOutput.explanation.trim()
      ? rawOutput.explanation.trim()
      : `Classified as ${riskLevel} risk (SIF Probability: ${sifProbability.toFixed(2)}) based on safety precursor evaluation.`;

    return {
      sif_probability: sifProbability,
      sif_potential: sifPotential,
      confidence,
      risk_level: riskLevel,
      iogp_rules: normalizedIogp,
      hazards,
      exposure,
      control_failures: controlFailures,
      potential_consequence: potentialConsequence,
      explanation,
    };
  }

  adaptToPrisma(
    adaptedContract: AIAnalysisResult,
    options: { modelVersion?: string; ontologyVersion?: string; rawResponse?: any } = {}
  ): NormalizedAIAnalysisResult {
    const { modelVersion = 'v1.0.0', ontologyVersion = 'v1.0.0', rawResponse = null } = options;

    return {
      sifPotential: adaptedContract.sif_potential,
      probability: adaptedContract.sif_probability,
      confidence: adaptedContract.confidence,
      riskLevel: adaptedContract.risk_level as RiskLevel,
      hazards: adaptedContract.hazards,
      exposures: adaptedContract.exposure,
      criticalControls: [],
      controlFailures: adaptedContract.control_failures,
      barrierStatus: adaptedContract.control_failures.length > 0 ? 'Failed / Compromised' : 'Intact',
      potentialConsequences: adaptedContract.potential_consequence ? [adaptedContract.potential_consequence] : [],
      iogpRules: adaptedContract.iogp_rules,
      explanation: adaptedContract.explanation,
      modelVersion,
      ontologyVersion,
      rawResponse: rawResponse || (adaptedContract as unknown as Record<string, unknown>),
    };
  }
}

export const aiResponseAdapter = new AIResponseAdapter();
