import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { validateRequest } from '../middleware/validate';
import {
  createReportBodySchema,
  paginationQuerySchema,
  reportIdParamSchema,
} from '../validators/reportSchemas';

const router = Router();

// POST /api/reports - Create new report with body validation
router.post(
  '/',
  validateRequest({ body: createReportBodySchema }),
  (req, res, next) => reportController.createReport(req, res, next)
);

// GET /api/reports - Get paginated reports with query validation
router.get(
  '/',
  validateRequest({ query: paginationQuerySchema }),
  (req, res, next) => reportController.getReports(req, res, next)
);

// GET /api/reports/:id - Get single report by UUID
router.get(
  '/:id',
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.getReportById(req, res, next)
);

// POST /api/reports/:id/analyze - Trigger AI SIF analysis
router.post(
  '/:id/analyze',
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.analyzeReport(req, res, next)
);

// DELETE /api/reports/:id - Delete report by UUID
router.delete(
  '/:id',
  validateRequest({ params: reportIdParamSchema }),
  (req, res, next) => reportController.deleteReport(req, res, next)
);

export default router;
