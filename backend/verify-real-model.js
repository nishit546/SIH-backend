const request = require('supertest');
const app = require('./src/app');
const prisma = require('./src/config/database');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('./src/config/jwtConfig');

async function runExplicitVerification() {
  console.log('=== REAL MODEL END-TO-END VERIFICATION ===\n');

  // 1. Health check verification
  console.log('1. Checking Node Health Endpoint: GET /health');
  const healthRes = await request(app).get('/health');
  console.log('Node Health Status:', healthRes.status, JSON.stringify(healthRes.body, null, 2));

  // 2. Generate Auth Token
  const existingAnalyst = await prisma.user.findFirst({ where: { role: 'ANALYST' } });
  const userId = existingAnalyst?.id || 'bbd210d1-cddb-4c5e-aa66-31de06678b0b';
  const token = jwt.sign(
    { userId, role: 'ANALYST' },
    jwtConfig.secret,
    { expiresIn: '1h' }
  );

  // 3. Phase 14 Test: High Risk Critical Triad
  console.log('\n2. Phase 14 Real Model Test: High-Risk Welding Precursor');
  const narrative1 = 'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.';
  const repRes1 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: narrative1,
      reportType: 'UNSAFE_ACT',
      site: 'Duliajan GPU Facility 02',
      department: 'Pipeline Operations',
      activity: 'Hot Work Welding',
    });
  
  const report1 = repRes1.body.data;
  console.log(`Created Report 1: ID = ${report1.id}, Status = ${report1.status}`);

  const analyzeRes1 = await request(app)
    .post(`/api/reports/${report1.id}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Analyze Report 1 HTTP Status: ${analyzeRes1.status}`);
  console.log('Actual Response from Node to Client:');
  console.log(JSON.stringify(analyzeRes1.body, null, 2));

  // 4. Phase 15 Test: Safe Compliant Procedure
  console.log('\n3. Phase 15 Real Model Test: Compliant LOTO Isolation');
  const narrative2 = 'Technician completed pre-task risk assessment, verified positive energy isolation, applied LOTO padlocks, and received valid hot work authorization permit before opening the pump housing.';
  const repRes2 = await request(app)
    .post('/api/reports')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: narrative2,
      reportType: 'UNSAFE_CONDITION',
      site: 'Moran Drilling Station',
      department: 'Mechanical Maintenance',
      activity: 'Pump Isolation & Maintenance',
    });

  const report2 = repRes2.body.data;
  console.log(`Created Report 2: ID = ${report2.id}, Status = ${report2.status}`);

  const analyzeRes2 = await request(app)
    .post(`/api/reports/${report2.id}/analyze`)
    .set('Authorization', `Bearer ${token}`);

  console.log(`Analyze Report 2 HTTP Status: ${analyzeRes2.status}`);
  console.log('Actual Response from Node to Client:');
  console.log(JSON.stringify(analyzeRes2.body, null, 2));

  // 5. Query persisted database records
  console.log('\n4. Database Persistence Verification (GET /api/reports/:id)');
  const dbCheck1 = await request(app)
    .get(`/api/reports/${report1.id}`)
    .set('Authorization', `Bearer ${token}`);
  console.log('Report 1 in DB status:', dbCheck1.body.data?.status);
  console.log('Report 1 analyses count:', dbCheck1.body.data?.analyses?.length);

  const dbCheck2 = await request(app)
    .get(`/api/reports/${report2.id}`)
    .set('Authorization', `Bearer ${token}`);
  console.log('Report 2 in DB status:', dbCheck2.body.data?.status);
  console.log('Report 2 analyses count:', dbCheck2.body.data?.analyses?.length);

  console.log('\n=== ALL REAL MODEL INTEGRATION CHECKS COMPLETE ===');
}

runExplicitVerification().catch(console.error);
