import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService';

export class ReportController {
  /**
   * POST /api/reports
   * Create a new safety report
   */
  async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdReport = await reportService.createReport(req.body);
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
  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

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
  async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
   * DELETE /api/reports/:id
   * Delete a safety report and related cascade records
   */
  async deleteReport(req: Request, res: Response, next: NextFunction): Promise<void> {
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

export const reportController = new ReportController();
