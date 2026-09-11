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

async function runE2EFlow() {
  console.log('====================================================');
  console.log('TESTING COMPLETE AUTHENTICATED FRONTEND ↔ BACKEND FLOW');
  console.log('====================================================\n');

  // STEP 1: User Login (Frontend -> POST /api/auth/login)
  console.log('--- Step 1: User Authentication (Login) ---');
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'analyst@oil.com',
      password: 'Password123!',
    });

  assert(loginRes.status === 200, '1.1 Login successfully returned HTTP 200');
  assert(!!loginRes.body.accessToken, '1.2 Access token issued to client');
  assert(loginRes.body.user.role === 'ANALYST' || loginRes.body.user.role === 'HSE_ANALYST', '1.3 Role recognized as HSE Analyst');
  const accessToken = loginRes.body.accessToken;

  // STEP 2: Dashboard Data Retrieval (Frontend apiClient -> GET /api/dashboard/*)
  console.log('\n--- Step 2: Authenticated Dashboard API Requests ---');
  const summaryRes = await request(app)
    .get('/api/dashboard/summary')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(summaryRes.status === 200, '2.1 GET /api/dashboard/summary returned 200 OK');
  assert(summaryRes.body.data.totalReports >= 12, '2.2 Dashboard summary has live seeded metrics');

  const sifDistRes = await request(app)
    .get('/api/dashboard/sif-distribution')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(sifDistRes.status === 200, '2.3 GET /api/dashboard/sif-distribution returned 200 OK');

  const riskDistRes = await request(app)
    .get('/api/dashboard/risk-distribution')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(riskDistRes.status === 200, '2.4 GET /api/dashboard/risk-distribution returned 200 OK');

  const hazardsRes = await request(app)
    .get('/api/dashboard/hazards?limit=10')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(hazardsRes.status === 200, '2.5 GET /api/dashboard/hazards returned 200 OK');

  const iogpRes = await request(app)
    .get('/api/dashboard/iogp-rules?limit=10')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(iogpRes.status === 200, '2.6 GET /api/dashboard/iogp-rules returned 200 OK');

  const sitesRes = await request(app)
    .get('/api/dashboard/sites')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(sitesRes.status === 200, '2.7 GET /api/dashboard/sites returned 200 OK');

  const trendsRes = await request(app)
    .get('/api/dashboard/trends?period=monthly')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(trendsRes.status === 200, '2.8 GET /api/dashboard/trends returned 200 OK');

  // STEP 3: Reports List (Frontend apiClient -> GET /api/reports)
  console.log('\n--- Step 3: Authenticated Reports List Request ---');
  const reportsListRes = await request(app)
    .get('/api/reports?page=1&limit=20')
    .set('Authorization', `Bearer ${accessToken}`);
  assert(reportsListRes.status === 200, '3.1 GET /api/reports returned 200 OK');
  assert(Array.isArray(reportsListRes.body.data) && reportsListRes.body.data.length > 0, '3.2 Reports list returned populated array');

  // STEP 4: Submit Safety Report (Frontend apiClient -> POST /api/reports)
  console.log('\n--- Step 4: Submit New Safety Observation ---');
  const newReportRes = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      description: 'Worker noticed high pressure gas flange leaking on separator train B during startup without gas detector present.',
      reportType: 'UNSAFE_CONDITION',
      site: 'Plant A - Refining Complex',
      department: 'Process Operations',
      activity: 'Separator Commissioning',
      contractorType: 'Internal',
      workPhase: 'Commissioning',
    });
  assert(newReportRes.status === 201, '4.1 POST /api/reports returned 201 Created');
  assert(!!newReportRes.body.data.id, '4.2 Created report assigned UUID');
  const reportId = newReportRes.body.data.id;

  // STEP 5: Report Details (Frontend apiClient -> GET /api/reports/:id)
  console.log('\n--- Step 5: Authenticated Report Details Request ---');
  const reportDetailRes = await request(app)
    .get(`/api/reports/${reportId}`)
    .set('Authorization', `Bearer ${accessToken}`);
  assert(reportDetailRes.status === 200, '5.1 GET /api/reports/:id returned 200 OK');
  assert(reportDetailRes.body.data.id === reportId, '5.2 Report details matched submitted ID');

  // STEP 6: Trigger AI SIF Analysis (Frontend apiClient -> POST /api/reports/:id/analyze)
  console.log('\n--- Step 6: Trigger AI Precursor Analysis ---');
  const analyzeRes = await request(app)
    .post(`/api/reports/${reportId}/analyze`)
    .set('Authorization', `Bearer ${accessToken}`);
  assert(analyzeRes.status === 200 || analyzeRes.status === 201, '6.1 POST /api/reports/:id/analyze returned 200/201');
  assert(analyzeRes.body.data.sifPotential !== undefined, '6.2 SIF potential precursor flag returned');
  assert(Array.isArray(analyzeRes.body.data.hazards) && analyzeRes.body.data.hazards.length > 0, '6.3 Hazards identified by AI');
  assert(analyzeRes.body.data.riskLevel !== undefined, '6.4 Risk level classified');

  // STEP 7: Security Verification - Unauthenticated Requests MUST be Rejected
  console.log('\n--- Step 7: Unauthenticated Request Rejection Verification ---');
  const unauthDash = await request(app).get('/api/dashboard/summary');
  assert(unauthDash.status === 401, '7.1 Unauthenticated dashboard query rejected with 401');

  const unauthReports = await request(app).get('/api/reports');
  assert(unauthReports.status === 401, '7.2 Unauthenticated reports list query rejected with 401');

  const unauthAnalyze = await request(app).post(`/api/reports/${reportId}/analyze`);
  assert(unauthAnalyze.status === 401, '7.3 Unauthenticated AI analysis request rejected with 401');

  // Clean up test report using Admin
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@oil.com', password: 'Password123!' });
  const adminToken = adminLogin.body.accessToken;

  const deleteRes = await request(app)
    .delete(`/api/reports/${reportId}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert(deleteRes.status === 200, '7.4 Admin cleanup of test report succeeded (200 OK)');

  console.log('\n====================================================');
  console.log(`END-TO-END VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runE2EFlow().catch((err) => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
