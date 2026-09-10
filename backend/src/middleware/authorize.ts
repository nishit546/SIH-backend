import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Reusable role-based access control (RBAC) middleware.
 * Verifies that req.user is populated by authenticateJWT and that
 * the user's role is included in allowedRoles.
 */
export function requireRole(...allowedRoles: (UserRole | string)[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}
