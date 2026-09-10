import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { DashboardFilterQuery, LimitFilterQuery, TrendFilterQuery } from '../types/dashboard.types';

export class DashboardController {
  /**
   * GET /api/dashboard/summary
   */
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getSummary(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/sif-distribution
   */
  async getSifDistribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getSifDistribution(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/risk-distribution
   */
  async getRiskDistribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getRiskDistribution(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/hazards
   */
  async getHazards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as LimitFilterQuery;
      const data = await dashboardService.getHazards(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/iogp-rules
   */
  async getIogpRules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as LimitFilterQuery;
      const data = await dashboardService.getIogpRules(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/report-types
   */
  async getReportTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getReportTypes(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/sites
   */
  async getSites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getSites(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/departments
   */
  async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getDepartments(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/activities
   */
  async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as DashboardFilterQuery;
      const data = await dashboardService.getActivities(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/trends
   */
  async getTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as TrendFilterQuery;
      const data = await dashboardService.getTrends(filters);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
