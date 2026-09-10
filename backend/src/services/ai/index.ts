import { IAIAnalysisService } from './aiService.interface';
import { mockAiService } from './mockAiService';
import { realAiService } from './realAiService';
import { aiConfig } from '../../config/aiConfig';

export * from './aiService.interface';
export * from './mockAiService';
export * from './realAiService';

/**
 * Factory to resolve the active AI service implementation based on configuration or explicit parameter
 */
export function getAiService(provider: 'mock' | 'real' = aiConfig.provider): IAIAnalysisService {
  if (provider === 'real') {
    return realAiService;
  }
  return mockAiService;
}
