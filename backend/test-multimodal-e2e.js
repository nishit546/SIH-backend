const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';

async function runMultimodalTests() {
  console.log('================================================================');
  console.log('SIF-GUARD MULTIMODAL SAFETY REPORT SYSTEM — END-TO-END TEST');
  console.log('Target Backend:', BASE_URL);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, details) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      if (details) console.error('   Details:', details);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Health Check
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: Health Diagnostics ---');
  const healthRes = await fetch(`${BASE_URL.replace('/api', '')}/health`);
  const healthData = await healthRes.json();
  assert(healthRes.ok, 'Backend Health Endpoint Responds (HTTP 200)');
  assert(healthData.database === 'connected', 'Database Connection is Healthy');
  assert(healthData.aiService?.status === 'operational', 'Real Python AI Service is Operational');
  console.log();

  // --------------------------------------------------------------------------
  // TEST 2: Authentication
  // --------------------------------------------------------------------------
  console.log('--- TEST 2: Authentication (JWT) ---');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'reviewer.demo@oilindia.in',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.ok && loginData.accessToken, 'Reviewer Authenticated Successfully');
  const token = loginData.accessToken;
  const authHeaders = { Authorization: `Bearer ${token}` };
  console.log(`Authenticated as: ${loginData.user?.name || loginData.user?.fullName} (${loginData.user?.role})\n`);

  // --------------------------------------------------------------------------
  // TEST 3: Multilingual Translation & Safety Negation Preservation
  // --------------------------------------------------------------------------
  console.log('--- TEST 3: Multilingual Safety Translation ---');
  const hindiInput = 'कामगार ने गैस टेस्ट किए बिना पाइपलाइन पर वेल्डिंग शुरू कर दी।';
  console.log('Input Hindi Narrative:', hindiInput);

  const transRes = await fetch(`${BASE_URL}/reports/translate`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: hindiInput,
      sourceLang: 'hi',
      targetLang: 'en',
    }),
  });
  const transData = await transRes.json();
  assert(transRes.ok, 'Translation Endpoint Responds (HTTP 200)');
  const translatedText = transData.data?.translated_text || '';
  console.log('Translated Output:', translatedText);
  assert(
    translatedText.toLowerCase().includes('welding') || translatedText.toLowerCase().includes('pipeline'),
    'Translation retains core safety activity terms'
  );
  assert(
    translatedText.toLowerCase().includes('without') ||
      translatedText.toLowerCase().includes('before') ||
      translatedText.toLowerCase().includes('not'),
    'CRITICAL SAFETY NEGATION PRESERVED (without/before/not)'
  );
  console.log();

  // --------------------------------------------------------------------------
  // TEST 4: Real Document OCR Extraction (OpenCV + Tesseract)
  // --------------------------------------------------------------------------
  console.log('--- TEST 4: Scanned Document OCR (OpenCV + Tesseract) ---');
  const imagePath = path.resolve(__dirname, 'test_safety_document.jpg');
  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('image', blob, 'test_safety_document.jpg');

    const ocrRes = await fetch(`${BASE_URL}/reports/ocr`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });
    const ocrData = await ocrRes.json();
    assert(ocrRes.ok, 'OCR Endpoint Responds (HTTP 200)');
    const extractedOcrText = ocrData.data?.ocr_text || ocrData.data?.canonical_text || '';
    console.log('Extracted OCR Text:\n' + extractedOcrText.trim());
    assert(extractedOcrText.length > 20, 'OCR extracts document text narrative');
    assert(
      extractedOcrText.includes('150 bar') || extractedOcrText.includes('150'),
      'CRITICAL SAFETY UNITS PRESERVED (150 bar)'
    );
    assert(
      extractedOcrText.includes('H2S') || extractedOcrText.includes('LOTO'),
      'CRITICAL SAFETY ACRONYMS PRESERVED (H2S / LOTO)'
    );
  } else {
    console.warn('⚠️ test_safety_document.jpg not found, skipping OCR test');
  }
  console.log();

  // --------------------------------------------------------------------------
  // TEST 5: Real Audio Speech-to-Text (Whisper Base STT)
  // --------------------------------------------------------------------------
  console.log('--- TEST 5: Audio Speech-to-Text (Local Whisper Model) ---');
  const audioPath = path.resolve(__dirname, 'test_voice_report.wav');
  if (fs.existsSync(audioPath)) {
    const audioBuffer = fs.readFileSync(audioPath);
    const audioForm = new FormData();
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });
    audioForm.append('audio', blob, 'test_voice_report.wav');

    const sttRes = await fetch(`${BASE_URL}/reports/transcribe`, {
      method: 'POST',
      headers: authHeaders,
      body: audioForm,
    });
    const sttData = await sttRes.json();
    assert(sttRes.ok, 'Audio STT Endpoint Responds (HTTP 200)');
    const transcript = sttData.data?.canonical_text || sttData.data?.original_transcript || '';
    console.log('Transcribed Text:', transcript);
    console.log('Detected Language:', sttData.data?.detected_language);
    console.log('Latencies:', JSON.stringify(sttData.data?.latencies || {}));
    assert(transcript.length > 10, 'Whisper transcribes speech into text narrative');
    assert(
      transcript.toLowerCase().includes('welding') || transcript.toLowerCase().includes('pipeline'),
      'Speech transcription preserves safety activity terminology'
    );
    assert(
      transcript.toLowerCase().includes('without') || transcript.toLowerCase().includes('gas testing'),
      'CRITICAL SAFETY NEGATION PRESERVED in transcription'
    );
  } else {
    console.warn('⚠️ test_voice_report.wav not found, skipping STT test');
  }
  console.log();

  // --------------------------------------------------------------------------
  // TEST 6: Multimodal Report Draft Submission & MySQL Persistence
  // --------------------------------------------------------------------------
  console.log('--- TEST 6: Multimodal Report Creation with Source Metadata ---');
  const reportNarrative =
    'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.';

  const createRes = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: reportNarrative,
      reportType: 'UNSAFE_ACT',
      site: 'Duliajan Field HQ',
      activity: 'Hot Work / Welding',
      eventDate: new Date().toISOString(),
      sourceMetadata: {
        inputMethod: 'audio',
        originalLanguage: 'hi',
        originalTranscript: hindiInput,
        translated: true,
        translatedText: reportNarrative,
        audioUri: 'file:///data/user/0/host.exp.exponent/cache/recording.m4a',
      },
    }),
  });
  const createData = await createRes.json();
  assert(createRes.ok, 'Report Created Successfully in MySQL');
  const createdReport = createData.data;
  assert(Boolean(createdReport?.id), 'Report ID generated');
  assert(createdReport?.sourceMetadata?.inputMethod === 'audio', 'Multimodal sourceMetadata saved to MySQL');
  console.log(`Created Report ID: ${createdReport?.id} (${createdReport?.reportNumber})`);
  console.log('Saved sourceMetadata:', JSON.stringify(createdReport?.sourceMetadata));
  console.log();

  // --------------------------------------------------------------------------
  // TEST 7: Real DistilBERT SIF Safety Analysis Execution
  // --------------------------------------------------------------------------
  console.log('--- TEST 7: Real DistilBERT AI Safety Precursor Analysis ---');
  const analyzeRes = await fetch(`${BASE_URL}/reports/${createdReport.id}/analyze?force=true`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
  });
  const analyzeData = await analyzeRes.json();
  assert(analyzeRes.ok, 'Real AI Analysis Pipeline Completed (HTTP 200/201)');
  const analysis = analyzeData.data;
  assert(analysis.sifPotential === true, 'SIF Potential Precursor Detected as TRUE');
  assert(analysis.riskLevel === 'HIGH' || analysis.riskLevel === 'CRITICAL', `Risk Level Evaluated as ${analysis.riskLevel}`);
  assert(Array.isArray(analysis.hazards) && analysis.hazards.length > 0, 'Extracted Hazards populated');
  assert(Array.isArray(analysis.controlFailures) && analysis.controlFailures.length > 0, 'Control Failures detected');
  assert(Array.isArray(analysis.iogpRules) && analysis.iogpRules.length > 0, 'IOGP Life-Saving Rules mapped');
  assert(typeof analysis.explanation === 'string' && analysis.explanation.length > 10, 'XAI safety explanation provided');

  console.log('\n--- REAL MODEL SIF ANALYSIS RESULTS ---');
  console.log('SIF Precursor Flag:', analysis.sifPotential ? '⚠️ YES (HIGH RISK)' : 'NO');
  console.log('Calibrated Probability:', analysis.probability || analysis.confidence);
  console.log('Risk Level:', analysis.riskLevel);
  console.log('Detected Hazards:', analysis.hazards);
  console.log('Human Exposure:', analysis.exposures);
  console.log('Control Failures:', analysis.controlFailures);
  console.log('Mapped IOGP Rules:', analysis.iogpRules);
  console.log('AI Explanation:', analysis.explanation);
  console.log();

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMultimodalTests().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
