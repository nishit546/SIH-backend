import type { PatternSummary, SafetyPatternItem } from '../types/pattern.types';

export const MOCK_PATTERN_SUMMARY: PatternSummary = {
  activePatterns: 5,
  highPriorityPatterns: 4,
  sifRelatedPatterns: 5,
  increasingPatterns: 3
};

export const MOCK_SAFETY_PATTERNS: SafetyPatternItem[] = [
  {
    id: 'pat-001',
    title: 'Repeated Energy Isolation & Zero-Energy Verification Failures',
    shortExplanation:
      'Turnaround mechanics frequently unbolting pressurized process pipe flanges before positive mechanical isolation and atmospheric bleed-off checks.',
    description:
      'Multiple independent reports indicate systemic degradation in Lockout/Tagout (LOTO) and double-block-and-bleed protocols across hydrocarbon processing units during maintenance overhauls.',
    hazardCategory: 'Energy Isolation (LOTO)',
    iogpRules: ['Energy Isolation', 'Work Authorization'],
    riskLevel: 'CRITICAL',
    trend: 'INCREASING',
    reportCount: 7,
    sifCount: 5,
    affectedSites: ['Digboi Refinery - Unit 4', 'Digboi Refinery - Tank Farm B', 'Moran Gathering Station'],
    affectedActivities: ['Hydrocracker Line Breaking', 'Crude Transfer Manifold Torquing', 'Pump Seal Replacement'],
    commonHazards: ['Trapped Hydrocarbon Gas Under Pressure', 'Live Electrical Feeds', 'Incomplete Valve Bleed-off'],
    commonControlFailures: [
      'Zero energy verification bypassed prior to line unbolting',
      'Missing positive physical lock on upstream block valve',
      'Bleeder valves plugged with wax or sediment not cleared'
    ],
    recommendedActions: [
      'Implement mandatory two-person independent LOTO verification sign-off before permit issue',
      'Deploy portable pressure test gauges to prove zero energy at flange tap points',
      'Conduct immediate stand-down for all mechanical maintenance turnaround contractors'
    ],
    firstDetectedAt: '2026-08-20',
    lastDetectedAt: '2026-09-09',
    frequencySummary: '7 events in the last 21 days (+40% vs historical baseline)',
    linkedReports: [
      {
        id: 'rep-001',
        reportNumber: 'HSE-2026-0941',
        eventDate: '2026-09-09',
        site: 'Digboi Refinery - Unit 4',
        activity: 'Hydrocracker Maintenance & Line Breaking',
        headline: 'Residual high-pressure hydrocarbon gas hissed through loosened studs before zero energy proof.',
        sifPotential: true,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'rep-006',
        reportNumber: 'HSE-2026-0921',
        eventDate: '2026-09-07',
        site: 'Digboi Refinery - Tank Farm B',
        activity: 'Crude Oil Transfer Line Hot Bolting',
        headline: 'Bolts loosened on live hydrocarbon line without hot bolting safety clamps attached.',
        sifPotential: true,
        riskLevel: 'HIGH'
      },
      {
        id: 'rep-008',
        reportNumber: 'HSE-2026-0912',
        eventDate: '2026-09-05',
        site: 'Digboi Refinery - Unit 4',
        activity: 'High Voltage Switchgear Racking',
        headline: 'Technician bypassed mechanical interlock switch inside 6.6kV switchgear cabinet.',
        sifPotential: true,
        riskLevel: 'CRITICAL'
      }
    ]
  },
  {
    id: 'pat-002',
    title: 'Line of Fire & High-Pressure Mud Line Restraint Deficiencies',
    shortExplanation:
      'Rig floor personnel exposed directly to dynamic high-pressure piping and suspended crane loads during pipe tripping.',
    description:
      'Cluster of near misses on drilling rigs highlighting missing secondary retention pins on vibrating high-pressure rotary hoses (3500+ PSI) and unauthorized personnel presence in line-of-fire drop zones.',
    hazardCategory: 'Line of Fire & Pressurized Systems',
    iogpRules: ['Line of Fire', 'Safe Mechanical Lifting'],
    riskLevel: 'CRITICAL',
    trend: 'INCREASING',
    reportCount: 5,
    sifCount: 4,
    affectedSites: ['Duliajan Drilling Rig #7', 'Duliajan Drilling Rig #3'],
    affectedActivities: ['High-Pressure Mud Line Tripping', 'Drill Collar Rigging & Staging'],
    commonHazards: ['High-Pressure Fluid (3500 PSI)', 'Whipping Flexible Hose', 'Suspended Tubular Bundles'],
    commonControlFailures: [
      'Missing cotter pin / split pin on high-pressure swivel joint',
      'Whipcheck safety cables improperly anchored to structural beam',
      'Rig crew entered barricaded drop zone beneath active crane swing radius'
    ],
    recommendedActions: [
      'Inspect all high-pressure Chiksan joints and install heavy-duty locking pins across drilling fleet',
      'Enforce automated rotary table exclusion zone interlocks during high-pressure pumping',
      'Audit contractor crane rigging sling certification sheets'
    ],
    firstDetectedAt: '2026-08-25',
    lastDetectedAt: '2026-09-09',
    frequencySummary: '5 events in the last 15 days (+65% surge)',
    linkedReports: [
      {
        id: 'rep-002',
        reportNumber: 'HSE-2026-0938',
        eventDate: '2026-09-09',
        site: 'Duliajan Drilling Rig #7',
        activity: 'High-Pressure Mud Line Tripping',
        headline: 'Chiksan swivel joint retaining pin missing cotter pin under 3500 PSI vibrating line.',
        sifPotential: true,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'rep-007',
        reportNumber: 'HSE-2026-0918',
        eventDate: '2026-09-06',
        site: 'Numaligarh Terminal',
        activity: 'Heavy Crane Tandem Lift',
        headline: 'Crane operator initiated 8-ton vessel lift on uncompacted soil shoulder.',
        sifPotential: true,
        riskLevel: 'HIGH'
      }
    ]
  },
  {
    id: 'pat-003',
    title: 'Working at Height Scaffolding & Fall Arrest Control Gaps',
    shortExplanation:
      'Elevated pipe rack access scaffolds constructed with missing guardrails, unclipped lanyards, and expired green tags.',
    description:
      'Recurring barrier degradations identified across terminal construction zones where third-party scaffolding contractors handed over incomplete platforms with missing mid-rails or toe boards.',
    hazardCategory: 'Working at Height',
    iogpRules: ['Working at Height'],
    riskLevel: 'HIGH',
    trend: 'STABLE',
    reportCount: 6,
    sifCount: 3,
    affectedSites: ['Numaligarh Terminal', 'Moran Gathering Station'],
    affectedActivities: ['Structural Pipe Rack Scaffolding', 'Elevated Cable Tray Installation'],
    commonHazards: ['Elevated Platforms (>10 meters)', 'Incomplete Edge Protection', 'Dropped Objects'],
    commonControlFailures: [
      'Scaffold weekly green inspection tags expired',
      'Missing intermediate guardrails on work platforms',
      'Workers observed not anchoring dual shock-absorbing lanyards to certified lifelines'
    ],
    recommendedActions: [
      'Implement daily scaffolding inspector sign-off board at base ladders',
      'Mandate 100% tie-off compliance audits with zero-tolerance penalty for repeat violations',
      'Install perimeter toe boards and debris netting on high-traffic transit walkways'
    ],
    firstDetectedAt: '2026-08-15',
    lastDetectedAt: '2026-09-08',
    frequencySummary: '6 events in the last 25 days (Consistent frequency)',
    linkedReports: [
      {
        id: 'rep-004',
        reportNumber: 'HSE-2026-0929',
        eventDate: '2026-09-08',
        site: 'Numaligarh Terminal',
        activity: 'Structural Pipe Rack Scaffolding',
        headline: 'Scaffold green inspection tag expired by 4 days on 12-meter high piperack access.',
        sifPotential: false,
        riskLevel: 'MEDIUM'
      },
      {
        id: 'rep-010',
        reportNumber: 'HSE-2026-0904',
        eventDate: '2026-09-03',
        site: 'Moran Gathering Station',
        activity: 'Pipe Painting & Coating',
        headline: 'Painter placed step ladder on wet oily walkway without rubber footing pads.',
        sifPotential: false,
        riskLevel: 'LOW'
      }
    ]
  },
  {
    id: 'pat-004',
    title: 'Hot Work Authorization & Combustible Gas Testing Bypasses',
    shortExplanation:
      'Arc welding and cutting operations initiated in hydrocarbon process areas before atmospheric testing or without spark containment.',
    description:
      'Pattern of pre-job authorization shortcuts where welding was initiated before combustible gas testing was verified by a certified gas tester, creating severe explosion precursors.',
    hazardCategory: 'Hot Work & Flammable Atmospheres',
    iogpRules: ['Hot Work', 'Work Authorization', 'Bypassing Safety Controls'],
    riskLevel: 'CRITICAL',
    trend: 'INCREASING',
    reportCount: 4,
    sifCount: 4,
    affectedSites: ['Digboi Refinery - Unit 4', 'Digboi Refinery - Tank Farm B'],
    affectedActivities: ['Hydrocracker Maintenance & Line Breaking', 'Fuel Gas Pipeline Tie-In & Welding'],
    commonHazards: ['Open Welding Arc', 'Flammable Hydrocarbon Vapor', 'Hot Slag / Sparks'],
    commonControlFailures: [
      'Gas testing omitted or completed more than 2 hours before hot work ignition',
      'Fire blanket habitat enclosure not sealed around flange gaps',
      'Standby fire watch not assigned or equipped with pressurized extinguisher'
    ],
    recommendedActions: [
      'Enforce digital Permit to Work interlocking requiring gas tester biometric timestamp before ignition',
      'Deploy continuous LEL atmospheric area monitors with acoustic alarms in all turnaround hot work zones',
      'Retrain contractor welding foremen on hydrocarbon zone fire-watch obligations'
    ],
    firstDetectedAt: '2026-08-28',
    lastDetectedAt: '2026-09-09',
    frequencySummary: '4 events in the last 12 days (Critical escalation)',
    linkedReports: [
      {
        id: 'rep-001',
        reportNumber: 'HSE-2026-0941',
        eventDate: '2026-09-09',
        site: 'Digboi Refinery - Unit 4',
        activity: 'Fuel Gas Pipeline Tie-In & Welding',
        headline: 'Maintenance worker started welding on fuel gas pipeline before gas testing was completed.',
        sifPotential: true,
        riskLevel: 'HIGH'
      }
    ]
  },
  {
    id: 'pat-005',
    title: 'Confined Space Entry Atmospheric Monitoring & Ventilation Gaps',
    shortExplanation:
      'Entry attendants permitting technician entry into vessels without 4-gas bump tests or continuous forced-air ventilation.',
    description:
      'Recurring failure to maintain continuous ventilation and real-time gas monitoring during internal separator vessel cleanouts and tank inspections.',
    hazardCategory: 'Confined Space Entry',
    iogpRules: ['Confined Space', 'Work Authorization'],
    riskLevel: 'HIGH',
    trend: 'DECREASING',
    reportCount: 3,
    sifCount: 2,
    affectedSites: ['Moran Gathering Station', 'Jorhat Crude Pumping Station'],
    affectedActivities: ['Separator Vessel Internal Inspection', 'Crude Sump Pit De-sludging'],
    commonHazards: ['Oxygen Deficiency (<19.5%)', 'Toxic Hydrogen Sulfide (H2S)', 'Enclosed Entrapment'],
    commonControlFailures: [
      'Entry watch attendant did not bump test detector prior to shift entry',
      'Forced air ventilation fan experienced intermittent power cut',
      'Emergency retrieval tripod and harness winch not staged at vessel manway'
    ],
    recommendedActions: [
      'Mandate automated dock calibration logs for all multi-gas monitors before permit signing',
      'Install backup uninterrupted power supply (UPS) for all confined space extraction blowers',
      'Station dedicated certified rescue team for high-risk enclosed vessel entries'
    ],
    firstDetectedAt: '2026-08-10',
    lastDetectedAt: '2026-09-08',
    frequencySummary: '3 events in the last 30 days (-30% reduction following supervisory stand-down)',
    linkedReports: [
      {
        id: 'rep-003',
        reportNumber: 'HSE-2026-0934',
        eventDate: '2026-09-08',
        site: 'Moran Gathering Station',
        activity: 'Separator Vessel Internal Inspection',
        headline: 'Contractor entered vessel before LEL/O2 continuous atmospheric monitor bump test.',
        sifPotential: true,
        riskLevel: 'CRITICAL'
      }
    ]
  }
];
