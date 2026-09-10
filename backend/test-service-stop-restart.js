const request = require('supertest');
const app = require('./src/app');
const prisma = require('./src/config/database');
const { aiConfig } = require('./src/config/aiConfig');
const { getAiService } = require('./src/services/ai');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('./src/config/jwtConfig');
const crypto = require('crypto');
const { execSync } = require('child_process');

async function testStopAndRestartFlow() {
  console.log('====================================================');
  console.log('TESTING AI SERVICE STOP, RESTART, AND MOCK/REAL SWITCH');
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

  // Token for authentication
  const token = jwt.sign(
    { userId: 'usr-stop-restart-test', role: 'ANALYST' },
    jwtConfig.secret,
    { expiresIn: '15m' }
  );

  // In-memory repositories if local MySQL is offline
  const reportsStore = new Map();
  const analysesStore = new Map();
  let useInMemory = false;
  try {
    await prisma.safetyReport.findFirst();
  } catch {
    console.log('[Prisma] Utilizing in-memory transactional database store');
    useInMemory = true;
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
    prisma.$transaction = async (cb) => cb(prisma);
  }

  // ----------------------------------------------------
  // Step 1: Baseline Analysis with Real AI Service Running
  // ----------------------------------------------------
  console.log('--- Phase A: Real AI Service Running (Online) ---');
  const rep1 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.',
      reportType: 'UNSAFE_ACT',
      site: 'Assam Gas Processing Rig 04',
      activity: 'Hot Work',
    });

  const repId1 = rep1.body.data.id;
  const analyzeOnlineRes = await request(app)
    .post(`/api/reports/${repId1}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  assert(analyzeOnlineRes.status === 201, 'AI analysis succeeds with 201 when Python service is online');
  assert(analyzeOnlineRes.body.data.riskLevel === 'HIGH', 'Real model returned riskLevel: HIGH');
  assert(analyzeOnlineRes.body.data.probability === 0.88, 'Real model returned probability: 0.88');

  // ----------------------------------------------------
  // Step 2: STOP Python AI Service
  // ----------------------------------------------------
  console.log('\n--- Phase B: STOP Python AI Service Completely ---');
  // Find PID listening on port 8000 and terminate it
  try {
    const netstatOut = execSync('netstat -ano | findstr :8000 | findstr LISTENING', { encoding: 'utf8' });
    const match = netstatOut.trim().split(/\s+/).pop();
    if (match) {
      console.log(`Terminating Python process PID ${match} on port 8000...`);
      execSync(`taskkill /F /PID ${match}`);
      console.log('Python AI service stopped.');
    }
  } catch (err) {
    console.log('Python process was not running or failed to stop:', err.message);
  }

  // Verify port 8000 is truly unreachable
  let isDown = false;
  try {
    await fetch('http://127.0.0.1:8000/health');
  } catch {
    isDown = true;
  }
  assert(isDown, 'Confirmed: Python AI service is completely DOWN on port 8000');

  // ----------------------------------------------------
  // Step 3: Call Analyze while Python is Stopped
  // ----------------------------------------------------
  console.log('\n--- Phase C: Call Analyze while Python Service is Stopped ---');
  const rep2 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'Technician inspecting high voltage switchgear without arc-flash protection.',
      reportType: 'UNSAFE_ACT',
      site: 'Substation Alpha',
      activity: 'Electrical Inspection',
    });

  const repId2 = rep2.body.data.id;
  const analyzeOfflineRes = await request(app)
    .post(`/api/reports/${repId2}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  console.log('Offline Response Status:', analyzeOfflineRes.status);
  console.log('Offline Response Body:', analyzeOfflineRes.body);

  assert(analyzeOfflineRes.status === 503, 'Backend returns HTTP 503 when AI service is down');
  assert(analyzeOfflineRes.body.success === false, 'Backend returns success: false');
  assert(
    analyzeOfflineRes.body.message.includes('unavailable') || analyzeOfflineRes.body.error?.code === 'AI_SERVICE_UNAVAILABLE',
    'Controlled error message: AI analysis service is currently unavailable'
  );

  // Check report status in database
  const getRep2 = await request(app)
    .get(`/api/reports/${repId2}`)
    .set('Authorization', `Bearer ${token}`);

  assert(getRep2.body.data.status === 'FAILED', 'SafetyReport status transitions to FAILED in database');
  assert(!getRep2.body.data.analyses || getRep2.body.data.analyses.length === 0, 'No fake or placeholder analysis persisted in database');

  // ----------------------------------------------------
  // Step 4: RESTART Python AI Service
  // ----------------------------------------------------
  console.log('\n--- Phase D: Restart Python AI Service ---');
  const { spawn } = require('child_process');
  const aiSubprocess = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: 'c:\\Users\\Nishit\\OneDrive\\Desktop\\ALL Projects\\SIH\\SIH-165-AI_NLP',
    stdio: 'ignore',
    detached: true,
  });
  aiSubprocess.unref();

  // Poll until /health responds
  console.log('Waiting for Python AI service to warm up and load DistilBERT weights...');
  let restarted = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await fetch('http://127.0.0.1:8000/health');
      if (res.ok) {
        const h = await res.json();
        if (h.distilbert_model_loaded) {
          restarted = true;
          break;
        }
      }
    } catch {
      // retry
    }
  }
  assert(restarted, 'Python AI service successfully restarted and DistilBERT model reloaded');

  // ----------------------------------------------------
  // Step 5: Retry Analysis after Restart
  // ----------------------------------------------------
  console.log('\n--- Phase E: Re-try Analysis after AI Service Restart ---');
  const analyzeRestartRes = await request(app)
    .post(`/api/reports/${repId2}/analyze?force=true`)
    .set('Authorization', `Bearer ${token}`);

  console.log('Post-restart status:', analyzeRestartRes.status);
  assert(analyzeRestartRes.status === 201, 'Analysis succeeds with 201 after Python service restarted');
  assert(analyzeRestartRes.body.data.sifPotential === true, 'Analysis returns sifPotential: true');
  assert(analyzeRestartRes.body.data.riskLevel === 'HIGH', 'Analysis returns riskLevel: HIGH');

  // ----------------------------------------------------
  // Step 6: Test Mock Mode Provider Switching
  // ----------------------------------------------------
  console.log('\n--- Phase F: Verify Mock vs Real Provider Switching ---');
  const { analysisService } = require('./src/services/analysisService');

  // Switch to Mock
  analysisService.setProvider('mock');
  const rep3 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'Routine housekeeping in administrative corridor.',
      reportType: 'UNSAFE_CONDITION',
      site: 'Headquarters',
      activity: 'Housekeeping',
    });

  const repId3 = rep3.body.data.id;
  const analyzeMockRes = await request(app)
    .post(`/api/reports/${repId3}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  assert(analyzeMockRes.status === 201, 'Mock AI analysis succeeds');
  assert(
    analyzeMockRes.body.data.analysis.modelVersion.includes('mock'),
    `Mock mode used mock modelVersion (${analyzeMockRes.body.data.analysis.modelVersion})`
  );

  // Switch back to Real
  analysisService.setProvider('real');
  const analyzeRealRes = await request(app)
    .post(`/api/reports/${repId3}/analyze?force=true`)
    .set('Authorization', `Bearer ${token}`);

  assert(analyzeRealRes.status === 201, 'Real AI analysis succeeds after switching back to real');
  assert(
    !analyzeRealRes.body.data.analysis.modelVersion.includes('mock'),
    `Real mode used real modelVersion (${analyzeRealRes.body.data.analysis.modelVersion})`
  );

  console.log('\n====================================================');
  console.log(`STOP/RESTART TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

testStopAndRestartFlow().catch((e) => {
  console.error('Fatal error in stop/restart test:', e);
  process.exit(1);
});
