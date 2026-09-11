const { Router } = require('express');
const { safetyReportMongoController } = require('../controllers/safetyReportMongoController');
const { authenticateJWT } = require('../middleware/authenticate');
const { requireRole } = require('../middleware/authorize');

const router = Router();

/**
 * MongoDB REST API Routes for SafetyReport
 * Base Path: /api/mongo/reports (or /api/safety-reports)
 */

// POST / - Create a new safety report in MongoDB (Authenticated: REVIEWER, ANALYST, MANAGER, ADMIN)
router.post(
  '/',
  authenticateJWT,
  requireRole('REVIEWER', 'ANALYST', 'MANAGER', 'ADMIN'),
  (req, res, next) => safetyReportMongoController.createReport(req, res, next)
);

// GET / - Get all safety reports from MongoDB (Authenticated: REVIEWER, ANALYST, MANAGER, ADMIN)
router.get(
  '/',
  authenticateJWT,
  requireRole('REVIEWER', 'ANALYST', 'MANAGER', 'ADMIN'),
  (req, res, next) => safetyReportMongoController.getReports(req, res, next)
);

// GET /:id - Get a single safety report by ID
router.get(
  '/:id',
  authenticateJWT,
  requireRole('REVIEWER', 'ANALYST', 'MANAGER', 'ADMIN'),
  (req, res, next) => safetyReportMongoController.getReportById(req, res, next)
);

// PUT /:id - Update a safety report by ID (MANAGER, ADMIN)
router.put(
  '/:id',
  authenticateJWT,
  requireRole('MANAGER', 'ADMIN'),
  (req, res, next) => safetyReportMongoController.updateReport(req, res, next)
);

// DELETE /:id - Delete a safety report by ID (ADMIN only)
router.delete(
  '/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  (req, res, next) => safetyReportMongoController.deleteReport(req, res, next)
);

module.exports = router;
