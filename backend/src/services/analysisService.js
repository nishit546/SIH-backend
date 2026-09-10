const prisma = require('../config/database');
const { getAiService } = require('./ai');
const { aiAnalysisResultSchema } = require('../validators/aiSchemas');
const { ProcessingStatus } = require('@prisma/client');
const { aiConfig } = require('../config/aiConfig');
const { AppError, NotFoundError } = require('../utils/errors');

class AnalysisService {
  constructor(aiService = getAiService()) {
    this.aiService = aiService;
  }

  /**
   * Allows dynamically injecting or swapping the AI analysis implementation
   */
  setAIService(aiService) {
    this.aiService = aiService;
  }

  /**
   * Allows selecting the AI provider dynamically ('mock' | 'real')
   */
  setProvider(provider) {
    this.aiService = getAiService(provider);
  }

  /**
   * Orchestrates the AI analysis pipeline for a specific SafetyReport
   * @param reportId UUID of the SafetyReport to analyze
   * @param forceReanalyze If true, allows generating a new analysis version even if already analyzed
   */
  async analyzeReport(reportId, forceReanalyze = false) {
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

    console.log(`[AI Analysis] AI analysis started for report ID: ${report.id}`);

    // 4. Construct AI Input Contract strictly from raw report fields
    const aiInput = {
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
      console.log(`[AI Analysis] AI request completed for report ID: ${report.id}`);
    } catch (aiError) {
      // Cleanly mark report as FAILED in database without leaving hanging ANALYZING state
      await prisma.safetyReport.update({
        where: { id: report.id },
        data: { status: ProcessingStatus.FAILED },
      });

      console.warn(`[AI Analysis] AI service unavailable for report ID: ${report.id} - ${aiError.message}`);

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

    // 6. Validate AI response with Zod before saving
    const validationResult = await aiAnalysisResultSchema.safeParseAsync(rawAiResult);

    if (!validationResult.success) {
      console.error(`[AI Analysis] Response validation failed for report ID: ${reportId}:`, validationResult.error.issues);
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

    console.log(`[AI Analysis] AI response validated for report ID: ${report.id}`);
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
          probability: validatedAnalysis.probability !== undefined ? validatedAnalysis.probability : validatedAnalysis.confidence,
          riskLevel: validatedAnalysis.riskLevel,
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
          rawResponse: validatedAnalysis.rawResponse ? validatedAnalysis.rawResponse : undefined,
        },
      });

      // Update SafetyReport status to ANALYZED
      await tx.safetyReport.update({
        where: { id: report.id },
        data: { status: ProcessingStatus.ANALYZED },
      });

      return createdAnalysis;
    });

    console.log(`[AI Analysis] AI analysis saved for report ID: ${report.id}, analysis ID: ${savedAnalysis.id}`);

    return {
      reportId: report.id,
      analysis: savedAnalysis,
      isExisting: false,
    };
  }
}

const analysisService = new AnalysisService();

module.exports = {
  AnalysisService,
  analysisService,
};
