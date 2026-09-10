const bcryptjs = require('bcryptjs');
const prisma = require('../config/database');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/jwt');
const { ConflictError, NotFoundError, AppError } = require('../utils/errors');

class AuthService {
  /**
   * Helper to persist a new refresh token and return tokens payload
   */
  async createSession(user) {
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    // Compute cryptographic SHA-256 hash for secure storage
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const safeUser = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      site: user.site,
    };

    return {
      accessToken,
      refreshToken,
      token: accessToken, // Backward compatibility
      user: safeUser,
    };
  }

  /**
   * Register a new user with hashed password and generate session tokens
   */
  async register(data) {
    if (data.role === 'ADMIN') {
      throw new AppError('Self-registration as ADMIN is prohibited', 403, 'FORBIDDEN_ROLE');
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(data.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        fullName: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        department: data.department || null,
        site: data.site || null,
      },
    });

    const session = await this.createSession(user);

    return {
      message: 'Registration successful',
      ...session,
    };
  }

  /**
   * Authenticate user credentials and return signed access & refresh tokens
   */
  async login(data) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcryptjs.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const session = await this.createSession(user);

    return {
      message: 'Login successful',
      ...session,
    };
  }

  /**
   * Validate incoming refresh token, perform token rotation, and return new tokens
   */
  async refresh(rawRefreshToken) {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      throw new AppError('Refresh token is required', 401, 'MISSING_REFRESH_TOKEN');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const tokenHash = hashToken(rawRefreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError('Invalid or unrecognized refresh token', 401, 'UNRECOGNIZED_REFRESH_TOKEN');
    }

    // Reuse Detection: If a revoked token is presented, compromise is suspected.
    // Invalidate ALL active refresh tokens for this user to protect their account.
    if (storedToken.revokedAt !== null) {
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new AppError(
        'Revoked refresh token reuse detected. All active sessions have been terminated for security.',
        401,
        'REVOKED_TOKEN_REUSE'
      );
    }

    // Check expiration
    if (new Date() > storedToken.expiresAt) {
      throw new AppError('Refresh token has expired', 401, 'EXPIRED_REFRESH_TOKEN');
    }

    if (!storedToken.user) {
      throw new AppError('User account associated with this token no longer exists', 401, 'USER_NOT_FOUND');
    }

    // TOKEN ROTATION: Revoke current token immediately
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new session (access token + new rotated refresh token)
    const session = await this.createSession(storedToken.user);

    return {
      message: 'Token rotated and refreshed successfully',
      ...session,
    };
  }

  /**
   * Revoke refresh token on logout (or all tokens if user ID provided)
   */
  async logout(rawRefreshToken, userId = null) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else if (userId) {
      await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Retrieve current authenticated user profile from database
   */
  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        site: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        site: user.site,
      },
    };
  }
}

const authService = new AuthService();

module.exports = {
  AuthService,
  authService,
};
