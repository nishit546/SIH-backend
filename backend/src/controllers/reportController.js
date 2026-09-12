const { reportService } = require('../services/reportService');
const { analysisService } = require('../services/analysisService');
const { multimodalService } = require('../services/multimodalService');

class ReportController {
  /**
   * POST /api/reports
   * Create a new safety report
   */
  async createReport(req, res, next) {
    try {
      const reportData = {
        ...req.body,
        reporterId: req.body.reporterId || req.user?.userId,
      };
      const createdReport = await reportService.createReport(reportData);
      res.status(201).json({
        success: true,
        data: createdReport,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reports/upload-pdf
   * Upload an incident report PDF, extract text, trigger AI analysis, and persist
   */
  async uploadPdf(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No PDF file was uploaded. Please upload a valid PDF document with form field name "pdf".',
            code: 'MISSING_FILE',
          },
        });
      }

      const metadata = {
        ...req.body,
        reporterId: req.body.reporterId || req.user?.userId,
      };

      const result = await reportService.createReportFromPdf(req.file, metadata);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports
   * Retrieve a paginated and filtered list of safety reports
   */
  async getReports(req, res, next) {
    try {
      const result = await reportService.getReports(req.query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/:id
   * Retrieve a single safety report by ID with full analysis history
   */
  async getReportById(req, res, next) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const report = await reportService.getReportById(id);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT/PATCH /api/reports/:id
   * Update an existing safety report
   */
  async updateReport(req, res, next) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await reportService.updateReport(id, req.body, req.user);

      res.status(200).json({
        success: true,
        message: 'Safety report updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reports/:id/analyze
   * Trigger AI/NLP SIF precursor analysis for a specific safety report
   */
  async analyzeReport(req, res, next) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const forceReanalyze = req.query.force === 'true';

      const result = await analysisService.analyzeReport(id, forceReanalyze);

      res.status(result.isExisting ? 200 : 201).json({
        success: true,
        data: {
          reportId: result.reportId,
          analysis: result.analysis,
          sifPotential: result.analysis.sifPotential,
          probability: result.analysis.probability,
          confidence: result.analysis.probability,
          risk: result.analysis.riskLevel,
          riskLevel: result.analysis.riskLevel,
          iogpRules: result.analysis.iogpRules,
          hazards: result.analysis.hazards,
          exposures: result.analysis.exposures,
          controlFailures: result.analysis.controlFailures,
          criticalControls: result.analysis.criticalControls,
          potentialConsequence: Array.isArray(result.analysis.potentialConsequences)
            ? result.analysis.potentialConsequences[0] || ''
            : '',
          potentialConsequences: result.analysis.potentialConsequences,
          explanation: result.analysis.explanation,
          ...(result.isExisting ? { isExisting: true, message: 'Returned existing report analysis' } : {}),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/reports/:id
   * Delete a safety report and related cascade records
   */
  async deleteReport(req, res, next) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await reportService.deleteReport(id);

      res.status(200).json({
        success: true,
        message: 'Safety report deleted successfully',
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reports/transcribe
   * Transcribe audio recording via Whisper base model & detect language / translate
   */
  async transcribeAudio(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No audio file was uploaded. Please upload a valid audio recording with form field name "audio".',
            code: 'MISSING_FILE',
          },
        });
      }

      const languageHint = req.body.languageHint || req.body.language_hint || null;
      const result = await multimodalService.transcribeAudio(
        req.file.buffer,
        req.file.originalname,
        languageHint
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reports/ocr
   * Extract text from paper safety report or photo via OpenCV + Tesseract OCR
   */
  async extractOcr(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No document image was uploaded. Please upload an image with form field name "image".',
            code: 'MISSING_FILE',
          },
        });
      }

      const result = await multimodalService.extractImageOcr(
        req.file.buffer,
        req.file.originalname
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reports/translate
   * Deterministically translate non-English safety text to English preserving negations
   */
  async translateText(req, res, next) {
    try {
      const { text, sourceLang, source_lang, targetLang, target_lang } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Text to translate cannot be empty',
            code: 'EMPTY_TEXT',
          },
        });
      }

      const result = await multimodalService.translateText(
        text,
        sourceLang || source_lang || 'auto',
        targetLang || target_lang || 'en'
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

const reportController = new ReportController();

module.exports = {
  ReportController,
  reportController,
};
