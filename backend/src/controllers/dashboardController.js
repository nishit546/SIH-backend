const { dashboardService } = require('../services/dashboardService');

class DashboardController {
  /**
   * GET /api/dashboard/summary
   */
  async getSummary(req, res, next) {
    try {
      const data = await dashboardService.getSummary(req.query);
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
  async getSifDistribution(req, res, next) {
    try {
      const data = await dashboardService.getSifDistribution(req.query);
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
  async getRiskDistribution(req, res, next) {
    try {
      const data = await dashboardService.getRiskDistribution(req.query);
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
  async getHazards(req, res, next) {
    try {
      const data = await dashboardService.getHazards(req.query);
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
  async getIogpRules(req, res, next) {
    try {
      const data = await dashboardService.getIogpRules(req.query);
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
  async getReportTypes(req, res, next) {
    try {
      const data = await dashboardService.getReportTypes(req.query);
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
  async getSites(req, res, next) {
    try {
      const data = await dashboardService.getSites(req.query);
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
  async getDepartments(req, res, next) {
    try {
      const data = await dashboardService.getDepartments(req.query);
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
  async getActivities(req, res, next) {
    try {
      const data = await dashboardService.getActivities(req.query);
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
  async getTrends(req, res, next) {
    try {
      const data = await dashboardService.getTrends(req.query);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

const dashboardController = new DashboardController();

module.exports = {
  DashboardController,
  dashboardController,
};
