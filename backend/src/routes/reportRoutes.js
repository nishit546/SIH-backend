const { Router } = require('express');
const { reportController } = require('../controllers/reportController');
const { validateRequest } = require('../middleware/validate');
const {
  authenticateJWT,
  requireAnalystOrAdmin,
  requireAdmin,
  requireReporterOrAbove,
} = require('../middleware/authenticate');
const {
  createReportBodySchema,
  updateReportBodySchema,
  paginationQuerySchema,
  reportIdParamSchema,
} = require('../validators/reportSchemas');

const { uploadPdf, uploadAudio, uploadImage } = require('../middleware/uploadMiddleware');

const router = Router();

// Protect all report routes with JWT authentication
router.use(authenticateJWT);

// POST /api/reports/transcribe - Transcribe audio speech to text & detect/translate
router.post(
  '/transcribe',
  uploadAudio,
  (req, res, next) => reportController.transcribeAudio(req, res, next)
);

// POST /api/reports/ocr - Extract text from document photo via OpenCV & Tesseract
router.post(
  '/ocr',
  uploadImage,
  (req, res, next) => reportController.extractOcr(req, res, next)
);

// POST /api/reports/translate - Safety-preserved translation to English
router.post(
  '/translate',
  (req, res, next) => reportController.translateText(req, res, next)
);

// POST /api/reports/upload-pdf - Upload & analyze PDF report
router.post(
  '/upload-pdf',
  uploadPdf,
  (req, res, next) => reportController.uploadPdf(req, res, next)
);

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

// POST /api/reports/:id/analyze - Trigger AI SIF analysis (Reporter, Analyst, Manager, Admin)
router.post(
  '/:id/analyze',
  requireReporterOrAbove,
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
