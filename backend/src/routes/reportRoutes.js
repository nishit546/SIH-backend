const { Router } = require('express');
const { reportController } = require('../controllers/reportController');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/authenticate');
const { requireRole } = require('../middleware/authorize');
const { UserRole } = require('@prisma/client');
const {
  createReportBodySchema,
  paginationQuerySchema,
  reportIdParamSchema,
} = require('../validators/reportSchemas');

const router = Router();

// Protect all report endpoints with JWT authentication
router.use(authenticateJWT);

// POST /api/reports - Create new report (REVIEWER, ANALYST, MANAGER, ADMIN)
router.post(
  '/',
  requireRole(UserRole.REVIEWER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN),
  validateRequest({ body: createReportBodySchema }),
  (req, res, next) => reportController.createReport(req, res, next)
);

// GET /api/reports - Get paginated reports (REVIEWER, ANALYST, MANAGER, ADMIN)
router.get(
  '/',
  requireRole(UserRole.REVIEWER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN),
  validateRequest({ query: paginationQuerySchema }),
  (req, res, next) => reportController.getReports(req, res, next)
);

// GET /api/reports/:id - Get single report by UUID (REVIEWER, ANALYST, MANAGER, ADMIN)
router.get(
  '/:id',
  requireRole(UserRole.REVIEWER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN),
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.getReportById(req, res, next)
);

// POST /api/reports/:id/analyze - Trigger AI SIF analysis (REVIEWER, ANALYST, MANAGER, ADMIN)
router.post(
  '/:id/analyze',
  requireRole(UserRole.REVIEWER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN),
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.analyzeReport(req, res, next)
);

// DELETE /api/reports/:id - Delete report by UUID (ADMIN only)
router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.deleteReport(req, res, next)
);

module.exports = router;
