import dotenv from 'dotenv';

dotenv.config();

export interface AIConfig {
  provider: 'mock' | 'real';
  serviceUrl: string;
  timeoutMs: number;
  modelVersion: string;
}

export const aiConfig: AIConfig = {
  provider: (process.env.AI_PROVIDER?.toLowerCase() === 'real' ? 'real' : 'mock') as 'mock' | 'real',
  serviceUrl: (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, ''),
  timeoutMs: parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '10000', 10),
  modelVersion: process.env.AI_MODEL_VERSION || 'fastapi-sif-nlp-v1',
};
