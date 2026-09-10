import { ReportType, ProcessingStatus } from '@prisma/client';

export interface CreateReportDTO {
  description?: string;
  reportText?: string; // Support reportText as alias for description
  reportType: ReportType;
  site: string;
  department?: string;
  activity: string;
  contractorType?: string;
  workPhase?: string;
  eventDate?: string | Date;
  reporterId?: string;
  sourceMetadata?: Record<string, unknown>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
