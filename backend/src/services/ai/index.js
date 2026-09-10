const { mockAiService } = require('./mockAiService');
const { realAiService } = require('./realAiService');
const { aiResponseAdapter } = require('./aiResponseAdapter');
const { aiConfig } = require('../../config/aiConfig');

/**
 * Factory to resolve the active AI service implementation based on configuration or explicit parameter
 */
function getAiService(provider = aiConfig.provider) {
  if (provider === 'real') {
    return realAiService;
  }
  return mockAiService;
}

module.exports = {
  mockAiService,
  realAiService,
  aiResponseAdapter,
  getAiService,
};
