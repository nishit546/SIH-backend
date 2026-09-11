const { z } = require('zod');
const { ReportType } = require('@prisma/client');

const DISALLOWED_AI_FIELDS = [
  'sifPotential',
  'probability',
  'confidence',
  'hazard',
  'hazards',
  'exposure',
  'exposures',
  'barrier',
  'barrierStatus',
  'controlFailure',
  'controlFailures',
  'criticalControls',
  'potentialConsequence',
  'potentialConsequences',
  'iogpRule',
  'iogpRules',
  'riskLevel',
  'explanation',
  'modelVersion',
  'ontologyVersion',
];

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const reportTypeValues = Object.values(ReportType);

const createReportBodySchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(5, 'Report description must be at least 5 characters long')
      .max(10000, 'Report description cannot exceed 10,000 characters')
      .optional(),
    reportText: z
      .string()
      .trim()
      .min(5, 'Report text must be at least 5 characters long')
      .max(10000, 'Report text cannot exceed 10,000 characters')
      .optional(),
    reportType: z.enum(reportTypeValues),
    site: z
      .string()
      .trim()
      .min(2, 'Site must be at least 2 characters long')
      .max(150, 'Site cannot exceed 150 characters'),
    department: z.string().trim().max(150, 'Department cannot exceed 150 characters').optional().nullable(),
    activity: z
      .string()
      .trim()
      .min(2, 'Activity must be at least 2 characters long')
      .max(150, 'Activity cannot exceed 150 characters'),
    contractorType: z.string().trim().max(100, 'Contractor type cannot exceed 100 characters').optional().nullable(),
    workPhase: z.string().trim().max(100, 'Work phase cannot exceed 100 characters').optional().nullable(),
    eventDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid eventDate format. Must be a valid date string')
      .optional()
      .nullable(),
    reporterId: z
      .string()
      .regex(uuidRegex, 'reporterId must be a valid UUID')
      .optional()
      .nullable(),
    sourceMetadata: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    // 1. Ensure description or reportText is present and non-empty
    const text = data.description || data.reportText;
    if (!text || text.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['description'],
        message: 'Report text description is required (provide either "description" or "reportText")',
      });
    }

    // 2. Strictly reject AI-derived fields
    const foundAiFields = DISALLOWED_AI_FIELDS.filter((f) => f in data);
    if (foundAiFields.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [foundAiFields[0]],
        message: `AI-derived fields cannot be submitted during report creation: ${foundAiFields.join(
          ', '
        )}. These are generated automatically by the safety analysis engine.`,
      });
    }
  })
  .transform((data) => ({
    ...data,
    description: (data.description || data.reportText).trim(),
  }));

const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
    .pipe(
      z
        .number()
        .int('Page must be an integer')
        .min(1, 'Page must be greater than or equal to 1')
    ),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 20))
    .pipe(
      z
        .number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
    ),
});

const reportIdParamSchema = z.object({
  id: z
    .string()
    .regex(uuidRegex, 'Invalid report ID format. Must be a valid UUID'),
});

module.exports = {
  createReportBodySchema,
  paginationQuerySchema,
  reportIdParamSchema,
};
