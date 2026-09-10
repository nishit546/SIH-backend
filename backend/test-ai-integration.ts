import http from 'http';
import prisma from './src/config/database';
import { RealAIAnalysisService } from './src/services/ai/realAiService';
import { AnalysisService } from './src/services/analysisService';
import { mockAiService } from './src/services/ai/mockAiService';
import { ReportType, ProcessingStatus } from '@prisma/client';

async function runTests() {
  console.log('====================================================');
  console.log('STARTING REAL AI INTEGRATION & FAILURE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ' - ' + detail : ''}`);
      failed++;
    }
  }

  // Set up a local test HTTP server to simulate the FastAPI AI Service
  let currentServerHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void = () => {};

  const server = http.createServer((req, res) => {
    currentServerHandler(req, res);
  });

  const testPort = 8099;
  await new Promise<void>((resolve) => server.listen(testPort, '127.0.0.1', () => resolve()));
  const testServiceUrl = `http://127.0.0.1:${testPort}`;

  const realAi = new RealAIAnalysisService(testServiceUrl, 3000);
  const analysisService = new AnalysisService(realAi);

  try {
    // -------------------------------------------------------------
    // TEST 1: Real AI Request Format & Successful Analysis Mapping
    // -------------------------------------------------------------
    console.log('\n--- 1. Real AI Success Flow & Payload Verification ---');
    let receivedPayload: any = null;
    let receivedHeaders: any = null;

    currentServerHandler = (req, res) => {
      receivedHeaders = req.headers;
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        receivedPayload = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            sif_probability: 0.88,
            sif_potential: true,
            confidence: 0.95,
            risk_level: 'HIGH',
            iogp_rules: ['Hot Work', 'Energy Isolation', 'Work Authorization'],
            hazards: ['welding', 'pipeline', 'pressure', 'gas'],
            exposure: ['worker'],
            control_failures: ['before gas testing was completed'],
            potential_consequence: 'Catastrophic hydrocarbon fire/explosion and worker fatality',
            explanation:
              'Critical Triad detected: Hot work commenced on pressurized gas infrastructure without mandatory pre-entry atmospheric clearance. Severe barrier failure with immediate fatality risk.',
          })
        );
      });
    };

    // Create a temporary safety report in database
    const testReport = await prisma.safetyReport.create({
      data: {
        description: 'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Digboi Test Unit',
        activity: 'Welding & Hot Work',
        status: ProcessingStatus.PENDING,
      },
    });

    const analysisResult = await analysisService.analyzeReport(testReport.id);

    assert(
      receivedPayload && receivedPayload.text === 'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.',
      'FastAPI receives only {"text": "..."} payload'
    );
    assert(
      receivedHeaders['content-type'] === 'application/json' && receivedHeaders['accept'] === 'application/json',
      'Headers contain Content-Type and Accept application/json'
    );
    assert(analysisResult.analysis.sifPotential === true, 'sifPotential correctly mapped to true');
    assert(analysisResult.analysis.riskLevel === 'HIGH', 'riskLevel mapped to HIGH');
    assert(analysisResult.analysis.probability === 0.88, 'probability mapped to 0.88');
    assert(
      JSON.stringify(analysisResult.analysis.hazards) === JSON.stringify(['welding', 'pipeline', 'pressure', 'gas']),
      'hazards array correctly persisted'
    );
    assert(
      JSON.stringify(analysisResult.analysis.exposures) === JSON.stringify(['worker']),
      'exposures array correctly persisted'
    );
    assert(
      JSON.stringify(analysisResult.analysis.controlFailures) === JSON.stringify(['before gas testing was completed']),
      'controlFailures array correctly persisted'
    );
    assert(
      JSON.stringify(analysisResult.analysis.iogpRules) === JSON.stringify(['Hot Work', 'Energy Isolation', 'Work Authorization']),
      'iogpRules array correctly persisted'
    );

    // Verify report status in DB updated to ANALYZED
    const updatedReport = await prisma.safetyReport.findUnique({ where: { id: testReport.id } });
    assert(updatedReport?.status === ProcessingStatus.ANALYZED, 'SafetyReport status updated to ANALYZED in database');

    // -------------------------------------------------------------
    // TEST 2: Already analyzed report returns existing analysis
    // -------------------------------------------------------------
    console.log('\n--- 2. Existing Analysis Caching ---');
    const cachedResult = await analysisService.analyzeReport(testReport.id, false);
    assert(cachedResult.isExisting === true, 'Returns isExisting: true without re-invoking AI');

    // -------------------------------------------------------------
    // TEST 3: Report ID does not exist (404)
    // -------------------------------------------------------------
    console.log('\n--- 3. Non-existent Report ID (404) ---');
    try {
      await analysisService.analyzeReport('00000000-0000-0000-0000-000000000000');
      assert(false, 'Should throw NotFoundError for non-existent report');
    } catch (err: any) {
      assert(err.statusCode === 404 && err.code === 'NOT_FOUND', 'Throws NotFoundError (404)');
    }

    // -------------------------------------------------------------
    // TEST 4: FastAPI Service is Stopped / Unreachable (503)
    // -------------------------------------------------------------
    console.log('\n--- 4. Unreachable AI Service (503) ---');
    const unreachableAi = new RealAIAnalysisService('http://127.0.0.1:59999', 1000);
    const unreachableService = new AnalysisService(unreachableAi);

    const testReport2 = await prisma.safetyReport.create({
      data: {
        description: 'Testing connection failure scenario.',
        reportType: ReportType.NEAR_MISS,
        site: 'Test Facility',
        activity: 'Lifting',
      },
    });

    try {
      await unreachableService.analyzeReport(testReport2.id);
      assert(false, 'Should fail when AI service is offline');
    } catch (err: any) {
      assert(err.statusCode === 503 && err.code === 'AI_SERVICE_UNAVAILABLE', 'Throws AppError (503 AI_SERVICE_UNAVAILABLE)');
      const failedReport = await prisma.safetyReport.findUnique({ where: { id: testReport2.id } });
      assert(failedReport?.status === ProcessingStatus.FAILED, 'SafetyReport status set to FAILED in database');
    }

    // -------------------------------------------------------------
    // TEST 5: FastAPI returns invalid JSON (502)
    // -------------------------------------------------------------
    console.log('\n--- 5. Malformed JSON response (502) ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('<html><head><title>Error</title></head><body>Bad Gateway</body></html>');
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail on invalid JSON');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 INVALID_AI_OUTPUT for malformed JSON');
    }

    // -------------------------------------------------------------
    // TEST 6: sif_probability > 1 (Zod validation failure)
    // -------------------------------------------------------------
    console.log('\n--- 6. Schema Failure: sif_probability > 1 ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sif_probability: 1.88, // Invalid! > 1
          sif_potential: true,
          confidence: 0.95,
          risk_level: 'HIGH',
          iogp_rules: ['Hot Work'],
          hazards: ['fire'],
          exposure: ['worker'],
          control_failures: ['bypass'],
          potential_consequence: 'Explosion',
          explanation: 'Valid explanation text.',
        })
      );
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail when sif_probability > 1');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 for sif_probability > 1');
    }

    // -------------------------------------------------------------
    // TEST 7: confidence < 0 (Zod validation failure)
    // -------------------------------------------------------------
    console.log('\n--- 7. Schema Failure: confidence < 0 ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sif_probability: 0.5,
          sif_potential: false,
          confidence: -0.2, // Invalid! < 0
          risk_level: 'LOW',
          iogp_rules: [],
          hazards: [],
          exposure: [],
          control_failures: [],
          potential_consequence: 'Minor',
          explanation: 'Valid explanation.',
        })
      );
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail when confidence < 0');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 for confidence < 0');
    }

    // -------------------------------------------------------------
    // TEST 8: risk_level has invalid value (Zod validation failure)
    // -------------------------------------------------------------
    console.log('\n--- 8. Schema Failure: invalid risk_level ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sif_probability: 0.5,
          sif_potential: false,
          confidence: 0.8,
          risk_level: 'EXTREME_DANGER', // Invalid enum!
          iogp_rules: [],
          hazards: [],
          exposure: [],
          control_failures: [],
          potential_consequence: 'Damage',
          explanation: 'Valid explanation.',
        })
      );
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail when risk_level is invalid');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 for invalid risk_level');
    }

    // -------------------------------------------------------------
    // TEST 9: Missing required field (explanation missing)
    // -------------------------------------------------------------
    console.log('\n--- 9. Schema Failure: missing required explanation ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sif_probability: 0.88,
          sif_potential: true,
          confidence: 0.95,
          risk_level: 'HIGH',
          iogp_rules: ['Hot Work'],
          hazards: ['gas'],
          exposure: ['worker'],
          control_failures: ['bypass'],
          potential_consequence: 'Explosion',
          // explanation is omitted
        })
      );
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail when explanation is missing');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 when explanation is missing');
    }

    // -------------------------------------------------------------
    // TEST 10: Array contains wrong data type (numbers instead of strings)
    // -------------------------------------------------------------
    console.log('\n--- 10. Schema Failure: wrong array item types ---');
    currentServerHandler = (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sif_probability: 0.88,
          sif_potential: true,
          confidence: 0.95,
          risk_level: 'HIGH',
          iogp_rules: [123, 456], // Invalid: numbers instead of strings
          hazards: ['gas'],
          exposure: ['worker'],
          control_failures: ['bypass'],
          potential_consequence: 'Explosion',
          explanation: 'Valid explanation.',
        })
      );
    };

    try {
      await analysisService.analyzeReport(testReport2.id, true);
      assert(false, 'Should fail when array contains non-string elements');
    } catch (err: any) {
      assert(err.statusCode === 502 && err.code === 'INVALID_AI_OUTPUT', 'Throws 502 when array contains invalid types');
    }

    // -------------------------------------------------------------
    // TEST 11: Mock AI Still Works Cleanly
    // -------------------------------------------------------------
    console.log('\n--- 11. Mock AI Verification ---');
    const mockService = new AnalysisService(mockAiService);
    const testReport3 = await prisma.safetyReport.create({
      data: {
        description: 'Scaffolding pipe fell from 10 meters height missing workers.',
        reportType: ReportType.NEAR_MISS,
        site: 'Numaligarh Terminal',
        activity: 'Working at Height',
      },
    });

    const mockResult = await mockService.analyzeReport(testReport3.id);
    assert(mockResult.analysis.sifPotential !== undefined, 'Mock AI generates valid analysis');
    assert(Array.isArray(mockResult.analysis.hazards) && mockResult.analysis.hazards.length > 0, 'Mock AI provides mapped hazards');

    // Clean up test reports
    await prisma.safetyAnalysis.deleteMany({
      where: { reportId: { in: [testReport.id, testReport2.id, testReport3.id] } },
    });
    await prisma.safetyReport.deleteMany({
      where: { id: { in: [testReport.id, testReport2.id, testReport3.id] } },
    });

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((e) => {
  console.error('Test execution error:', e);
  process.exit(1);
});
