import type { ReportType, RiskLevel, ProcessingStatus } from './safety.types';

export interface ReportFilterState {
  search: string;
  site: string;
  department: string;
  activity: string;
  reportType: ReportType | 'ALL';
  riskLevel: RiskLevel | 'ALL';
  sifPotential: 'ALL' | 'SIF_ONLY' | 'NON_SIF';
  status: ProcessingStatus | 'ALL';
  fromDate?: string;
  toDate?: string;
}

export interface ReportPaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
