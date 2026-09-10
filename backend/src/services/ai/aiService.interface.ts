import { AIAnalysisInput, AIAnalysisResult } from '../../types/ai.types';

export interface IAIAnalysisService {
  /**
   * Process a single safety report input and return structured SIF precursor analysis
   * @param input Normalized safety report observation details
   * @returns Structured prediction matching AIAnalysisResult contract
   */
  analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}
