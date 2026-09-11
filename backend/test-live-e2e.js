const request = require('supertest');
const app = require('./src/app');
const prisma = require('./src/config/database');
const { realAiService } = require('./src/services/ai/realAiService');
const { aiConfig } = require('./src/config/aiConfig');

async function runLiveE2ETest() {
  console.log('====================================================');
  console.log('STARTING LIVE END-TO-END AI/NLP INTEGRATION TEST');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, detail) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}${detail ? ' - ' + detail : ''}`);
      failed++;
    }
  }

  // 1. Verify Live Python AI Service Health
  console.log('--- Step 1: Verify Python AI Microservice Health ---');
  try {
    const healthRes = await fetch(`${aiConfig.serviceUrl}/health`);
    assert(healthRes.ok, 'Python AI /health responded with 200 OK');
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'Python AI reports healthy status');
    assert(healthData.distilbert_model_loaded === true, 'DistilBERT model weights loaded in Python runtime');
    console.log('Health Diagnostics:', healthData);
  } catch (err) {
    console.error('Failed to reach Python AI service:', err.message);
    assert(false, 'Python AI health check failed', err.message);
    return;
  }

  // In-memory repositories for Prisma simulation if MySQL server is not running locally
  const reportsStore = new Map();
  const analysesStore = new Map();
  const usersStore = new Map();

  const originalReportCreate = prisma.safetyReport.create;
  const originalReportFindUnique = prisma.safetyReport.findUnique;
  const originalReportUpdate = prisma.safetyReport.update;
  const originalAnalysisCreate = prisma.safetyAnalysis.create;
  const originalAnalysisUpdateMany = prisma.safetyAnalysis.updateMany;
  const originalTransaction = prisma.$transaction;
  const originalUserFindUnique = prisma.user.findUnique;

  // Intercept Prisma if DB connection fails, otherwise use live DB
  let useInMemoryPrisma = false;
  try {
    await prisma.safetyReport.findFirst();
  } catch {
    console.log('[Prisma] Local MySQL connection offline; utilizing transactional in-memory store for E2E validation');
    useInMemoryPrisma = true;
  }

  if (useInMemoryPrisma) {
    prisma.user.findUnique = async ({ where }) => {
      return usersStore.get(where.id || where.email) || {
        id: where.id || 'mock-user-1',
        email: where.email || 'analyst@oilindia.in',
        fullName: 'Lead Safety Analyst',
        role: 'ANALYST',
      };
    };

    const crypto = require('crypto');

    prisma.safetyReport.create = async ({ data }) => {
      const id = data.id || crypto.randomUUID();
      const record = { id, ...data, createdAt: new Date(), updatedAt: new Date(), analyses: [] };
      reportsStore.set(id, record);
      return record;
    };

    prisma.safetyReport.findUnique = async ({ where, include }) => {
      const report = reportsStore.get(where.id);
      if (!report) return null;
      const reportAnalyses = Array.from(analysesStore.values()).filter(
        (a) => a.reportId === where.id && (include?.analyses?.where?.isLatest ? a.isLatest : true)
      );
      return { ...report, analyses: reportAnalyses };
    };

    prisma.safetyReport.update = async ({ where, data }) => {
      const report = reportsStore.get(where.id);
      if (!report) return null;
      Object.assign(report, data, { updatedAt: new Date() });
      return report;
    };

    prisma.safetyAnalysis.create = async ({ data }) => {
      const id = data.id || crypto.randomUUID();
      const record = { id, ...data, createdAt: new Date() };
      analysesStore.set(id, record);
      return record;
    };

    prisma.safetyAnalysis.updateMany = async ({ where, data }) => {
      for (const [id, a] of analysesStore.entries()) {
        if (a.reportId === where.reportId && (where.isLatest === undefined || a.isLatest === where.isLatest)) {
          Object.assign(a, data);
        }
      }
      return { count: 1 };
    };

    prisma.$transaction = async (cb) => {
      return cb(prisma);
    };
  }

  // 2. Authentication & JWT Generation
  console.log('\n--- Step 2: Authenticate and Generate JWT ---');
  const jwt = require('jsonwebtoken');
  const { jwtConfig } = require('./src/config/jwtConfig');
  const testUserId = 'usr-e2e-analyst-1';
  const token = jwt.sign(
    { userId: testUserId, role: 'ANALYST' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );
  assert(Boolean(token), 'Generated valid JWT bearer token for ANALYST role');

  // 3. Scenario 1: HIGH-RISK INCIDENT NARRATIVE
  console.log('\n--- Step 3: Test HIGH-RISK Incident (Critical Triad) ---');
  const highRiskNarrative = 'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.';

  // 3a. Create Report
  const createReportRes = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: highRiskNarrative,
      reportType: 'UNSAFE_ACT',
      site: 'Assam Gas Processing Rig 04',
      department: 'Pipeline Operations',
      activity: 'Hot Work Welding',
    });

  assert(createReportRes.status === 201, 'POST /api/reports created safety report', createReportRes.text);
  const reportId1 = createReportRes.body.data.id;
  assert(Boolean(reportId1), `Obtained Report ID: ${reportId1}`);

  // 3b. Trigger AI Analysis via Express Backend -> FastAPI Service
  const analyzeRes1 = await request(app)
    .post(`/api/reports/${reportId1}/analyze`)
    .set('Authorization', `Bearer ${token}`)
    .send();

  console.log('Analyze response status:', analyzeRes1.status, analyzeRes1.body);
  assert(analyzeRes1.status === 201, 'POST /api/reports/:id/analyze succeeded with 201 Created', analyzeRes1.text);
  const analysis1 = analyzeRes1.body.data;
  console.log('\n[Actual AI Output Received by Node]:');
  console.log(JSON.stringify({
    reportId: analysis1.reportId,
    sifPotential: analysis1.sifPotential,
    probability: analysis1.probability,
    riskLevel: analysis1.riskLevel,
    hazards: analysis1.hazards,
    exposures: analysis1.exposures,
    controlFailures: analysis1.controlFailures,
    iogpRules: analysis1.iogpRules,
    explanation: analysis1.explanation,
  }, null, 2));

  assert(analysis1.sifPotential === true, 'sifPotential is true');
  assert(analysis1.probability >= 0.85, `Probability is >= 0.85 (got ${analysis1.probability})`);
  assert(analysis1.riskLevel === 'HIGH', `Risk Level is HIGH (got ${analysis1.riskLevel})`);
  assert(analysis1.hazards.length > 0, `Hazards detected: [${analysis1.hazards.join(', ')}]`);
  assert(analysis1.controlFailures.length > 0, `Control failures detected: [${analysis1.controlFailures.join(', ')}]`);
  assert(analysis1.iogpRules.includes('Hot Work'), 'IOGP Life-Saving Rules include "Hot Work"');

  // 3c. Verify Persistence via GET /api/reports/:id
  const getReportRes1 = await request(app)
    .get(`/api/reports/${reportId1}`)
    .set('Authorization', `Bearer ${token}`);

  assert(getReportRes1.status === 200, 'GET /api/reports/:id returned 200');
  assert(getReportRes1.body.data.status === 'ANALYZED', 'SafetyReport status is ANALYZED');
  assert(getReportRes1.body.data.analyses.length > 0, 'Persisted SafetyAnalysis record found in database');

  // 3d. Verify Idempotent Analysis (duplicate prevention)
  const duplicateRes1 = await request(app)
    .post(`/api/reports/${reportId1}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  assert(duplicateRes1.status === 200, 'Duplicate analyze returns 200 without creating redundant record');
  assert(duplicateRes1.body.data.isExisting === true, 'Returned existing cached analysis');

  // 4. Scenario 2: SAFE COMPLIANT NARRATIVE
  console.log('\n--- Step 4: Test SAFE Compliant Observation ---');
  const safeNarrative = 'Technician completed pre-task risk assessment, verified positive energy isolation, applied LOTO padlocks, and received valid hot work authorization permit before opening the pump housing.';

  const createReportRes2 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: safeNarrative,
      reportType: 'UNSAFE_CONDITION',
      site: 'Digboi Refining Unit 2',
      department: 'Mechanical Maintenance',
      activity: 'Pump Housing Maintenance',
    });

  const reportId2 = createReportRes2.body.data.id;
  const analyzeRes2 = await request(app)
    .post(`/api/reports/${reportId2}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  assert(analyzeRes2.status === 201, 'POST /api/reports/:id/analyze succeeded for safe narrative');
  const analysis2 = analyzeRes2.body.data;
  console.log('Safe Result: Probability =', analysis2.probability, 'Risk =', analysis2.riskLevel, 'ControlFailures =', analysis2.controlFailures);
  assert(analysis2.riskLevel === 'LOW', `Safe narrative riskLevel is LOW (got ${analysis2.riskLevel})`);
  assert(analysis2.sifPotential === false, 'Safe narrative sifPotential is false');
  assert(analysis2.controlFailures.length === 0, 'No control failures detected');

  // 5. Scenario 3: LOW-RISK OFFICE INCIDENT
  console.log('\n--- Step 5: Test LOW-RISK Administrative Observation ---');
  const lowRiskNarrative = 'An administrative clerk tripped over an Ethernet cable in the site office corridor and scraped their knee.';

  const createReportRes3 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: lowRiskNarrative,
      reportType: 'INCIDENT',
      site: 'Duliajan Headquarters',
      department: 'Administration',
      activity: 'Office Walking',
    });

  const reportId3 = createReportRes3.body.data.id;
  const analyzeRes3 = await request(app)
    .post(`/api/reports/${reportId3}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  assert(analyzeRes3.status === 201, 'POST /api/reports/:id/analyze succeeded for office incident');
  const analysis3 = analyzeRes3.body.data;
  console.log('Low-Risk Result: Risk =', analysis3.riskLevel, 'Hazards =', analysis3.hazards, 'ControlFailures =', analysis3.controlFailures);
  assert(analysis3.hazards.length === 0, 'No high-energy industrial hazards detected');
  assert(analysis3.controlFailures.length === 0, 'No critical industrial barrier failures detected');

  // 6. Error Scenarios
  console.log('\n--- Step 6: Test Error & Security Handling ---');

  // 6a. 401 Unauthorized (missing token)
  const unauthRes = await request(app)
    .post(`/api/reports/${reportId1}/analyze`);
  assert(unauthRes.status === 401, 'Missing token returns 401 Unauthorized');

  // 6b. 401 Unauthorized (invalid token)
  const invalidTokenRes = await request(app)
    .post(`/api/reports/${reportId1}/analyze`)
    .set('Authorization', 'Bearer invalid-token-xyz');
  assert(invalidTokenRes.status === 401, 'Invalid token returns 401 Unauthorized');

  // 6c. 404 Not Found (invalid UUID)
  const notFoundRes = await request(app)
    .post('/api/reports/00000000-0000-0000-0000-000000000000/analyze')
    .set('Authorization', `Bearer ${token}`);
  assert(notFoundRes.status === 404, 'Non-existent report ID returns 404 Not Found');

  console.log('\n====================================================');
  console.log(`LIVE E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveE2ETest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
