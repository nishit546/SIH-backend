const { reportService } = require('../services/reportService');
const { analysisService } = require('../services/analysisService');

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
   * GET /api/reports
   * Retrieve a paginated list of safety reports
   */
  async getReports(req, res, next) {
    try {
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

      const result = await reportService.getReports(page, limit);

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
}

const reportController = new ReportController();

module.exports = {
  ReportController,
  reportController,
};
