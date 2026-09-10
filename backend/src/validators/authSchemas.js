const { z } = require('zod');
const { UserRole } = require('@prisma/client');

const registrableRoles = [UserRole.REVIEWER, UserRole.ANALYST, UserRole.MANAGER];

const registerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters'),
  role: z
    .enum(registrableRoles, {
      errorMap: () => ({
        message: 'Cannot self-register as ADMIN. Allowed roles: REVIEWER, ANALYST, MANAGER',
      }),
    })
    .optional()
    .default(UserRole.REVIEWER),
  department: z.string().trim().optional(),
  site: z.string().trim().optional(),
});

const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

const refreshTokenBodySchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token is required' })
    .trim()
    .min(1, 'Refresh token cannot be empty'),
});

const logoutBodySchema = z.object({
  refreshToken: z.string().trim().optional(),
});

module.exports = {
  registerBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  logoutBodySchema,
};
