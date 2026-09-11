const { RiskLevel } = require('@prisma/client');
const { normalizeIogpRules } = require('../../utils/iogpRules');

/**
 * AI Response Adapter
 *
 * Normalizes raw output from the Python FastAPI AI/NLP microservice into:
 * 1. Standardized Backend AI Analysis Contract
 * 2. Prisma SafetyAnalysis schema-compliant persistence payload
 */
class AIResponseAdapter {
  /**
   * Normalizes raw Python AI output into the standardized target AI Contract:
   * {
   *   sif_probability: number,
   *   sif_potential: boolean,
   *   confidence: number,
   *   risk_level: string,
   *   iogp_rules: string[],
   *   hazards: string[],
   *   exposure: string[],
   *   control_failures: string[],
   *   potential_consequence: string,
   *   explanation: string
   * }
   */
  adaptToContract(rawOutput) {
    if (!rawOutput || typeof rawOutput !== 'object') {
      throw new Error('Invalid AI response: output must be a non-null object');
    }

    // 1. sif_probability (0.0 to 1.0)
    const sifProbability = typeof rawOutput.sif_probability === 'number'
      ? Math.max(0, Math.min(1, rawOutput.sif_probability))
      : 0.0;

    // 2. sif_potential (boolean): use explicit flag or derive from threshold >= 0.50
    const sifPotential = typeof rawOutput.sif_potential === 'boolean'
      ? rawOutput.sif_potential
      : sifProbability >= 0.50;

    // 3. confidence (0.0 to 1.0): use model confidence if provided, otherwise derive from prediction margin
    const confidence = typeof rawOutput.confidence === 'number'
      ? Math.max(0, Math.min(1, rawOutput.confidence))
      : Math.round(Math.min(0.70 + Math.abs(sifProbability - 0.50) * 0.55, 0.98) * 100) / 100;

    // 4. risk_level: map accurately to backend enum preserving model prediction (do NOT invent CRITICAL)
    const rawRisk = (rawOutput.risk_level || 'HIGH').toString().toUpperCase().trim();
    let riskLevel;
    if (rawRisk in RiskLevel) {
      riskLevel = RiskLevel[rawRisk];
    } else if (rawRisk.includes('HIGH')) {
      riskLevel = RiskLevel.HIGH;
    } else if (rawRisk.includes('MED')) {
      riskLevel = RiskLevel.MEDIUM;
    } else {
      riskLevel = RiskLevel.LOW;
    }

    // 5. iogp_rules: canonical 9 IOGP rules normalization (deduplication, whitespace, spelling)
    const rawIogp = Array.isArray(rawOutput.iogp_rules) ? rawOutput.iogp_rules : [];
    const normalizedIogp = normalizeIogpRules(rawIogp);

    // 6. hazards: sanitize array of string hazards
    const hazards = Array.isArray(rawOutput.hazards)
      ? rawOutput.hazards.map((h) => String(h).trim()).filter(Boolean)
      : [];

    // 7. exposure: sanitize array of exposed personnel / equipment
    const exposure = Array.isArray(rawOutput.exposure)
      ? rawOutput.exposure.map((e) => String(e).trim()).filter(Boolean)
      : [];

    // 8. control_failures: sanitize array of failed barrier observations
    const controlFailures = Array.isArray(rawOutput.control_failures)
      ? rawOutput.control_failures.map((cf) => String(cf).trim()).filter(Boolean)
      : [];

    // 9. potential_consequence: string summary of outcome
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

    // 10. explanation: rationale string
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

  /**
   * Adapts the standardized contract to the Prisma database model format
   */
  adaptToPrisma(adaptedContract, options = {}) {
    const { modelVersion = 'v1.0.0', ontologyVersion = 'v1.0.0', rawResponse = null } = options;

    return {
      sifPotential: adaptedContract.sif_potential,
      probability: adaptedContract.sif_probability,
      confidence: adaptedContract.confidence,
      riskLevel: adaptedContract.risk_level,
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
      rawResponse: rawResponse || adaptedContract,
    };
  }
}

const aiResponseAdapter = new AIResponseAdapter();

module.exports = {
  AIResponseAdapter,
  aiResponseAdapter,
};
