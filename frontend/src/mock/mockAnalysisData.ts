import type { AnalysisPageData } from '../types/analysis.types';

export const MOCK_ANALYSIS_DATA: AnalysisPageData = {
  report: {
    id: 'rep-001',
    reportNumber: 'HSE-2026-0941',
    description:
      'Maintenance worker started welding on a high pressure fuel gas pipeline before gas testing was completed.',
    reportType: 'UNSAFE_ACT',
    site: 'Digboi Refinery - Unit 4',
    department: 'Mechanical Maintenance',
    activity: 'Fuel Gas Pipeline Tie-In & Welding',
    contractorType: 'Direct EPC Contractor',
    workPhase: 'Live Execution & Hot Work',
    eventDate: '2026-09-09 14:30',
    status: 'ANALYZED'
  },
  analysis: {
    sifPotential: true,
    probability: 0.88,
    riskLevel: 'HIGH',
    hazards: [
      'welding',
      'pipeline',
      'pressure',
      'gas'
    ],
    exposures: [
      'worker'
    ],
    criticalControls: [],
    controlFailures: [
      'before gas testing was completed'
    ],
    barrierStatus: null,
    potentialConsequences: [
      'Catastrophic hydrocarbon fire/explosion and worker fatality'
    ],
    iogpRules: [
      'Hot Work',
      'Energy Isolation',
      'Work Authorization'
    ],
    explanation:
      'Critical Triad detected: Hot work commenced on pressurized gas infrastructure without mandatory pre-entry atmospheric clearance. Severe barrier failure with immediate fatality risk.',
    modelVersion: 'fastapi-sif-nlp-v1',
    ontologyVersion: 'v1.0.0',
    evaluatedAt: '2026-09-10 16:45'
  }
};
