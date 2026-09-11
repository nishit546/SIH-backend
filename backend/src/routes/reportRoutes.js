const { Router } = require('express');
const { reportController } = require('../controllers/reportController');
const { validateRequest } = require('../middleware/validate');
const {
  authenticateJWT,
  requireAnalystOrAdmin,
  requireAdmin,
} = require('../middleware/authenticate');
const {
  createReportBodySchema,
  updateReportBodySchema,
  paginationQuerySchema,
  reportIdParamSchema,
} = require('../validators/reportSchemas');

const router = Router();

// Protect all report routes with JWT authentication
router.use(authenticateJWT);

// POST /api/reports - Create new report (All authenticated users: REPORTER, HSE_ANALYST, ADMIN)
router.post(
  '/',
  validateRequest({ body: createReportBodySchema }),
  (req, res, next) => reportController.createReport(req, res, next)
);

// GET /api/reports - Get paginated and filtered reports (All authenticated users)
router.get(
  '/',
  validateRequest({ query: paginationQuerySchema }),
  (req, res, next) => reportController.getReports(req, res, next)
);

// GET /api/reports/:id - Get single report by UUID (All authenticated users)
router.get(
  '/:id',
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.getReportById(req, res, next)
);

// PUT /api/reports/:id - Full/partial update report (Reporter on own report, Analyst/Admin on any)
router.put(
  '/:id',
  validateRequest({ params: reportIdParamSchema, body: updateReportBodySchema }),
  (req, res, next) => reportController.updateReport(req, res, next)
);

// PATCH /api/reports/:id - Partial update report (Reporter on own report, Analyst/Admin on any)
router.patch(
  '/:id',
  validateRequest({ params: reportIdParamSchema, body: updateReportBodySchema }),
  (req, res, next) => reportController.updateReport(req, res, next)
);

// POST /api/reports/:id/analyze - Trigger AI SIF analysis (HSE_ANALYST, ADMIN)
router.post(
  '/:id/analyze',
  requireAnalystOrAdmin,
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.analyzeReport(req, res, next)
);

// DELETE /api/reports/:id - Delete report by UUID (ADMIN only)
router.delete(
  '/:id',
  requireAdmin,
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.deleteReport(req, res, next)
);

module.exports = router;
