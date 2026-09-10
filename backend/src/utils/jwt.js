const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtConfig } = require('../config/jwtConfig');

/**
 * Generate a short-lived JWT access token (~15 minutes).
 * Payload contains only userId and role.
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
}

/**
 * Backward compatibility alias for generateAccessToken
 */
function generateToken(payload) {
  return generateAccessToken(payload);
}

/**
 * Generate a long-lived JWT refresh token (~7 days).
 * Payload contains userId, role, and a unique jti (JWT ID).
 */
function generateRefreshToken(payload) {
  const jti = crypto.randomUUID();
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      jti,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    }
  );
}

/**
 * Verify and decode an incoming access token.
 * Throws JsonWebTokenError or TokenExpiredError if invalid or expired.
 */
function verifyAccessToken(token) {
  const decoded = jwt.verify(token, jwtConfig.secret);
  return {
    userId: decoded.userId,
    role: decoded.role,
  };
}

/**
 * Backward compatibility alias for verifyAccessToken
 */
function verifyToken(token) {
  return verifyAccessToken(token);
}

/**
 * Verify and decode an incoming refresh token.
 * Throws JsonWebTokenError or TokenExpiredError if invalid or expired.
 */
function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  return {
    userId: decoded.userId,
    role: decoded.role,
    jti: decoded.jti,
    exp: decoded.exp,
  };
}

/**
 * Compute a secure cryptographic SHA-256 hash of a token for safe persistence.
 * Never store plain-text tokens in the database.
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  generateAccessToken,
  generateToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyToken,
  verifyRefreshToken,
  hashToken,
};
