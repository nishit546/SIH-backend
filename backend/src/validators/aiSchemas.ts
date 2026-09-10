import { z } from 'zod';
import { RiskLevel } from '@prisma/client';

const riskLevelValues = Object.values(RiskLevel) as [string, ...string[]];

export const aiAnalysisResultSchema = z.object({
  sifPotential: z.boolean(),
  confidence: z
    .number()
    .min(0, 'confidence cannot be less than 0.0')
    .max(1, 'confidence cannot exceed 1.0'),
  riskLevel: z.enum(riskLevelValues as [string, ...string[]]),
  hazards: z.array(z.string().trim().min(1)).default([]),
  exposures: z.array(z.string().trim().min(1)).default([]),
  criticalControls: z.array(z.string().trim().min(1)).default([]),
  controlFailures: z.array(z.string().trim().min(1)).default([]),
  barrierStatus: z.string().trim().optional().nullable(),
  potentialConsequences: z.array(z.string().trim().min(1)).default([]),
  iogpRules: z.array(z.string().trim().min(1)).default([]),
  explanation: z
    .string()
    .trim()
    .min(5, 'explanation must be at least 5 characters long')
    .max(5000, 'explanation cannot exceed 5,000 characters'),
  modelVersion: z.string().trim().optional().default('mock-ai-v1.0.0'),
  ontologyVersion: z.string().trim().optional().default('v1.0.0'),
  rawResponse: z.record(z.string(), z.unknown()).optional().nullable(),
});
