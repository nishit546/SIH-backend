const { Router } = require('express');
const { dashboardController } = require('../controllers/dashboardController');
const { validateRequest } = require('../middleware/validate');
const {
  dashboardFilterSchema,
  limitFilterSchema,
  trendFilterSchema,
} = require('../validators/dashboardSchemas');

const router = Router();

// 1. GET /api/dashboard/summary
router.get(
  '/summary',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getSummary(req, res, next)
);

// 2. GET /api/dashboard/sif-distribution
router.get(
  '/sif-distribution',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getSifDistribution(req, res, next)
);

// 3. GET /api/dashboard/risk-distribution
router.get(
  '/risk-distribution',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getRiskDistribution(req, res, next)
);

// 4. GET /api/dashboard/hazards
router.get(
  '/hazards',
  validateRequest({ query: limitFilterSchema }),
  (req, res, next) => dashboardController.getHazards(req, res, next)
);

// 5. GET /api/dashboard/iogp-rules
router.get(
  '/iogp-rules',
  validateRequest({ query: limitFilterSchema }),
  (req, res, next) => dashboardController.getIogpRules(req, res, next)
);

// 6. GET /api/dashboard/report-types
router.get(
  '/report-types',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getReportTypes(req, res, next)
);

// 7. GET /api/dashboard/sites
router.get(
  '/sites',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getSites(req, res, next)
);

// 8. GET /api/dashboard/departments
router.get(
  '/departments',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getDepartments(req, res, next)
);

// 9. GET /api/dashboard/activities
router.get(
  '/activities',
  validateRequest({ query: dashboardFilterSchema }),
  (req, res, next) => dashboardController.getActivities(req, res, next)
);

// 10. GET /api/dashboard/trends
router.get(
  '/trends',
  validateRequest({ query: trendFilterSchema }),
  (req, res, next) => dashboardController.getTrends(req, res, next)
);

module.exports = router;
