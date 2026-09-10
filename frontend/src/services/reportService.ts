import type {
  SafetyReportForm,
  SafetyReportSubmissionResult,
  SafetyReport,
  SafetyAnalysis
} from '../types/safety.types';

export interface IReportService {
  submitReport(formData: SafetyReportForm): Promise<SafetyReportSubmissionResult>;
  triggerAnalysis(reportId: string): Promise<SafetyAnalysis>;
}

class MockReportService implements IReportService {
  async submitReport(formData: SafetyReportForm): Promise<SafetyReportSubmissionResult> {
    // Simulate brief network delay
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

  async triggerAnalysis(reportId: string): Promise<SafetyAnalysis> {
    // Simulate AI pipeline execution time
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
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
      modelVersion: 'sif-nlp-v2.4-oilgas',
      isLatest: true,
      createdAt: new Date().toISOString()
    };
  }
}

export const reportService: IReportService = new MockReportService();
