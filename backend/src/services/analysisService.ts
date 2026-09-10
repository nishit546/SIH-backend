import prisma from '../config/database';
import { IAIAnalysisService } from './ai/aiService.interface';
import { getAiService } from './ai';
import { AIAnalysisInput } from '../types/ai.types';
import { aiAnalysisResultSchema } from '../validators/aiSchemas';
import { AppError, NotFoundError } from '../utils/errors';
import { ProcessingStatus, RiskLevel, SafetyAnalysis } from '@prisma/client';
import { aiConfig } from '../config/aiConfig';

export class AnalysisService {
  private aiService: IAIAnalysisService;

  constructor(aiService: IAIAnalysisService = getAiService()) {
    this.aiService = aiService;
  }

  /**
   * Allows dynamically injecting or swapping the AI analysis implementation
   */
  public setAIService(aiService: IAIAnalysisService): void {
    this.aiService = aiService;
  }

  /**
   * Allows selecting the AI provider dynamically ('mock' | 'real')
   */
  public setProvider(provider: 'mock' | 'real'): void {
    this.aiService = getAiService(provider);
  }

  /**
   * Orchestrates the AI analysis pipeline for a specific SafetyReport
   * @param reportId UUID of the SafetyReport to analyze
   * @param forceReanalyze If true, allows generating a new analysis version even if already analyzed
   */
  async analyzeReport(
    reportId: string,
    forceReanalyze: boolean = false
  ): Promise<{ reportId: string; analysis: SafetyAnalysis; isExisting?: boolean }> {
    // 1. Fetch SafetyReport from database
    const report = await prisma.safetyReport.findUnique({
      where: { id: reportId },
      include: {
        analyses: {
          where: { isLatest: true },
        },
      },
    });

    if (!report) {
      throw new NotFoundError(`Safety report with ID "${reportId}" was not found`);
    }

    // 2. Check if already analyzed
    if (!forceReanalyze && report.analyses && report.analyses.length > 0) {
      // Return existing analysis without re-running AI or mutating records
      return {
        reportId: report.id,
        analysis: report.analyses[0],
        isExisting: true,
      };
    }

    // 3. Update report status to ANALYZING
    await prisma.safetyReport.update({
      where: { id: report.id },
      data: { status: ProcessingStatus.ANALYZING },
    });

    // 4. Construct AI Input Contract strictly from raw report fields
    const aiInput: AIAnalysisInput = {
      reportId: report.id,
      reportNumber: report.reportNumber,
      reportText: report.description,
      reportType: report.reportType,
      site: report.site,
      department: report.department,
      activity: report.activity,
      contractorType: report.contractorType,
      workPhase: report.workPhase,
      eventDate: report.eventDate,
    };

    let rawAiResult;
    try {
      // 5. Invoke the decoupled AI service abstraction (Real or Mock)
      rawAiResult = await this.aiService.analyzeReport(aiInput);
    } catch (aiError: any) {
      // Cleanly mark report as FAILED in database without leaving hanging ANALYZING state
      await prisma.safetyReport.update({
        where: { id: report.id },
        data: { status: ProcessingStatus.FAILED },
      });

      if (aiError instanceof AppError) {
        throw aiError;
      }

      console.error(`Unexpected AI service error while analyzing report ${reportId}:`, aiError);
      throw new AppError(
        'AI analysis service failed to process the safety report',
        502,
        'AI_SERVICE_ERROR',
        { details: aiError.message }
      );
    }

    // 6. Validate AI response with Zod before saving to PostgreSQL
    const validationResult = await aiAnalysisResultSchema.safeParseAsync(rawAiResult);

    if (!validationResult.success) {
      console.error(`AI response validation failed for report ${reportId}:`, validationResult.error.issues);
      await prisma.safetyReport.update({
        where: { id: report.id },
        data: { status: ProcessingStatus.FAILED },
      });
      throw new AppError(
        'AI engine returned an invalid response structure that could not be validated',
        502,
        'INVALID_AI_OUTPUT',
        validationResult.error.issues
      );
    }

    const validatedAnalysis = validationResult.data;

    // 7. Persist analysis to Database in a transaction
    const savedAnalysis = await prisma.$transaction(async (tx) => {
      // Mark any existing analyses for this report as not latest
      await tx.safetyAnalysis.updateMany({
        where: { reportId: report.id, isLatest: true },
        data: { isLatest: false },
      });

      // Insert new SafetyAnalysis record
      const createdAnalysis = await tx.safetyAnalysis.create({
        data: {
          reportId: report.id,
          sifPotential: validatedAnalysis.sifPotential,
          probability: validatedAnalysis.confidence,
          riskLevel: validatedAnalysis.riskLevel as RiskLevel,
          hazards: validatedAnalysis.hazards,
          exposures: validatedAnalysis.exposures,
          criticalControls: validatedAnalysis.criticalControls || [],
          controlFailures: validatedAnalysis.controlFailures,
          barrierStatus: validatedAnalysis.barrierStatus || null,
          potentialConsequences: validatedAnalysis.potentialConsequences,
          iogpRules: validatedAnalysis.iogpRules,
          explanation: validatedAnalysis.explanation,
          modelVersion: validatedAnalysis.modelVersion || aiConfig.modelVersion,
          ontologyVersion: validatedAnalysis.ontologyVersion || 'v1.0.0',
          isLatest: true,
          rawResponse: validatedAnalysis.rawResponse ? (validatedAnalysis.rawResponse as any) : undefined,
        },
      });

      // Update SafetyReport status to ANALYZED
      await tx.safetyReport.update({
        where: { id: report.id },
        data: { status: ProcessingStatus.ANALYZED },
      });

      return createdAnalysis;
    });

    return {
      reportId: report.id,
      analysis: savedAnalysis,
      isExisting: false,
    };
  }
}

export const analysisService = new AnalysisService();
