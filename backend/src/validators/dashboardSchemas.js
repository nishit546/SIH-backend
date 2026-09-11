const { z } = require('zod');
const { ReportType } = require('@prisma/client');

const reportTypeValues = Object.values(ReportType);

const dashboardFilterSchema = z.object({
  site: z.string().trim().min(1).optional(),
  department: z.string().trim().min(1).optional(),
  activity: z.string().trim().min(1).optional(),
  reportType: z.enum(reportTypeValues).optional(),
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid "from" date format. Must be a valid date string')
    .optional(),
  to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid "to" date format. Must be a valid date string')
    .optional(),
});

const limitFilterSchema = dashboardFilterSchema.extend({
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
    ),
});

const trendFilterSchema = dashboardFilterSchema.extend({
  period: z.enum(['daily', 'weekly', 'monthly']).optional().default('monthly'),
});

module.exports = {
  dashboardFilterSchema,
  limitFilterSchema,
  trendFilterSchema,
};
