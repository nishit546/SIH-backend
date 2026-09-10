const { Router } = require('express');
const { authController } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/authenticate');
const {
  registerBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  logoutBodySchema,
} = require('../validators/authSchemas');

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
  '/register',
  validateRequest({ body: registerBodySchema }),
  (req, res, next) => authController.register(req, res, next)
);

// POST /api/auth/login - Authenticate existing user
router.post(
  '/login',
  validateRequest({ body: loginBodySchema }),
  (req, res, next) => authController.login(req, res, next)
);

// POST /api/auth/refresh - Rotate and refresh access token
router.post(
  '/refresh',
  validateRequest({ body: refreshTokenBodySchema }),
  (req, res, next) => authController.refresh(req, res, next)
);

// POST /api/auth/logout - Invalidate/revoke refresh token
router.post(
  '/logout',
  validateRequest({ body: logoutBodySchema }),
  (req, res, next) => authController.logout(req, res, next)
);

// GET /api/auth/me - Retrieve current authenticated user profile
router.get(
  '/me',
  authenticateJWT,
  (req, res, next) => authController.getMe(req, res, next)
);

module.exports = router;
