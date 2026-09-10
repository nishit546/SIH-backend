const { z } = require('zod');
const { RiskLevel } = require('@prisma/client');

const riskLevelValues = Object.values(RiskLevel);

/**
 * Zod Schema for the payload sent to the Real FastAPI AI service: POST /api/analyze
 */
const realAiRequestSchema = z.object({
  text: z.string().trim().min(1, 'Report observation text cannot be empty'),
});

/**
 * Zod Schema for validating the RAW response returned by the Real FastAPI AI service
 */
const realAiResponseSchema = z.object({
  sif_probability: z
    .number()
    .min(0, 'sif_probability cannot be less than 0.0')
    .max(1, 'sif_probability cannot exceed 1.0'),
  sif_potential: z.boolean().optional(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0')
    .optional(),
  risk_level: z.enum(['HIGH', 'MEDIUM', 'LOW', 'CRITICAL']),
  iogp_rules: z.array(z.string().trim()).default([]),
  hazards: z.array(z.string().trim()).default([]),
  exposure: z.array(z.string().trim()).default([]),
  control_failures: z.array(z.string().trim()).default([]),
  potential_consequence: z.string().trim().optional(),
  explanation: z.string().trim().min(1, 'explanation cannot be empty'),
});

/**
 * Normalized AI Analysis Result Schema validated before persisting to PostgreSQL / MySQL
 */
const aiAnalysisResultSchema = z.object({
  sifPotential: z.boolean(),
  probability: z.number().min(0).max(1).optional(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0'),
  riskLevel: z.enum(riskLevelValues),
  hazards: z.array(z.string().trim()).default([]),
  exposures: z.array(z.string().trim()).default([]),
  criticalControls: z.array(z.string().trim()).default([]),
  controlFailures: z.array(z.string().trim()).default([]),
  barrierStatus: z.string().trim().optional().nullable(),
  potentialConsequences: z.array(z.string().trim()).default([]),
  iogpRules: z.array(z.string().trim()).default([]),
  explanation: z
    .string()
    .trim()
    .min(1, 'explanation cannot be empty')
    .max(5000, 'explanation cannot exceed 5,000 characters'),
  modelVersion: z.string().trim().optional().default('v1.0.0'),
  ontologyVersion: z.string().trim().optional().default('v1.0.0'),
  rawResponse: z.record(z.string(), z.unknown()).optional().nullable(),
});

/**
 * Target Normalized AI Contract Schema (as defined in Phase 4 / Step 5)
 */
const normalizedAiContractSchema = z.object({
  sif_probability: z
    .number()
    .min(0, 'sif_probability cannot be less than 0.0')
    .max(1, 'sif_probability cannot exceed 1.0'),
  sif_potential: z.boolean(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0'),
  risk_level: z.enum(['HIGH', 'MEDIUM', 'LOW', 'CRITICAL']),
  iogp_rules: z.array(z.string().trim()).default([]),
  hazards: z.array(z.string().trim()).default([]),
  exposure: z.array(z.string().trim()).default([]),
  control_failures: z.array(z.string().trim()).default([]),
  potential_consequence: z.string().trim(),
  explanation: z.string().trim().min(1, 'explanation cannot be empty'),
});

module.exports = {
  realAiRequestSchema,
  realAiResponseSchema,
  normalizedAiContractSchema,
  aiAnalysisResultSchema,
};
