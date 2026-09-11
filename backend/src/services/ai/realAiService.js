const { realAiRequestSchema, realAiResponseSchema } = require('../../validators/aiSchemas');
const { aiConfig } = require('../../config/aiConfig');
const { normalizeIogpRules } = require('../../utils/iogpRules');
const { aiResponseAdapter } = require('./aiResponseAdapter');
const { AppError } = require('../../utils/errors');
const { RiskLevel } = require('@prisma/client');

class RealAIAnalysisService {
  constructor(serviceUrl = aiConfig.serviceUrl, timeoutMs = aiConfig.timeoutMs) {
    this.serviceUrl = serviceUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Invokes the real FastAPI SIF Precursor AI Service: POST /api/analyze
   * Sends ONLY the raw report narrative/text.
   */
  async analyzeReport(input) {
    const reportText = input.reportText?.trim();

    if (!reportText) {
      throw new AppError('Safety report narrative text cannot be empty', 400, 'EMPTY_REPORT_TEXT');
    }

    // 1. Validate outgoing request payload strictly
    const requestPayload = { text: reportText };
    const requestValidation = realAiRequestSchema.safeParse(requestPayload);
    if (!requestValidation.success) {
      throw new AppError(
        'Invalid report text provided for AI analysis',
        400,
        'INVALID_AI_INPUT',
        requestValidation.error.issues
      );
    }

    const endpoint = `${this.serviceUrl}/api/analyze`;
    console.log(`[AI Service] Sending analysis request to ${endpoint}`);

    let response;
    let rawJson;

    try {
      // 2. Execute HTTP POST with AbortSignal timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (networkError) {
      if (networkError.name === 'AbortError' || networkError.code === 'ABORT_ERR') {
        console.error(`[AI Service] Timeout after ${this.timeoutMs}ms calling ${endpoint}`);
        throw new AppError(
          'AI analysis service timed out',
          504,
          'AI_SERVICE_TIMEOUT'
        );
      }

      console.error(`[AI Service] Connection error to ${endpoint}:`, networkError.message || networkError);
      throw new AppError(
        'AI analysis service is currently unavailable',
        503,
        'AI_SERVICE_UNAVAILABLE'
      );
    }

    console.log(`[AI Service] Received response with status ${response.status}`);

    // 3. Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore read failure
      }

      console.error(`[AI Service] Error HTTP ${response.status} from ${endpoint}:`, errorBody);
      throw new AppError(
        `AI analysis service returned HTTP ${response.status}`,
        response.status >= 500 ? 502 : 400,
        'AI_SERVICE_ERROR'
      );
    }

    // 4. Parse JSON body
    try {
      rawJson = await response.json();
    } catch (parseError) {
      console.error('[AI Service] Failed to parse JSON response:', parseError);
      throw new AppError(
        'AI analysis service returned an invalid response structure',
        502,
        'INVALID_AI_OUTPUT'
      );
    }

    // 5. Validate the RAW AI response using Zod schema
    const validationResult = await realAiResponseSchema.safeParseAsync(rawJson);

    if (!validationResult.success) {
      console.error('[AI Service] Response schema validation failed:', validationResult.error.issues);
      throw new AppError(
        'AI analysis service returned a response that does not match the expected schema',
        502,
        'INVALID_AI_OUTPUT',
        validationResult.error.issues
      );
    }

    console.log('[AI Service] AI response validated successfully');
    const aiData = validationResult.data;

    // 6. Use dedicated AIResponseAdapter for transformation
    const adaptedContract = aiResponseAdapter.adaptToContract(aiData);
    const normalizedResult = aiResponseAdapter.adaptToPrisma(adaptedContract, {
      modelVersion: aiConfig.modelVersion,
      ontologyVersion: 'v1.0.0',
      rawResponse: rawJson,
    });

    return normalizedResult;
  }

  /**
   * Primary interface method: analyze(text: string)
   * Evaluates a safety report observation narrative string
   */
  async analyze(text) {
    return this.analyzeReport({ reportText: text });
  }

  /**
   * Optional batch analysis method for future bulk processing: POST /api/analyze/batch
   */
  async analyzeBatch(reports) {
    if (!Array.isArray(reports) || reports.length === 0) {
      throw new AppError('Reports array cannot be empty for batch analysis', 400, 'EMPTY_BATCH');
    }

    const endpoint = `${this.serviceUrl}/api/analyze/batch`;
    console.log(`[AI Service] Sending batch request with ${reports.length} reports to ${endpoint}`);

    const payload = {
      reports: reports.map((r) => ({
        id: r.id,
        text: r.description || r.text || '',
      })),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs * 2);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AppError(`Batch AI service returned HTTP ${response.status}`, 502, 'AI_BATCH_ERROR');
      }

      return await response.json();
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('AI batch service is currently unavailable', 503, 'AI_SERVICE_UNAVAILABLE');
    }
  }
}

const realAiService = new RealAIAnalysisService();

module.exports = {
  RealAIAnalysisService,
  realAiService,
};
