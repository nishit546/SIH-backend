import { z } from 'zod';
import { RiskLevel } from '@prisma/client';

const riskLevelValues = Object.values(RiskLevel) as [string, ...string[]];

/**
 * Zod Schema for the payload sent to the Real FastAPI AI service: POST /api/analyze
 */
export const realAiRequestSchema = z.object({
  text: z.string().trim().min(1, 'Report observation text cannot be empty'),
});

export type RealAIRequest = z.infer<typeof realAiRequestSchema>;

/**
 * Zod Schema for validating the RAW response returned by the Real FastAPI AI service
 */
export const realAiResponseSchema = z.object({
  sif_probability: z
    .number()
    .min(0, 'sif_probability cannot be less than 0.0')
    .max(1, 'sif_probability cannot exceed 1.0'),
  sif_potential: z.boolean(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0'),
  risk_level: z.enum(['HIGH', 'MEDIUM', 'LOW', 'CRITICAL'] as const),
  iogp_rules: z.array(z.string().trim()).default([]),
  hazards: z.array(z.string().trim()).default([]),
  exposure: z.array(z.string().trim()).default([]),
  control_failures: z.array(z.string().trim()).default([]),
  potential_consequence: z.string().trim().min(1, 'potential_consequence cannot be empty'),
  explanation: z.string().trim().min(1, 'explanation cannot be empty'),
});

export type RealAIResponse = z.infer<typeof realAiResponseSchema>;

/**
 * Normalized AI Analysis Result Schema validated before persisting to PostgreSQL
 */
export const aiAnalysisResultSchema = z.object({
  sifPotential: z.boolean(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0'),
  riskLevel: z.enum(riskLevelValues as [string, ...string[]]),
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

export type ValidatedAIAnalysisResult = z.infer<typeof aiAnalysisResultSchema>;
