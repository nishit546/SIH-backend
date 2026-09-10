import { IAIAnalysisService } from './aiService.interface';
import { AIAnalysisInput, AIAnalysisResult } from '../../types/ai.types';
import { realAiRequestSchema, realAiResponseSchema } from '../../validators/aiSchemas';
import { aiConfig } from '../../config/aiConfig';
import { AppError } from '../../utils/errors';
import { RiskLevel } from '@prisma/client';

export class RealAIAnalysisService implements IAIAnalysisService {
  private serviceUrl: string;
  private timeoutMs: number;

  constructor(serviceUrl: string = aiConfig.serviceUrl, timeoutMs: number = aiConfig.timeoutMs) {
    this.serviceUrl = serviceUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Invokes the real FastAPI SIF Precursor AI Service (POST /api/analyze)
   * Sends ONLY the raw report narrative/text.
   */
  async analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult> {
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

    let response: Response;
    let rawJson: unknown;

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
    } catch (networkError: any) {
      if (networkError.name === 'AbortError' || networkError.code === 'ABORT_ERR') {
        console.error(`AI service timed out after ${this.timeoutMs}ms calling ${endpoint}`);
        throw new AppError(
          `AI analysis service timed out after ${this.timeoutMs}ms`,
          504,
          'AI_SERVICE_TIMEOUT'
        );
      }

      console.error(`Failed to reach AI service at ${endpoint}:`, networkError.message || networkError);
      throw new AppError(
        `AI analysis service is unreachable at ${this.serviceUrl}`,
        503,
        'AI_SERVICE_UNAVAILABLE',
        { originalError: networkError.message || 'Connection refused' }
      );
    }

    // 3. Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorBody: string = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore read failure
      }

      console.error(`AI service error (${response.status}) at ${endpoint}:`, errorBody);
      throw new AppError(
        `AI analysis service returned HTTP ${response.status}`,
        response.status >= 500 ? 502 : 400,
        'AI_SERVICE_ERROR',
        { status: response.status, responseBody: errorBody }
      );
    }

    // 4. Parse JSON body
    try {
      rawJson = await response.json();
    } catch (parseError: any) {
      console.error('Failed to parse AI service JSON response:', parseError);
      throw new AppError(
        'AI analysis service returned an unparseable or malformed JSON response',
        502,
        'INVALID_AI_OUTPUT'
      );
    }

    // 5. Validate the RAW AI response using Zod schema
    const validationResult = await realAiResponseSchema.safeParseAsync(rawJson);

    if (!validationResult.success) {
      console.error('Real AI response schema validation failed:', validationResult.error.issues);
      throw new AppError(
        'AI analysis service returned a response that does not match the expected schema',
        502,
        'INVALID_AI_OUTPUT',
        validationResult.error.issues
      );
    }

    const aiData = validationResult.data;

    // 6. Map snake_case FastAPI AI schema to the database-compatible AIAnalysisResult
    const mappedRiskLevel = (aiData.risk_level.toUpperCase() as RiskLevel) || RiskLevel.HIGH;

    const normalizedResult: AIAnalysisResult = {
      sifPotential: aiData.sif_potential,
      confidence: aiData.sif_probability, // Stored as probability (0.0 to 1.0)
      riskLevel: mappedRiskLevel,
      hazards: aiData.hazards,
      exposures: aiData.exposure,
      criticalControls: [], // Real AI does not produce critical_controls; do not invent values
      controlFailures: aiData.control_failures,
      barrierStatus: null, // Real AI does not produce barrierStatus; do not invent values
      potentialConsequences: aiData.potential_consequence ? [aiData.potential_consequence] : [],
      iogpRules: aiData.iogp_rules,
      explanation: aiData.explanation,
      modelVersion: aiConfig.modelVersion,
      ontologyVersion: 'v1.0.0',
      rawResponse: rawJson as Record<string, unknown>,
    };

    return normalizedResult;
  }
}

export const realAiService = new RealAIAnalysisService();
