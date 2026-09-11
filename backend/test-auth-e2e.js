const request = require('supertest');
const app = require('./src/app');

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

async function runTests() {
  console.log('====================================================');
  console.log('STARTING COMPLETE AUTH & RBAC VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Valid ADMIN Login
  console.log('--- 1. Valid ADMIN Login ---');
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@oil.com', password: 'Password123!' });
  assert(adminRes.status === 200, 'Admin login returns 200 OK');
  assert(adminRes.body.user && adminRes.body.user.role === 'ADMIN', 'Admin user role is ADMIN');
  assert(!!adminRes.body.accessToken, 'Admin access token is present');
  assert(!!adminRes.body.refreshToken, 'Admin refresh token is present');
  const adminToken = adminRes.body.accessToken;

  // 2. Valid HSE_ANALYST Login
  console.log('\n--- 2. Valid HSE_ANALYST Login ---');
  const analystRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'analyst@oil.com', password: 'Password123!' });
  assert(analystRes.status === 200, 'Analyst login returns 200 OK');
  assert(analystRes.body.user && (analystRes.body.user.role === 'ANALYST' || analystRes.body.user.role === 'HSE_ANALYST'), 'Analyst user role is ANALYST/HSE_ANALYST');
  assert(!!analystRes.body.accessToken, 'Analyst access token is present');
  const analystToken = analystRes.body.accessToken;

  // 3. Valid REPORTER Login
  console.log('\n--- 3. Valid REPORTER Login ---');
  const reporterRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'reviewer@oil.com', password: 'Password123!' });
  assert(reporterRes.status === 200, 'Reporter login returns 200 OK');
  assert(reporterRes.body.user && (reporterRes.body.user.role === 'REVIEWER' || reporterRes.body.user.role === 'REPORTER'), 'Reporter user role is REVIEWER/REPORTER');
  assert(!!reporterRes.body.accessToken, 'Reporter access token is present');
  const reporterToken = reporterRes.body.accessToken;

  // 4. Invalid Credentials
  console.log('\n--- 4. Invalid Credentials ---');
  const invalidRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@oil.com', password: 'WrongPassword999!' });
  assert(invalidRes.status === 401, 'Invalid password returns 401 Unauthorized');

  const nonExistentRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'ghost@oil.com', password: 'Password123!' });
  assert(nonExistentRes.status === 401, 'Non-existent user returns 401 Unauthorized');

  // 5. Missing Credentials (Validation)
  console.log('\n--- 5. Missing Credentials Validation ---');
  const missingEmailRes = await request(app)
    .post('/api/auth/login')
    .send({ password: 'Password123!' });
  assert(missingEmailRes.status === 400, 'Missing email returns 400 Bad Request');

  const invalidEmailFormatRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'not-an-email', password: 'Password123!' });
  assert(invalidEmailFormatRes.status === 400, 'Invalid email format returns 400 Bad Request');

  // 6. Protected Endpoint without Authentication
  console.log('\n--- 6. Protected Endpoint Without Auth ---');
  const unauthDash = await request(app)
    .get('/api/dashboard/summary');
  assert(unauthDash.status === 401, 'GET /api/dashboard/summary without token returns 401 Unauthorized');

  const unauthReports = await request(app)
    .get('/api/reports');
  assert(unauthReports.status === 401, 'GET /api/reports without token returns 401 Unauthorized');

  // 7. Protected Endpoint with Valid Authentication
  console.log('\n--- 7. Protected Endpoint With Valid Auth ---');
  const authDash = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${analystToken}`);
  assert(authDash.status === 200, 'GET /api/dashboard/summary with Analyst token returns 200 OK');
  assert(authDash.body.success === true && authDash.body.data.totalReports !== undefined, 'Dashboard returns live relational data');

  const authReports = await request(app)
    .get('/api/reports')
    .set('Authorization', `Bearer ${reporterToken}`);
  assert(authReports.status === 200, 'GET /api/reports with Reporter token returns 200 OK');

  // 8. Role-Based Authorization Checks (RBAC)
  console.log('\n--- 8. Role-Based Access Control (RBAC) ---');
  // Reporter attempting to view dashboard -> Forbidden 403
  const reporterDash = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${reporterToken}`);
  assert(reporterDash.status === 403, 'REPORTER blocked from /api/dashboard/summary with 403 Forbidden');

  // Reporter submitting report -> Allowed 201
  const reporterSubmit = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${reporterToken}`)
    .send({
      description: 'Scaffolding toe-board missing on platform B-2 upper deck during inspection.',
      reportType: 'UNSAFE_CONDITION',
      site: 'Plant A - Refining Complex',
      department: 'Scaffolding',
      activity: 'Inspection at Height',
    });
  assert(reporterSubmit.status === 201, 'REPORTER permitted to create report (201 Created)');
  const createdReportId = reporterSubmit.body.data.id;

  // Reporter triggering AI analysis -> Forbidden 403
  const reporterAnalyze = await request(app)
    .post(`/api/reports/${createdReportId}/analyze`)
    .set('Authorization', `Bearer ${reporterToken}`);
  assert(reporterAnalyze.status === 403, 'REPORTER blocked from triggering AI analysis with 403 Forbidden');

  // Analyst triggering AI analysis -> Allowed 201/200
  const analystAnalyze = await request(app)
    .post(`/api/reports/${createdReportId}/analyze`)
    .set('Authorization', `Bearer ${analystToken}`);
  assert(analystAnalyze.status === 200 || analystAnalyze.status === 201, 'HSE_ANALYST permitted to trigger AI analysis');
  assert(analystAnalyze.body.data && analystAnalyze.body.data.sifPotential !== undefined, 'AI evaluation completed and returned');

  // Analyst attempting to delete report -> Forbidden 403
  const analystDelete = await request(app)
    .delete(`/api/reports/${createdReportId}`)
    .set('Authorization', `Bearer ${analystToken}`);
  assert(analystDelete.status === 403, 'HSE_ANALYST blocked from deleting report with 403 Forbidden');

  // Admin attempting to delete report -> Allowed 200
  const adminDelete = await request(app)
    .delete(`/api/reports/${createdReportId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert(adminDelete.status === 200, 'ADMIN permitted to delete report (200 OK)');

  // 9. Invalid / Expired / Tampered Token
  console.log('\n--- 9. Invalid & Tampered Tokens ---');
  const invalidTokenRes = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', 'Bearer invalid.jwt.signature');
  assert(invalidTokenRes.status === 401, 'Invalid JWT token returns 401 Unauthorized');

  // 10. Get Authenticated User Profile (GET /api/auth/me)
  console.log('\n--- 10. Authenticated User Profile (GET /api/auth/me) ---');
  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${adminToken}`);
  assert(meRes.status === 200, 'GET /api/auth/me returns 200 OK');
  assert(meRes.body.user.email === 'admin@oil.com', 'Returns correct profile email');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
