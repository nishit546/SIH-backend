import { apiClient, ApiError } from '../api/apiClient';
import type {
  SafetyReportForm,
  SafetyReportSubmissionResult,
  SafetyReport,
  SafetyAnalysis
} from '../types/safety.types';
import { MOCK_REPORTS_LIST } from '../mock/mockReportsList';

export interface PaginatedReportsResponse {
  data: SafetyReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalysisResponsePayload {
  reportId: string;
  analysis: SafetyAnalysis;
  isExisting?: boolean;
  message?: string;
}

export interface IReportService {
  submitReport(formData: SafetyReportForm): Promise<SafetyReportSubmissionResult>;
  triggerAnalysis(reportId: string, force?: boolean): Promise<AnalysisResponsePayload>;
  getReportById(reportId: string): Promise<SafetyReport>;
  getReports(page?: number, limit?: number): Promise<PaginatedReportsResponse>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: string): boolean => UUID_REGEX.test(id);

/**
 * Real Backend API Implementation of Safety Report Service.
 * Communicates strictly with the Node.js backend.
 */
class RealReportService implements IReportService {
  async submitReport(formData: SafetyReportForm): Promise<SafetyReportSubmissionResult> {
    const payload = {
      description: formData.description.trim(),
      reportType: formData.reportType,
      site: formData.site.trim(),
      department: formData.department ? formData.department.trim() : null,
      activity: formData.activity.trim(),
      contractorType: formData.contractorType ? formData.contractorType.trim() : null,
      workPhase: formData.workPhase ? formData.workPhase.trim() : null,
      eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : new Date().toISOString()
    };

    const response = await apiClient.post<any>('/reports', payload);
    const reportData = response.data;

    const report: SafetyReport = {
      id: reportData.id,
      reportNumber: reportData.reportNumber || `REP-${reportData.id.slice(0, 8)}`,
      description: reportData.description,
      reportType: reportData.reportType,
      site: reportData.site,
      department: reportData.department,
      activity: reportData.activity,
      contractorType: reportData.contractorType,
      workPhase: reportData.workPhase,
      eventDate: reportData.eventDate || reportData.createdAt,
      status: reportData.status || 'PENDING',
      createdAt: reportData.createdAt || new Date().toISOString(),
      updatedAt: reportData.updatedAt || new Date().toISOString(),
      latestAnalysis: null
    };

    return {
      id: report.id,
      reportNumber: report.reportNumber,
      status: report.status,
      createdAt: report.createdAt,
      report
    };
  }

  async triggerAnalysis(reportId: string, force: boolean = false): Promise<AnalysisResponsePayload> {
    if (!isUuid(reportId)) {
      return mockReportService.triggerAnalysis(reportId);
    }

    const endpoint = `/reports/${encodeURIComponent(reportId)}/analyze`;
    const response = await apiClient.post<AnalysisResponsePayload>(
      endpoint,
      undefined,
      { params: force ? { force: 'true' } : undefined, timeoutMs: 35000 }
    );

    const { reportId: returnedId, analysis, isExisting, message } = response.data;

    const normalizedAnalysis: SafetyAnalysis = {
      id: analysis.id || `ana-${Date.now()}`,
      reportId: returnedId || reportId,
      sifPotential: Boolean(analysis.sifPotential),
      probability: typeof analysis.probability === 'number' ? analysis.probability : 0.85,
      riskLevel: analysis.riskLevel || 'HIGH',
      hazards: Array.isArray(analysis.hazards) ? analysis.hazards : [],
      exposures: Array.isArray(analysis.exposures) ? analysis.exposures : [],
      criticalControls: Array.isArray(analysis.criticalControls) ? analysis.criticalControls : [],
      controlFailures: Array.isArray(analysis.controlFailures) ? analysis.controlFailures : [],
      barrierStatus: analysis.barrierStatus || null,
      potentialConsequences: Array.isArray(analysis.potentialConsequences) ? analysis.potentialConsequences : [],
      iogpRules: Array.isArray(analysis.iogpRules) ? analysis.iogpRules : [],
      explanation: analysis.explanation || 'AI analysis completed.',
      modelVersion: analysis.modelVersion || 'sif-nlp-v2',
      isLatest: analysis.isLatest !== undefined ? analysis.isLatest : true,
      createdAt: analysis.createdAt || new Date().toISOString()
    };

    return {
      reportId: returnedId || reportId,
      analysis: normalizedAnalysis,
      isExisting,
      message
    };
  }

  async getReportById(reportId: string): Promise<SafetyReport> {
    if (!isUuid(reportId)) {
      return mockReportService.getReportById(reportId);
    }

    const response = await apiClient.get<any>(`/reports/${encodeURIComponent(reportId)}`);
    const raw = response.data;

    let latestAnalysis: SafetyAnalysis | null = null;
    if (raw.analyses && raw.analyses.length > 0) {
      const top = raw.analyses[0];
      latestAnalysis = {
        id: top.id,
        reportId: raw.id,
        sifPotential: Boolean(top.sifPotential),
        probability: typeof top.probability === 'number' ? top.probability : 0.85,
        riskLevel: top.riskLevel || 'HIGH',
        hazards: Array.isArray(top.hazards) ? top.hazards : [],
        exposures: Array.isArray(top.exposures) ? top.exposures : [],
        criticalControls: Array.isArray(top.criticalControls) ? top.criticalControls : [],
        controlFailures: Array.isArray(top.controlFailures) ? top.controlFailures : [],
        barrierStatus: top.barrierStatus || null,
        potentialConsequences: Array.isArray(top.potentialConsequences) ? top.potentialConsequences : [],
        iogpRules: Array.isArray(top.iogpRules) ? top.iogpRules : [],
        explanation: top.explanation || '',
        modelVersion: top.modelVersion || 'sif-nlp-v2',
        isLatest: top.isLatest ?? true,
        createdAt: top.createdAt
      };
    } else if (raw.latestAnalysis) {
      latestAnalysis = raw.latestAnalysis;
    }

    return {
      id: raw.id,
      reportNumber: raw.reportNumber || `REP-${raw.id.slice(0, 8)}`,
      description: raw.description,
      reportType: raw.reportType,
      site: raw.site,
      department: raw.department,
      activity: raw.activity,
      contractorType: raw.contractorType,
      workPhase: raw.workPhase,
      eventDate: raw.eventDate || raw.createdAt,
      status: raw.status || (latestAnalysis ? 'ANALYZED' : 'PENDING'),
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString(),
      latestAnalysis
    };
  }

  async getReports(page: number = 1, limit: number = 20): Promise<PaginatedReportsResponse> {
    const response = await apiClient.get<any>('/reports', { page, limit });
    const rawList = Array.isArray(response.data) ? response.data : [];

    const data: SafetyReport[] = rawList.map((raw: any) => {
      let latestAnalysis: SafetyAnalysis | null = null;
      if (raw.latestAnalysis) {
        latestAnalysis = raw.latestAnalysis;
      } else if (raw.analyses && raw.analyses.length > 0) {
        latestAnalysis = raw.analyses[0];
      }

      return {
        id: raw.id,
        reportNumber: raw.reportNumber || `REP-${raw.id.slice(0, 8)}`,
        description: raw.description,
        reportType: raw.reportType,
        site: raw.site,
        department: raw.department,
        activity: raw.activity,
        contractorType: raw.contractorType,
        workPhase: raw.workPhase,
        eventDate: raw.eventDate || raw.createdAt,
        status: raw.status || (latestAnalysis ? 'ANALYZED' : 'PENDING'),
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
        latestAnalysis
      };
    });

    return {
      data,
      pagination: response.pagination || {
        page,
        limit,
        total: data.length,
        totalPages: Math.max(1, Math.ceil(data.length / limit))
      }
    };
  }
}

/**
 * Mock Report Service implementation for fallback/testing without active backend.
 */
class MockReportService implements IReportService {
  async submitReport(formData: SafetyReportForm): Promise<SafetyReportSubmissionResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reportId = `rep-mock-${Date.now()}`;
    const reportNumber = `HSE-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const createdReport: SafetyReport = {
      id: reportId,
      reportNumber,
      description: formData.description,
      reportType: formData.reportType,
      site: formData.site,
      department: formData.department || null,
      activity: formData.activity,
      contractorType: formData.contractorType || null,
      workPhase: formData.workPhase || null,
      eventDate: formData.eventDate || now.split('T')[0],
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      latestAnalysis: null
    };

    return {
      id: reportId,
      reportNumber,
      status: 'PENDING',
      createdAt: now,
      report: createdReport
    };
  }

  async triggerAnalysis(reportId: string): Promise<AnalysisResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const analysis: SafetyAnalysis = {
      id: `ana-${Date.now()}`,
      reportId,
      sifPotential: true,
      probability: 0.88,
      riskLevel: 'HIGH',
      hazards: ['Energy Isolation (LOTO)', 'High Pressure Fluid Release'],
      exposures: ['Crush Injury', 'Line of Fire Trapping'],
      criticalControls: ['Double Block and Bleed Verification', 'Lockout Tagout Applied'],
      controlFailures: ['Zero Energy Verification Bypassed'],
      barrierStatus: 'DEGRADED',
      potentialConsequences: ['Permanent Disabling Injury', 'Hydrocarbon Release Flash'],
      iogpRules: ['Energy Isolation (LSR-01)', 'Line of Fire (LSR-02)'],
      explanation:
        'The operation involved breaking containment on a pressurized process line without prior positive pressure bleed-off confirmation, representing a severe SIF precursor.',
      modelVersion: 'fastapi-sif-nlp-v1',
      isLatest: true,
      createdAt: new Date().toISOString()
    };

    return {
      reportId,
      analysis
    };
  }

  async getReportById(reportId: string): Promise<SafetyReport> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const found = MOCK_REPORTS_LIST.find((r) => r.id === reportId);
    if (!found) {
      throw new ApiError(`Safety report with ID "${reportId}" was not found`, 404);
    }
    return found;
  }

  async getReports(page: number = 1, limit: number = 20): Promise<PaginatedReportsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const start = (page - 1) * limit;
    const paginated = MOCK_REPORTS_LIST.slice(start, start + limit);
    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: MOCK_REPORTS_LIST.length,
        totalPages: Math.ceil(MOCK_REPORTS_LIST.length / limit)
      }
    };
  }
}

// Check configuration flag: default to REAL backend service
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const realReportService = new RealReportService();
export const mockReportService = new MockReportService();

// Export active service singleton
export const reportService: IReportService = useMock ? mockReportService : realReportService;
