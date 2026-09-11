const dotenv = require('dotenv');

dotenv.config();

const aiConfig = {
  provider: process.env.AI_PROVIDER?.toLowerCase() === 'real' ? 'real' : 'mock',
  serviceUrl: (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, ''),
  timeoutMs: parseInt(process.env.AI_SERVICE_TIMEOUT_MS || process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10),
  modelVersion: process.env.AI_MODEL_VERSION || 'fastapi-sif-nlp-v1',
};

module.exports = {
  aiConfig,
};
