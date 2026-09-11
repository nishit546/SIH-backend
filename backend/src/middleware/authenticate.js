const { verifyAccessToken } = require('../utils/jwt');

/**
 * Reusable Express middleware to authenticate JWT Bearer access tokens.
 * Extracts userId and role, and attaches them to req.user.
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
}

/**
 * Optional authentication: if Bearer token present and valid, attaches req.user.
 * If not present or invalid, proceeds without error (req.user remains undefined).
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      try {
        const payload = verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          role: payload.role,
        };
      } catch {
        // Token invalid, proceed as guest
      }
    }
  }
  next();
}

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * @param {...string} allowedRoles Roles permitted to access the route
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const userRole = req.user.role;

    // Expand allowed roles with aliases
    const expandedAllowed = new Set();
    allowedRoles.forEach((role) => {
      expandedAllowed.add(role);
      if (role === 'HSE_ANALYST') {
        expandedAllowed.add('ANALYST');
        expandedAllowed.add('MANAGER');
      }
      if (role === 'REPORTER') {
        expandedAllowed.add('REVIEWER');
      }
    });

    // ADMIN has universal permission
    if (userRole === 'ADMIN' || expandedAllowed.has(userRole)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
      error: `Role "${userRole}" is not authorized for this resource. Required: ${allowedRoles.join(', ')}`,
    });
  };
}

const requireAdmin = requireRole('ADMIN');
const requireAnalystOrAdmin = requireRole('ADMIN', 'HSE_ANALYST', 'ANALYST', 'MANAGER');
const requireReporterOrAbove = requireRole('ADMIN', 'HSE_ANALYST', 'ANALYST', 'MANAGER', 'REPORTER', 'REVIEWER');

module.exports = {
  authenticateJWT,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireAnalystOrAdmin,
  requireReporterOrAbove,
};
