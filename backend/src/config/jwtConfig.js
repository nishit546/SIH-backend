const dotenv = require('dotenv');

dotenv.config();

const jwtConfig = {
  // Access Token Config (15m default)
  secret:
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    'sif_guard_default_jwt_access_secret_key',
  expiresIn:
    process.env.JWT_ACCESS_EXPIRES_IN ||
    process.env.JWT_EXPIRES_IN ||
    '15m',

  // Refresh Token Config (7d default)
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    process.env.REFRESH_TOKEN_SECRET ||
    'sif_guard_default_jwt_refresh_secret_key',
  refreshExpiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN ||
    process.env.REFRESH_TOKEN_EXPIRES_IN ||
    '7d',
};

module.exports = {
  jwtConfig,
};
