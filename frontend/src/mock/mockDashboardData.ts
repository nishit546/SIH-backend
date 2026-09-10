import type { DashboardData } from '../types/dashboard.types';

export const MOCK_DASHBOARD_DATA: DashboardData = {
  summary: {
    totalReports: 148,
    sifPotentialReports: 34,
    sifPotentialRate: 23.0,
    highRiskReports: 42,
    highRiskRate: 28.4,
    pendingAnalysis: 6,
    activePatternsCount: 5,
    openCorrectiveActions: 18,
    completedCorrectiveActions: 72,
    changeFromLastPeriod: {
      totalReports: 12.5,
      sifPotential: -4.2,
      highRisk: 8.0,
      pending: -25.0,
      patterns: 25.0
    }
  },

  sifDistribution: {
    sifPotential: 34,
    notSifPotential: 108,
    unanalyzed: 6
  },

  riskDistribution: [
    { level: 'CRITICAL', count: 14, percentage: 9.5, color: '#ef4444' },
    { level: 'HIGH', count: 28, percentage: 18.9, color: '#f97316' },
    { level: 'MEDIUM', count: 64, percentage: 43.2, color: '#eab308' },
    { level: 'LOW', count: 36, percentage: 24.3, color: '#22c55e' }
  ],

  hazards: [
    { hazard: 'Energy Isolation (LOTO)', count: 38, sifCount: 16, percentage: 25.7 },
    { hazard: 'Line of Fire (Pressurized / Heavy)', count: 31, sifCount: 12, percentage: 20.9 },
    { hazard: 'Working at Height', count: 26, sifCount: 9, percentage: 17.6 },
    { hazard: 'Confined Space Entry', count: 19, sifCount: 8, percentage: 12.8 },
    { hazard: 'Hot Work & Flammable Atmosphere', count: 18, sifCount: 6, percentage: 12.2 },
    { hazard: 'Suspended Load / Rigging', count: 11, sifCount: 4, percentage: 7.4 },
    { hazard: 'Toxic / H2S Gas Exposure', count: 5, sifCount: 3, percentage: 3.4 }
  ],

  iogpRules: [
    { rule: 'Energy Isolation', code: 'LSR-01', count: 36, sifCount: 15, percentage: 24.3 },
    { rule: 'Line of Fire', code: 'LSR-02', count: 29, sifCount: 11, percentage: 19.6 },
    { rule: 'Working at Height', code: 'LSR-03', count: 24, sifCount: 9, percentage: 16.2 },
    { rule: 'Confined Space', code: 'LSR-04', count: 18, sifCount: 8, percentage: 12.2 },
    { rule: 'Hot Work', code: 'LSR-05', count: 16, sifCount: 5, percentage: 10.8 },
    { rule: 'Bypassing Safety Controls', code: 'LSR-06', count: 14, sifCount: 7, percentage: 9.5 },
    { rule: 'Safe Mechanical Lifting', code: 'LSR-07', count: 11, sifCount: 3, percentage: 7.4 }
  ],

  siteDistribution: [
    { site: 'Digboi Refinery - Unit 4', totalReports: 48, sifReports: 16, highRiskReports: 18, percentage: 32.4 },
    { site: 'Duliajan Drilling Rig #7', totalReports: 32, sifReports: 11, highRiskReports: 12, percentage: 21.6 },
    { site: 'Moran Gathering Station', totalReports: 26, sifReports: 7, highRiskReports: 8, percentage: 17.6 },
    { site: 'Numaligarh Terminal', totalReports: 22, sifReports: 5, highRiskReports: 6, percentage: 14.9 },
    { site: 'Jorhat Crude Pumping Station', totalReports: 12, sifReports: 2, highRiskReports: 2, percentage: 8.1 },
    { site: 'Offshore Platform Alpha', totalReports: 8, sifReports: 2, highRiskReports: 3, percentage: 5.4 }
  ],

  trends: [
    { period: 'Week 1', date: 'Aug 04 - Aug 10', totalReports: 18, sifPotentialReports: 3, highRiskReports: 4 },
    { period: 'Week 2', date: 'Aug 11 - Aug 17', totalReports: 24, sifPotentialReports: 6, highRiskReports: 7 },
    { period: 'Week 3', date: 'Aug 18 - Aug 24', totalReports: 21, sifPotentialReports: 4, highRiskReports: 5 },
    { period: 'Week 4', date: 'Aug 25 - Aug 31', totalReports: 32, sifPotentialReports: 9, highRiskReports: 11 },
    { period: 'Week 5', date: 'Sep 01 - Sep 07', totalReports: 28, sifPotentialReports: 7, highRiskReports: 9 },
    { period: 'Week 6 (Current)', date: 'Sep 08 - Sep 14', totalReports: 25, sifPotentialReports: 5, highRiskReports: 6 }
  ],

  insights: [
    {
      id: 'ins-01',
      type: 'CRITICAL',
      title: 'Energy Isolation is Primary Control Failure',
      message: 'Energy Isolation is the most frequently observed control failure, accounting for 47% of all detected SIF-potential events across turnaround zones.',
      metric: '38 reports (16 SIF)',
      affectedSite: 'Digboi Refinery - Unit 4',
      suggestedAction: 'Enforce mandatory two-person LOTO verification checklist prior to mechanical line breaking.',
      detectedAt: '2026-09-09'
    },
    {
      id: 'ins-02',
      type: 'WARNING',
      title: 'Digboi Refinery Has Highest SIF Density',
      message: 'Digboi Refinery - Unit 4 has the highest concentration of SIF-potential reports (33.3% SIF rate vs 23% fleet average).',
      metric: '16 SIF Events',
      affectedSite: 'Digboi Refinery - Unit 4',
      suggestedAction: 'Conduct specialized audit on Hydrocracker pipe-breaking and blind isolation procedures.',
      detectedAt: '2026-09-08'
    },
    {
      id: 'ins-03',
      type: 'TREND',
      title: 'Hot Work Reports Increased During Selected Period',
      message: 'Hot Work-related reports increased by 38% during the current turnaround phase, largely driven by premature arc ignition prior to gas clearance.',
      metric: '+38% this period',
      affectedSite: 'Digboi Tank Farm B & Unit 4',
      suggestedAction: 'Require digital PTW gas tester sign-off timestamp before arc ignition permits are released.',
      detectedAt: '2026-09-07'
    },
    {
      id: 'ins-04',
      type: 'WARNING',
      title: 'Line of Fire Risk Surging on Drilling Fleet',
      message: 'Duliajan Drilling Rig #7 shows an escalating line-of-fire trend in mud piping and high-pressure rotary hoses.',
      metric: '+65% surge',
      affectedSite: 'Duliajan Drilling Rig #7',
      suggestedAction: 'Inspect all Chiksan swivel safety whipchecks and cotter pins during shift handover.',
      detectedAt: '2026-09-06'
    }
  ],

  emergingPatterns: [
    {
      id: 'pat-001',
      title: 'Repeated Energy Isolation & Zero-Energy Verification Failures',
      riskLevel: 'CRITICAL',
      trend: 'INCREASING',
      reportCount: 7,
      sifCount: 5,
      affectedSites: ['Digboi Refinery - Unit 4', 'Moran'],
      shortExplanation: 'Mechanics unbolting pressurized process pipe flanges before positive mechanical isolation and bleed-off checks.'
    },
    {
      id: 'pat-002',
      title: 'Line of Fire & High-Pressure Mud Line Restraint Deficiencies',
      riskLevel: 'CRITICAL',
      trend: 'INCREASING',
      reportCount: 5,
      sifCount: 4,
      affectedSites: ['Duliajan Drilling Rig #7'],
      shortExplanation: 'Missing secondary cotter pins on vibrating 3500+ PSI mud lines and personnel inside drop zones.'
    },
    {
      id: 'pat-003',
      title: 'Working at Height Scaffolding & Fall Arrest Control Gaps',
      riskLevel: 'HIGH',
      trend: 'STABLE',
      reportCount: 6,
      sifCount: 3,
      affectedSites: ['Numaligarh Terminal', 'Moran'],
      shortExplanation: 'Scaffolds with missing mid-rails, expired green inspection tags, and unclipped lanyards.'
    }
  ],

  highPriorityReports: [
    {
      id: 'rep-001',
      reportNumber: 'HSE-2026-0941',
      eventDate: '2026-09-09 14:30',
      site: 'Digboi Refinery - Unit 4',
      activity: 'Hydrocracker Maintenance & Line Breaking',
      reportType: 'NEAR_MISS',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Residual high-pressure hydrocarbon gas hissed through loosened studs before zero energy proof.'
    },
    {
      id: 'rep-002',
      reportNumber: 'HSE-2026-0938',
      eventDate: '2026-09-09 11:15',
      site: 'Duliajan Drilling Rig #7',
      activity: 'High-Pressure Mud Line Tripping',
      reportType: 'UNSAFE_CONDITION',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Chiksan swivel joint retaining pin missing cotter pin under 3500 PSI vibrating line.'
    },
    {
      id: 'rep-003',
      reportNumber: 'HSE-2026-0934',
      eventDate: '2026-09-08 16:45',
      site: 'Moran Gathering Station',
      activity: 'Separator Vessel Internal Inspection',
      reportType: 'UNSAFE_ACT',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Contractor entered vessel manway before LEL/O2 continuous atmospheric monitor bump test.'
    }
  ],

  recentReports: [
    {
      id: 'rep-001',
      reportNumber: 'HSE-2026-0941',
      eventDate: '2026-09-09 14:30',
      site: 'Digboi Refinery - Unit 4',
      activity: 'Hydrocracker Maintenance & Line Breaking',
      reportType: 'NEAR_MISS',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Residual high-pressure hydrocarbon trapped behind blinded valve flange during line break.'
    },
    {
      id: 'rep-002',
      reportNumber: 'HSE-2026-0938',
      eventDate: '2026-09-09 11:15',
      site: 'Duliajan Drilling Rig #7',
      activity: 'High-Pressure Mud Line Tripping',
      reportType: 'UNSAFE_CONDITION',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Chiksan swivel joint retaining pin missing cotter pin under 3500 PSI vibrating line.'
    },
    {
      id: 'rep-003',
      reportNumber: 'HSE-2026-0934',
      eventDate: '2026-09-08 16:45',
      site: 'Moran Gathering Station',
      activity: 'Separator Vessel Internal Inspection',
      reportType: 'UNSAFE_ACT',
      riskLevel: 'CRITICAL',
      sifPotential: true,
      status: 'ANALYZED',
      headline: 'Contractor entered vessel manway before LEL/O2 continuous atmospheric monitor bump test.'
    },
    {
      id: 'rep-004',
      reportNumber: 'HSE-2026-0929',
      eventDate: '2026-09-08 10:20',
      site: 'Numaligarh Terminal',
      activity: 'Structural Pipe Rack Scaffolding',
      reportType: 'UNSAFE_CONDITION',
      riskLevel: 'MEDIUM',
      sifPotential: false,
      status: 'ANALYZED',
      headline: 'Scaffold green inspection tag expired by 4 days on 12-meter high piperack access.'
    },
    {
      id: 'rep-005',
      reportNumber: 'HSE-2026-0925',
      eventDate: '2026-09-07 15:10',
      site: 'Jorhat Crude Pumping Station',
      activity: 'Booster Pump Seal Replacement',
      reportType: 'UNSAFE_ACT',
      riskLevel: 'LOW',
      sifPotential: false,
      status: 'ANALYZED',
      headline: 'Minor hydraulic oil drip collected on drip tray without secondary containment absorbent pads.'
    },
    {
      id: 'rep-006',
      reportNumber: 'HSE-2026-0921',
      eventDate: '2026-09-07 09:00',
      site: 'Digboi Refinery - Tank Farm B',
      activity: 'Crude Oil Transfer Line Hot Bolting',
      reportType: 'NEAR_MISS',
      riskLevel: 'HIGH',
      sifPotential: true,
      status: 'PENDING',
      headline: 'Bolts loosened on live hydrocarbon line without hot bolting safety clamps attached.'
    }
  ]
};

export const MOCK_FILTER_OPTIONS = {
  sites: [
    { value: 'ALL', label: 'All Operational Sites' },
    { value: 'Digboi Refinery - Unit 4', label: 'Digboi Refinery - Unit 4' },
    { value: 'Digboi Refinery - Tank Farm B', label: 'Digboi Refinery - Tank Farm B' },
    { value: 'Duliajan Drilling Rig #7', label: 'Duliajan Drilling Rig #7' },
    { value: 'Moran Gathering Station', label: 'Moran Gathering Station' },
    { value: 'Numaligarh Terminal', label: 'Numaligarh Terminal' },
    { value: 'Jorhat Crude Pumping Station', label: 'Jorhat Crude Pumping Station' },
    { value: 'Offshore Platform Alpha', label: 'Offshore Platform Alpha' }
  ],
  departments: [
    { value: 'ALL', label: 'All Departments' },
    { value: 'Mechanical Maintenance', label: 'Mechanical Maintenance' },
    { value: 'Operations & Process', label: 'Operations & Process' },
    { value: 'Drilling & Well Servicing', label: 'Drilling & Well Servicing' },
    { value: 'Electrical & Instrumentation', label: 'Electrical & Instrumentation' },
    { value: 'Civil & Scaffolding', label: 'Civil & Scaffolding' },
    { value: 'HSE & Emergency Response', label: 'HSE & Emergency Response' }
  ],
  activities: [
    { value: 'ALL', label: 'All Activities' },
    { value: 'Hydrocracker Maintenance & Line Breaking', label: 'Line Breaking / Isolation' },
    { value: 'High-Pressure Mud Line Tripping', label: 'High-Pressure Mud Piping' },
    { value: 'Separator Vessel Internal Inspection', label: 'Confined Space Entry' },
    { value: 'Structural Pipe Rack Scaffolding', label: 'Scaffolding & Working at Height' },
    { value: 'Crude Oil Transfer Line Hot Bolting', label: 'Hot Bolting & Torquing' },
    { value: 'Heavy Crane Lift Operations', label: 'Heavy Crane Lift Operations' }
  ]
};
