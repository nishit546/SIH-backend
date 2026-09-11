const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const app = require('./src/app');
const prisma = require('./src/config/database');
const {
  generateAccessToken,
  generateToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyToken,
  verifyRefreshToken,
  hashToken,
} = require('./src/utils/jwt');
const { jwtConfig } = require('./src/config/jwtConfig');
const { UserRole } = require('@prisma/client');
const {
  registerBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  logoutBodySchema,
} = require('./src/validators/authSchemas');
const { authService } = require('./src/services/authService');

let passed = 0;
let failed = 0;

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}${detail ? ' - ' + detail : ''}`);
    failed++;
  }
}

async function runAuthTests() {
  console.log('====================================================');
  console.log('STARTING PRODUCTION AUTH & SESSION VERIFICATION SUITE');
  console.log('====================================================\n');

  // -------------------------------------------------------------------------
  // 1. Password Hashing Security
  // -------------------------------------------------------------------------
  console.log('--- 1. Password Hashing (bcryptjs) ---');
  const plainPassword = 'Password123!';
  const hash = await bcryptjs.hash(plainPassword, 10);
  assert(hash !== plainPassword, 'Password is never stored in plaintext');
  assert(hash.startsWith('$2'), 'Bcrypt hash signature generated');
  const validMatch = await bcryptjs.compare(plainPassword, hash);
  assert(validMatch, 'Bcrypt correctly matches valid password');
  const invalidMatch = await bcryptjs.compare('WrongPassword', hash);
  assert(!invalidMatch, 'Bcrypt rejects incorrect password');

  // -------------------------------------------------------------------------
  // 2. Access Token Utility (~15 min expiry)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Access Token Utility (generateAccessToken / verifyAccessToken) ---');
  const accessToken = generateAccessToken({
    userId: '11111111-2222-3333-4444-555555555555',
    role: UserRole.REVIEWER,
  });
  assert(typeof accessToken === 'string' && accessToken.split('.').length === 3, 'Access token structure is valid (3 segments)');

  const decodedAccess = verifyAccessToken(accessToken);
  assert(decodedAccess.userId === '11111111-2222-3333-4444-555555555555', 'Access token decoded userId matches');
  assert(decodedAccess.role === UserRole.REVIEWER, 'Access token decoded role matches');

  // Backward compatibility alias generateToken
  const legacyToken = generateToken({
    userId: '11111111-2222-3333-4444-555555555555',
    role: UserRole.REVIEWER,
  });
  assert(verifyToken(legacyToken).userId === '11111111-2222-3333-4444-555555555555', 'verifyToken backward compatibility verified');

  // Expired access token verification
  const expiredAccessToken = jwt.sign(
    { userId: '11111111-2222-3333-4444-555555555555', role: UserRole.REVIEWER },
    jwtConfig.secret,
    { expiresIn: -10 }
  );
  try {
    verifyAccessToken(expiredAccessToken);
    assert(false, 'Should throw error on expired access token');
  } catch {
    assert(true, 'verifyAccessToken rejects expired access token');
  }

  // -------------------------------------------------------------------------
  // 3. Refresh Token Utility (~7 day expiry, distinct secret, hash persistence)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Refresh Token Utility (generateRefreshToken / verifyRefreshToken / hashToken) ---');
  const refreshToken = generateRefreshToken({
    userId: '11111111-2222-3333-4444-555555555555',
    role: UserRole.REVIEWER,
  });
  assert(typeof refreshToken === 'string' && refreshToken.split('.').length === 3, 'Refresh token structure is valid (3 segments)');

  const decodedRefresh = verifyRefreshToken(refreshToken);
  assert(decodedRefresh.userId === '11111111-2222-3333-4444-555555555555', 'Refresh token decoded userId matches');
  assert(decodedRefresh.role === UserRole.REVIEWER, 'Refresh token decoded role matches');
  assert(Boolean(decodedRefresh.jti), 'Refresh token contains unique jti (JWT ID)');

  // Refresh token cannot be verified with Access token secret
  try {
    jwt.verify(refreshToken, jwtConfig.secret);
    assert(false, 'Refresh token should not verify with access secret');
  } catch {
    assert(true, 'Refresh token uses dedicated separate secret');
  }

  // Cryptographic hash check for DB storage
  const hashedToken = hashToken(refreshToken);
  assert(hashedToken.length === 64, 'hashToken produces 64-character SHA-256 hex string');
  assert(hashedToken !== refreshToken, 'Raw refresh token is never stored directly');
  assert(hashToken(refreshToken) === hashedToken, 'hashToken is deterministic for database lookups');

  // Expired refresh token rejection
  const expiredRefreshToken = jwt.sign(
    { userId: '11111111-2222-3333-4444-555555555555', role: UserRole.REVIEWER, jti: 'test-jti' },
    jwtConfig.refreshSecret,
    { expiresIn: -10 }
  );
  try {
    verifyRefreshToken(expiredRefreshToken);
    assert(false, 'Should throw error on expired refresh token');
  } catch {
    assert(true, 'verifyRefreshToken rejects expired refresh token');
  }

  // -------------------------------------------------------------------------
  // 4. Validation Schemas (Auth, Refresh, Logout)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Zod Validation Schemas ---');
  const validRegister = registerBodySchema.safeParse({
    name: 'Safety Reviewer',
    email: 'reviewer@oil.com',
    password: 'Password123!',
    role: 'REVIEWER',
  });
  assert(validRegister.success, 'Valid registration payload passes validation');

  const invalidEmailRegister = registerBodySchema.safeParse({
    name: 'Safety Reviewer',
    email: 'not-an-email',
    password: 'Password123!',
    role: 'REVIEWER',
  });
  assert(!invalidEmailRegister.success, 'Invalid email fails registration validation');

  const shortPasswordRegister = registerBodySchema.safeParse({
    name: 'Safety Reviewer',
    email: 'reviewer@oil.com',
    password: '123',
    role: 'REVIEWER',
  });
  assert(!shortPasswordRegister.success, 'Password < 6 chars fails registration validation');

  const invalidRoleRegister = registerBodySchema.safeParse({
    name: 'Safety Reviewer',
    email: 'reviewer@oil.com',
    password: 'Password123!',
    role: 'SUPERUSER',
  });
  assert(!invalidRoleRegister.success, 'Disallowed role fails registration validation');

  const validLogin = loginBodySchema.safeParse({
    email: 'reviewer@oil.com',
    password: 'Password123!',
  });
  assert(validLogin.success, 'Valid login payload passes validation');

  const validRefreshBody = refreshTokenBodySchema.safeParse({
    refreshToken: 'some.valid.jwt',
  });
  assert(validRefreshBody.success, 'Valid refresh body passes validation');

  const emptyRefreshBody = refreshTokenBodySchema.safeParse({
    refreshToken: '   ',
  });
  assert(!emptyRefreshBody.success, 'Empty refresh token fails validation');

  const missingRefreshBody = refreshTokenBodySchema.safeParse({});
  assert(!missingRefreshBody.success, 'Missing refresh token fails validation');

  // -------------------------------------------------------------------------
  // 5. Route Protection Tests (HTTP 401 & 403 enforcement)
  // -------------------------------------------------------------------------
  console.log('\n--- 5. HTTP Route Protection & RBAC ---');

  // 5.1 Health endpoint should NOT require authentication
  const healthRes = await request(app).get('/health');
  assert(healthRes.status === 200 || healthRes.status === 503, 'GET /health is public');

  // 5.2 Protected route WITHOUT token -> 401 { message: "Authentication required" }
  const noTokenRes = await request(app).get('/api/reports');
  assert(noTokenRes.status === 401, 'GET /api/reports without token returns HTTP 401');
  assert(noTokenRes.body.message === 'Authentication required', 'Response body has "Authentication required"');

  // 5.3 Protected route with invalid token -> 401 { message: "Invalid or expired token" }
  const invalidTokenRes = await request(app)
    .get('/api/reports')
    .set('Authorization', 'Bearer invalid.token.payload');
  assert(invalidTokenRes.status === 401, 'GET /api/reports with invalid token returns HTTP 401');
  assert(invalidTokenRes.body.message === 'Invalid or expired token', 'Response body has "Invalid or expired token"');

  // 5.4 Protected route with expired access token -> 401 { message: "Invalid or expired token" }
  const expiredTokenRes = await request(app)
    .get('/api/reports')
    .set('Authorization', `Bearer ${expiredAccessToken}`);
  assert(expiredTokenRes.status === 401, 'GET /api/reports with expired access token returns HTTP 401');
  assert(expiredTokenRes.body.message === 'Invalid or expired token', 'Expired access token yields "Invalid or expired token"');

  // 5.5 RBAC: REVIEWER accessing DASHBOARD endpoint -> 403 { message: "Insufficient permissions" }
  const reviewerAccess = generateAccessToken({
    userId: '11111111-2222-3333-4444-555555555555',
    role: UserRole.REVIEWER,
  });
  const reviewerDashboardRes = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${reviewerAccess}`);
  assert(reviewerDashboardRes.status === 403, 'REVIEWER accessing /api/dashboard/summary is rejected with HTTP 403');
  assert(reviewerDashboardRes.body.message === 'Insufficient permissions', 'Response body has "Insufficient permissions"');

  // 5.6 RBAC: REVIEWER attempting to DELETE a report -> 403 { message: "Insufficient permissions" }
  const reviewerDeleteRes = await request(app)
    .delete('/api/reports/11111111-2222-3333-4444-555555555555')
    .set('Authorization', `Bearer ${reviewerAccess}`);
  assert(reviewerDeleteRes.status === 403, 'REVIEWER attempting DELETE /api/reports/:id is rejected with HTTP 403');

  // 5.7 RBAC Authorized Pass-Through: ANALYST accessing /api/dashboard/summary
  const analystToken = generateAccessToken({
    userId: '22222222-3333-4444-5555-666666666666',
    role: UserRole.ANALYST,
  });
  const analystDashboardRes = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${analystToken}`);
  assert(analystDashboardRes.status !== 401 && analystDashboardRes.status !== 403, 'ANALYST passes both auth and role check on /api/dashboard/summary');

  // 5.8 Refresh endpoint validation (Missing / Invalid / Expired)
  const refreshNoBody = await request(app).post('/api/auth/refresh').send({});
  assert(refreshNoBody.status === 400, 'POST /api/auth/refresh without token returns HTTP 400');

  const refreshInvalidToken = await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken: 'completely.invalid.token' });
  assert(refreshInvalidToken.status === 401, 'POST /api/auth/refresh with malformed token returns HTTP 401');

  const refreshExpiredToken = await request(app)
    .post('/api/auth/refresh')
    .send({ refreshToken: expiredRefreshToken });
  assert(refreshExpiredToken.status === 401, 'POST /api/auth/refresh with expired token returns HTTP 401');


  // -------------------------------------------------------------------------
  // 6. In-Memory Session Lifecycle & Comprehensive End-to-End Test Suite
  // -------------------------------------------------------------------------
  console.log('\n--- 6. End-to-End Authentication & Session Lifecycle (16 Required Scenarios) ---');

  // In-memory repositories for deterministic testing
  const inMemoryTokens = new Map();
  const inMemoryUsers = new Map();

  const originalCreate = prisma.refreshToken.create;
  const originalFindUnique = prisma.refreshToken.findUnique;
  const originalUpdate = prisma.refreshToken.update;
  const originalUpdateMany = prisma.refreshToken.updateMany;

  const originalUserFindUnique = prisma.user.findUnique;
  const originalUserCreate = prisma.user.create;

  const demoUserHashedPassword = await bcryptjs.hash('Password123!', 10);
  const mockUser = {
    id: 'user-uuid-1234',
    email: 'existing.user@oil.com',
    fullName: 'Safety Reviewer',
    passwordHash: demoUserHashedPassword,
    role: UserRole.REVIEWER,
    department: 'Safety Operations',
    site: 'Refinery A',
  };
  inMemoryUsers.set(mockUser.email, mockUser);
  inMemoryUsers.set(mockUser.id, mockUser);

  prisma.user.findUnique = async ({ where }) => {
    if (where.email) return inMemoryUsers.get(where.email) || null;
    if (where.id) return inMemoryUsers.get(where.id) || null;
    return null;
  };

  prisma.user.create = async ({ data }) => {
    const newUser = {
      id: `user-id-${Date.now()}`,
      ...data,
    };
    inMemoryUsers.set(newUser.email, newUser);
    inMemoryUsers.set(newUser.id, newUser);
    return newUser;
  };

  prisma.refreshToken.create = async ({ data }) => {
    const id = `token-id-${Date.now()}-${Math.random()}`;
    const record = { id, ...data, revokedAt: null, createdAt: new Date() };
    inMemoryTokens.set(data.tokenHash, record);
    return record;
  };

  prisma.refreshToken.findUnique = async ({ where }) => {
    const record = inMemoryTokens.get(where.tokenHash);
    if (!record) return null;
    const user = inMemoryUsers.get(record.userId) || mockUser;
    return { ...record, user };
  };

  prisma.refreshToken.update = async ({ where, data }) => {
    for (const [hash, record] of inMemoryTokens.entries()) {
      if (record.id === where.id) {
        Object.assign(record, data);
        return record;
      }
    }
    return null;
  };

  prisma.refreshToken.updateMany = async ({ where, data }) => {
    let count = 0;
    for (const [hash, record] of inMemoryTokens.entries()) {
      if (
        (where.tokenHash === undefined || record.tokenHash === where.tokenHash) &&
        (where.userId === undefined || record.userId === where.userId) &&
        (where.revokedAt === null ? record.revokedAt === null : true)
      ) {
        Object.assign(record, data);
        count++;
      }
    }
    return { count };
  };

  try {
    // 1. Register success
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Officer',
        email: 'new.officer@oil.com',
        password: 'Password123!',
        role: 'REVIEWER',
      });
    assert(regRes.status === 201, '1. Register success: HTTP 201 created');
    assert(Boolean(regRes.body.accessToken) && Boolean(regRes.body.refreshToken), '1. Register returns accessToken and refreshToken');
    assert(regRes.body.user && !regRes.body.user.passwordHash, '1. Register returns safe user without passwordHash');

    // 2. Duplicate registration
    const dupRegRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Officer',
        email: 'existing.user@oil.com',
        password: 'Password123!',
        role: 'REVIEWER',
      });
    assert(dupRegRes.status === 409, '2. Duplicate registration: HTTP 409 Conflict');
    assert(dupRegRes.body.success === false, '2. Duplicate registration returns success: false');

    // 3. Login success
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'existing.user@oil.com',
        password: 'Password123!',
      });
    assert(loginRes.status === 200, '3. Login success: HTTP 200 OK');
    assert(Boolean(loginRes.body.accessToken) && Boolean(loginRes.body.refreshToken), '3. Login returns accessToken and refreshToken');
    assert(loginRes.body.user && loginRes.body.user.email === 'existing.user@oil.com', '3. Login returns safe user payload');
    assert(!loginRes.body.user.passwordHash && !loginRes.body.password, '3. Login never returns password or hash');

    // 4. Wrong password
    const wrongPassRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'existing.user@oil.com',
        password: 'WrongPassword!',
      });
    assert(wrongPassRes.status === 401, '4. Wrong password: HTTP 401');
    assert(wrongPassRes.body.success === false, '4. Wrong password returns success: false');

    // 5. Non-existent user
    const noUserRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ghost.user@oil.com',
        password: 'Password123!',
      });
    assert(noUserRes.status === 401, '5. Non-existent user: HTTP 401');
    assert(noUserRes.body.success === false, '5. Non-existent user returns success: false');

    // 6. Access protected route without token
    const noTokenRes2 = await request(app).get('/api/reports');
    assert(noTokenRes2.status === 401, '6. Access protected route without token: HTTP 401');
    assert(noTokenRes2.body.success === false, '6. Protected route without token returns success: false');

    // 7. Access protected route with valid token
    const validAccessRes = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);
    assert(validAccessRes.status !== 401, '7. Access protected route with valid token passes auth');

    // 8. Invalid access token
    const badAccessRes = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer gibberish.token.format');
    assert(badAccessRes.status === 401, '8. Invalid access token: HTTP 401');
    assert(badAccessRes.body.success === false, '8. Invalid access token returns success: false');

    // 9. Expired access token
    const expAccessRes = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${expiredAccessToken}`);
    assert(expAccessRes.status === 401, '9. Expired access token: HTTP 401');
    assert(expAccessRes.body.success === false, '9. Expired access token returns success: false');

    // 10. Refresh token success (with token rotation)
    const activeRefreshToken = loginRes.body.refreshToken;
    const refreshSuccessRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: activeRefreshToken });
    assert(refreshSuccessRes.status === 200, '10. Refresh token success: HTTP 200 OK');
    assert(Boolean(refreshSuccessRes.body.accessToken), '10. Refresh token success returns new accessToken');
    assert(Boolean(refreshSuccessRes.body.refreshToken), '10. Refresh token success returns new rotated refreshToken');
    assert(refreshSuccessRes.body.refreshToken !== activeRefreshToken, '10. Rotated refreshToken differs from previous');

    // 11. Invalid refresh token
    const invalidRefreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'not.a.valid.jwt' });
    assert(invalidRefreshRes.status === 401, '11. Invalid refresh token: HTTP 401');
    assert(invalidRefreshRes.body.success === false, '11. Invalid refresh token returns success: false');

    // 12. Expired refresh token
    const expiredRefreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: expiredRefreshToken });
    assert(expiredRefreshRes.status === 401, '12. Expired refresh token: HTTP 401');
    assert(expiredRefreshRes.body.success === false, '12. Expired refresh token returns success: false');

    // 13. Logout
    const rotatedToken = refreshSuccessRes.body.refreshToken;
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: rotatedToken });
    assert(logoutRes.status === 200, '13. Logout: HTTP 200 OK');
    assert(logoutRes.body.success === true, '13. Logout returns success: true');

    // 14. Refresh after logout must fail
    const refreshAfterLogoutRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: rotatedToken });
    assert(refreshAfterLogoutRes.status === 401, '14. Refresh after logout must fail: HTTP 401');
    assert(refreshAfterLogoutRes.body.success === false, '14. Refresh after logout returns success: false');

    // 15. /me with valid token
    const meValidRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);
    assert(meValidRes.status === 200, '15. /me with valid token: HTTP 200 OK');
    assert(meValidRes.body.user.email === 'existing.user@oil.com', '15. /me returns authenticated user details');
    assert(!meValidRes.body.user.passwordHash, '15. /me never returns passwordHash');

    // 16. /me without token
    const meNoTokenRes = await request(app).get('/api/auth/me');
    assert(meNoTokenRes.status === 401, '16. /me without token: HTTP 401');
    assert(meNoTokenRes.body.success === false, '16. /me without token returns success: false');

    console.log('\n✅ All 16 required authentication test scenarios executed successfully!');

    // -------------------------------------------------------------------------
    // 7. Role-Based Access Control (RBAC) 8 Postman Scenarios Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 7. RBAC Postman Scenarios & Privilege Escalation Prevention ---');

    const reviewerToken = generateAccessToken({
      userId: 'rev-uuid-1',
      role: UserRole.REVIEWER,
    });
    const analystToken2 = generateAccessToken({
      userId: 'ana-uuid-2',
      role: UserRole.ANALYST,
    });
    const managerToken = generateAccessToken({
      userId: 'mgr-uuid-3',
      role: UserRole.MANAGER,
    });
    const adminToken = generateAccessToken({
      userId: 'adm-uuid-4',
      role: UserRole.ADMIN,
    });

    // RBAC TEST 1: No Authorization header -> 401 Unauthorized
    const rbacTest1 = await request(app).get('/api/reports');
    assert(rbacTest1.status === 401, 'RBAC TEST 1: No Authorization header returns 401');
    assert(rbacTest1.body.message === 'Authentication required', 'RBAC TEST 1: Message is "Authentication required"');

    // RBAC TEST 2: Invalid JWT -> 401 Unauthorized
    const rbacTest2 = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer invalid.token.payload');
    assert(rbacTest2.status === 401, 'RBAC TEST 2: Invalid JWT returns 401');
    assert(rbacTest2.body.message === 'Invalid or expired token', 'RBAC TEST 2: Message is "Invalid or expired token"');

    // RBAC TEST 3: Valid REVIEWER token accessing report creation -> passes auth & role checks
    const rbacTest3 = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({
        description: 'Test incident description with sufficient detail for validation rules',
        dateOccurred: '2026-09-10T12:00:00.000Z',
        site: 'Refinery A',
        department: 'Operations',
        locationDetails: 'Platform 3',
        initialSeverity: 'HIGH',
        type: 'UNSAFE_CONDITION',
      });
    assert(rbacTest3.status !== 401 && rbacTest3.status !== 403, 'RBAC TEST 3: REVIEWER passes auth & role checks on report creation');

    // RBAC TEST 4: Valid REVIEWER token accessing dashboard -> 403 Forbidden
    const rbacTest4 = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${reviewerToken}`);
    assert(rbacTest4.status === 403, 'RBAC TEST 4: REVIEWER accessing dashboard returns 403 Forbidden');
    assert(rbacTest4.body.message === 'Insufficient permissions', 'RBAC TEST 4: Message is "Insufficient permissions"');

    // RBAC TEST 5: Valid ANALYST token accessing dashboard -> passes auth & role checks
    const rbacTest5 = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${analystToken2}`);
    assert(rbacTest5.status !== 401 && rbacTest5.status !== 403, 'RBAC TEST 5: ANALYST passes auth & role checks on dashboard');

    // RBAC TEST 6: Valid MANAGER token accessing dashboard -> passes auth & role checks
    const rbacTest6 = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${managerToken}`);
    assert(rbacTest6.status !== 401 && rbacTest6.status !== 403, 'RBAC TEST 6: MANAGER passes auth & role checks on dashboard');

    // RBAC TEST 7: Valid REVIEWER token trying to delete a report -> 403 Forbidden
    const rbacTest7 = await request(app)
      .delete('/api/reports/11111111-2222-3333-4444-555555555555')
      .set('Authorization', `Bearer ${reviewerToken}`);
    assert(rbacTest7.status === 403, 'RBAC TEST 7: REVIEWER trying to delete report returns 403 Forbidden');
    assert(rbacTest7.body.message === 'Insufficient permissions', 'RBAC TEST 7: Message is "Insufficient permissions"');

    // RBAC TEST 8: Valid ADMIN token -> Full access (can delete report, access dashboard)
    const rbacTest8Delete = await request(app)
      .delete('/api/reports/11111111-2222-3333-4444-555555555555')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(rbacTest8Delete.status !== 401 && rbacTest8Delete.status !== 403, 'RBAC TEST 8: ADMIN passes authorization on report deletion');

    const rbacTest8Dashboard = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(rbacTest8Dashboard.status !== 401 && rbacTest8Dashboard.status !== 403, 'RBAC TEST 8: ADMIN passes authorization on dashboard');

    // RBAC TEST 9: Privilege Escalation Prevention: User attempting to register as ADMIN
    const escalateRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker',
        email: 'hacker@test.com',
        password: 'Password123!',
        role: 'ADMIN',
      });
    assert(escalateRes.status === 400 || escalateRes.status === 403, 'RBAC TEST 9: Self-registering as ADMIN is rejected (400 or 403)');
    assert(escalateRes.body.success === false, 'RBAC TEST 9: Privilege escalation returns success: false');

    console.log('✅ RBAC Postman Scenarios & Privilege Escalation verified successfully!');

  } finally {
    // Restore original prisma methods
    prisma.refreshToken.create = originalCreate;
    prisma.refreshToken.findUnique = originalFindUnique;
    prisma.refreshToken.update = originalUpdate;
    prisma.refreshToken.updateMany = originalUpdateMany;
    prisma.user.findUnique = originalUserFindUnique;
    prisma.user.create = originalUserCreate;
  }

  console.log('\n====================================================');
  console.log(`FINAL TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
