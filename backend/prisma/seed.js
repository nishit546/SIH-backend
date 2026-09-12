const { PrismaClient, UserRole, ReportType, ProcessingStatus, RiskLevel, ActionPriority, ActionStatus, PatternType } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with synthetic HSE demo data...');

  // 1. Clean existing records in reverse dependency order for safe re-running
  await prisma.safetyPatternReport.deleteMany({});
  await prisma.safetyPattern.deleteMany({});
  await prisma.correctiveAction.deleteMany({});
  await prisma.safetyAnalysis.deleteMany({});
  await prisma.safetyReport.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing records.');

  // Common password hash for test users: "Password123!"
  const passwordHash = await bcryptjs.hash('Password123!', 10);

  // 2. Create Demo Users with Hashed Passwords
  const reviewer = await prisma.user.create({
    data: {
      email: 'reviewer@oil.com',
      passwordHash,
      fullName: 'Safety Reviewer',
      role: UserRole.REVIEWER,
      department: 'HSE Field Safety',
      site: 'Plant A - Refining Complex',
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@oil.com',
      passwordHash,
      fullName: 'Safety Analyst',
      role: UserRole.ANALYST,
      department: 'Operational Integrity',
      site: 'Drilling Division',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@oil.com',
      passwordHash,
      fullName: 'Safety Manager',
      role: UserRole.MANAGER,
      department: 'Corporate Safety & Compliance',
      site: 'Central Headquarters',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@oil.com',
      passwordHash,
      fullName: 'Safety Admin',
      role: UserRole.ADMIN,
      department: 'Executive Leadership',
      site: 'Central Headquarters',
    },
  });

  // Create SIF-Guard demo reviewer from prompt specification
  const sifGuardPasswordHash = await bcryptjs.hash('Reviewer@123', 10);
  await prisma.user.create({
    data: {
      email: 'reviewer@sifguard.demo',
      passwordHash: sifGuardPasswordHash,
      fullName: 'HSE Safety Reviewer (Demo)',
      role: UserRole.REVIEWER,
      department: 'Corporate HSE Safety',
      site: 'Field HQ Complex',
    },
  });

  // Mobile App Fast-Access Demo Roles & Legacy Aliases
  await prisma.user.createMany({
    data: [
      {
        email: 'reviewer.demo@oilindia.in',
        passwordHash,
        fullName: 'HSE Field Reviewer',
        role: UserRole.REVIEWER,
        department: 'HSE Drilling Operations',
        site: 'Duliajan Field HQ',
      },
      {
        email: 'hse.manager@oilindia.in',
        passwordHash,
        fullName: 'Chief Safety Manager',
        role: UserRole.MANAGER,
        department: 'Executive HSE Council',
        site: 'Duliajan Field HQ',
      },
      {
        email: 'operator.demo@oilindia.in',
        passwordHash,
        fullName: 'Field Safety Officer',
        role: UserRole.REVIEWER,
        department: 'Drilling Rig Site Operations',
        site: 'Duliajan Wellhead #4',
      },
      {
        email: 'hse.reviewer@oil-demo.org',
        passwordHash,
        fullName: 'Aarav Sharma (HSE Reviewer)',
        role: UserRole.REVIEWER,
        department: 'HSE Field Safety',
        site: 'Plant A - Refining Complex',
      },
      {
        email: 'hse.manager@oil-demo.org',
        passwordHash,
        fullName: 'Priya Verma (HSE Manager)',
        role: UserRole.MANAGER,
        department: 'Corporate Safety & Compliance',
        site: 'Central Headquarters',
      },
      {
        email: 'safety.analyst@oil-demo.org',
        passwordHash,
        fullName: 'Vikram Mehta (Safety Analyst)',
        role: UserRole.ANALYST,
        department: 'Operational Integrity',
        site: 'Drilling Division',
      },
    ],
  });

  console.log('👤 Created Demo & Test Users (Reviewer, Analyst, Manager, Admin, Mobile Roles).');

  // Helper metadata
  const syntheticMeta = {
    isSynthetic: true,
    environment: 'development_seed',
    source: 'SIH-2026-MVP-SYNTHETIC-DATASET',
    disclaimer: 'SYNTHETIC DEMO DATA - NOT OFFICIAL OIL PRODUCTION DATA',
  };

  // 3. Define Seed Reports and Analyses
  const seedDataset = [
    {
      report: {
        reportNumber: 'SYN-2026-001',
        description: 'Maintenance worker started welding on hydrocarbon pipeline before combustible gas testing was completed in the hazardous zone.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Plant A - Refining Complex',
        department: 'Mechanical Maintenance',
        activity: 'Hot Work / Welding',
        contractorType: 'Contractor',
        workPhase: 'Maintenance Overhaul',
        eventDate: new Date('2026-09-01T09:30:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.94,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['Hot Work / Welding', 'Flammable Hydrocarbon Gas', 'Thermal Ignition'],
        exposures: ['Welder', 'Pipefitter', 'Nearby Area Crew'],
        criticalControls: ['Atmospheric Gas Testing', 'Hot Work Permit', 'Fire Watcher'],
        controlFailures: ['Gas testing not completed prior to hot work ignition', 'Inadequate permit verification'],
        barrierStatus: 'Bypassed / Not Executed',
        potentialConsequences: ['Hydrocarbon Vapor Cloud Explosion', 'Catastrophic Fire', 'Fatal Thermal Injuries'],
        iogpRules: ['Hot Work', 'Bypassing Safety Controls'],
        explanation: 'CRITICAL SIF Precursor flagged: Open ignition source (welding arc) introduced in a potentially flammable hydrocarbon atmosphere before mandatory atmospheric gas verification.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-002',
        description: 'Two technicians entered crude oil storage tank C-104 for desludging without four-gas atmospheric testing, breathing apparatus, or standby attendant at the manway.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Plant B - Terminal & Storage',
        department: 'Tank Farm Operations',
        activity: 'Confined Space Entry / Cleaning',
        contractorType: 'Contractor',
        workPhase: 'Tank Cleaning',
        eventDate: new Date('2026-09-02T11:15:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.98,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['Confined Space', 'Toxic H2S Gas', 'Oxygen Deficiency', 'Flammable Vapors'],
        exposures: ['Two Cleaning Technicians inside Tank C-104'],
        criticalControls: ['Continuous Multi-Gas Monitoring', 'Confined Space Entry Permit', 'Trained Standby Attendant', 'Emergency Retrieval Harness'],
        controlFailures: ['No gas testing performed before entry', 'Absence of designated hole watch/attendant', 'No SCBA/respiratory protection'],
        barrierStatus: 'Completely Missing',
        potentialConsequences: ['H2S Poisoning', 'Asphyxiation due to Oxygen Deficiency', 'Multiple Fatalities'],
        iogpRules: ['Confined Space', 'Work Authorisation'],
        explanation: 'CRITICAL SIF Precursor flagged: Entry into an unventilated enclosed vessel containing potential H2S and oxygen-deficient atmospheres without verification or rescue controls.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-003',
        description: 'Rigger observed standing directly under 4.5-ton suspended drill pipe bundle during crane lifting operation while tag line was not being used.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Offshore Rig 7',
        department: 'Drilling Operations',
        activity: 'Heavy Crane Lifting',
        contractorType: 'Internal',
        workPhase: 'Drilling Campaign',
        eventDate: new Date('2026-09-03T14:20:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: analyst.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.91,
        riskLevel: RiskLevel.HIGH,
        hazards: ['Suspended Heavy Load (4.5 Ton)', 'Stored Gravitational Energy', 'Crane Rigging'],
        exposures: ['Rigger positioned in fall zone beneath load'],
        criticalControls: ['Exclusion Zone Barricading', 'Tag Line Usage for Load Guidance', 'Lift Plan Adherence'],
        controlFailures: ['Personnel entered drop zone beneath suspended load', 'Failure to use tag lines'],
        barrierStatus: 'Bypassed',
        potentialConsequences: ['Crush Injury', 'Struck-by Heavy Machinery', 'Fatality'],
        iogpRules: ['Line of Fire', 'Safe Mechanical Lifting'],
        explanation: 'HIGH SIF Precursor flagged: Worker stationed directly inside the line of fire under a suspended dynamic heavy load without physical standoff controls.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-004',
        description: 'Electrician began troubleshooting 3.3kV main water injection pump electrical panel without applying Lockout/Tagout (LOTO) padlock or verifying zero electrical energy.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Plant A - Refining Complex',
        department: 'Electrical Maintenance',
        activity: 'High Voltage Switchgear Maintenance',
        contractorType: 'Internal',
        workPhase: 'Preventative Maintenance',
        eventDate: new Date('2026-09-04T08:45:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.96,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['High Voltage Electricity (3.3kV)', 'Arc Flash / Blast', 'Energized Conductors'],
        exposures: ['Electrician performing direct panel contact'],
        criticalControls: ['Lockout/Tagout (LOTO)', 'Verification of Zero Energy State (Test-Before-Touch)', 'Arc-Rated PPE'],
        controlFailures: ['Zero voltage verification omitted', 'LOTO isolation lock and tag not affixed'],
        barrierStatus: 'Failed / Not Applied',
        potentialConsequences: ['High-Voltage Electrocution', 'Arc Flash Severe Thermal Burns', 'Instant Fatality'],
        iogpRules: ['Energy Isolation', 'Work Authorisation'],
        explanation: 'CRITICAL SIF Precursor flagged: Direct maintenance on high-voltage energized equipment without physical energy isolation barriers or test-before-touch verification.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-005',
        description: 'Insulator observed working on pipe rack elevation at 8.5 meters without attaching full-body harness lanyard to anchorage lifeline on an incomplete scaffold platform.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Plant A - Refining Complex',
        department: 'Civil & Scaffolding',
        activity: 'Pipe Rack Insulation at Height',
        contractorType: 'Contractor',
        workPhase: 'Shutdown Works',
        eventDate: new Date('2026-09-05T10:00:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.89,
        riskLevel: RiskLevel.HIGH,
        hazards: ['Working at Height (8.5m)', 'Elevated Fall Risk', 'Uncertified Scaffold'],
        exposures: ['Insulation Technician on unbarricaded pipe rack'],
        criticalControls: ['100% Fall Arrest Tie-Off', 'Certified Green Scaffold Tag', 'Permanent Lifeline Anchor'],
        controlFailures: ['Harness lanyard unclipped at 8.5m height', 'Work performed on uninspected yellow/red tagged scaffold'],
        barrierStatus: 'Inactive / Bypassed',
        potentialConsequences: ['Fall from Height', 'Severe Traumatic Brain / Spinal Injury', 'Fatality'],
        iogpRules: ['Working at Height'],
        explanation: 'HIGH SIF Precursor flagged: Personnel exposed to fatal fall hazard greater than 2 meters without primary 100% tie-off fall arrest engagement.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-006',
        description: 'Field operator manually defeated and bypassed high-pressure safety shut-off trip (PSHH) on test separator vessel to avoid production downtime.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Pipeline Station 4',
        department: 'Gas Processing Operations',
        activity: 'Separator Monitoring',
        contractorType: 'Internal',
        workPhase: 'Continuous Operations',
        eventDate: new Date('2026-09-05T16:30:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: manager.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.93,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['Pressurized Hydrocarbon Gas (75 bar)', 'Vessel Overpressure', 'Loss of Primary Containment'],
        exposures: ['Control room operators and field staff in proximity'],
        criticalControls: ['Safety Instrumented System (SIS) Interlocks', 'Management of Change (MOC) for Safety Overrides', 'Mechanical Pressure Relief Valve'],
        controlFailures: ['Unauthorized safety bypass without MOC approval or compensating safeguards'],
        barrierStatus: 'Intentionally Defeated',
        potentialConsequences: ['Catastrophic Pressure Vessel Rupture', 'Major Fire / Toxic Release', 'Multiple Fatalities'],
        iogpRules: ['Bypassing Safety Controls'],
        explanation: 'CRITICAL SIF Precursor flagged: Critical instrumented protective barrier deliberately disabled without authorization, removing overpressure defense.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-007',
        description: 'Second instance this week: Maintenance crew at Plant A conducted hot cutting on decommissioned flare line where gas sniffer detector calibration had expired 6 months ago.',
        reportType: ReportType.UNSAFE_CONDITION,
        site: 'Plant A - Refining Complex',
        department: 'Mechanical Maintenance',
        activity: 'Hot Cutting / Flare Maintenance',
        contractorType: 'Contractor',
        workPhase: 'Modifications',
        eventDate: new Date('2026-09-06T13:10:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.92,
        riskLevel: RiskLevel.HIGH,
        hazards: ['Hot Cutting Sparks', 'Trapped Flare Residual Gas', 'Uncalibrated Gas Detector'],
        exposures: ['3 Fabrication Contractors'],
        criticalControls: ['Calibrated & Bump-Tested LEL Gas Detector', 'Continuous Gas Monitoring', 'Flare Isolation'],
        controlFailures: ['Use of expired/uncalibrated gas detection instrumentation in hazardous zone'],
        barrierStatus: 'Ineffective / Degraded',
        potentialConsequences: ['Flare Gas Flash Fire', 'Explosion', 'Severe Burns'],
        iogpRules: ['Hot Work', 'Bypassing Safety Controls'],
        explanation: 'HIGH SIF Precursor flagged: Hot work performed relying on defective/expired gas measurement equipment, creating a false assurance of atmosphere safety.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-008',
        description: 'High-pressure nitrogen hydrotest line experienced sudden coupling seal failure at 180 bar during pressure test; whip check cable arrested line whip.',
        reportType: ReportType.NEAR_MISS,
        site: 'Plant B - Terminal & Storage',
        department: 'Quality Assurance / Inspection',
        activity: 'Pressure Testing / Hydrotesting',
        contractorType: 'Contractor',
        workPhase: 'Pre-Commissioning',
        eventDate: new Date('2026-09-07T11:00:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: analyst.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: true,
        probability: 0.87,
        riskLevel: RiskLevel.HIGH,
        hazards: ['High-Pressure Fluid (180 Bar)', 'Pneumatic Whipping Line', 'Energy Release'],
        exposures: ['Hydrotest Inspectors behind blast shield'],
        criticalControls: ['Hose Whip Check Restraints', 'Exclusion Barricades', 'Calibrated Relief Valve'],
        controlFailures: ['Coupling seal defect during rapid pressurization'],
        barrierStatus: 'Secondary Barrier (Whip Check) Prevented Injury',
        potentialConsequences: ['High Velocity Projectile Impact', 'Catastrophic Trauma / Fatality'],
        iogpRules: ['Energy Isolation', 'Line of Fire'],
        explanation: 'HIGH SIF Precursor (Near Miss): High-energy pneumatic release occurred; whip check secondary barrier prevented fatal line whip incident.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-009',
        description: 'Pickup truck driver exceeded posted 30 km/h site speed limit travelling at 65 km/h on wet unpaved rig access road without wearing a seatbelt.',
        reportType: ReportType.UNSAFE_ACT,
        site: 'Offshore Rig 7',
        department: 'Logistics & Transport',
        activity: 'Crew Transport / Driving',
        contractorType: 'Contractor',
        workPhase: 'Routine Transport',
        eventDate: new Date('2026-09-07T15:45:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: false,
        probability: 0.38,
        riskLevel: RiskLevel.MEDIUM,
        hazards: ['Vehicle In-Motion', 'Wet / Slippery Road Surface', 'Speeding'],
        exposures: ['Vehicle Driver and Passenger'],
        criticalControls: ['Speed Governor / IVMS', 'Mandatory 3-Point Seatbelt', 'Defensive Driving Training'],
        controlFailures: ['Speed limit compliance violation', 'Failure to buckle seatbelt'],
        barrierStatus: 'Bypassed',
        potentialConsequences: ['Vehicle Rollover', 'Vehicle Collision', 'Moderate Injury'],
        iogpRules: ['Driving'],
        explanation: 'MODERATE Risk: Traffic compliance violation with elevated rollover risk, but without high-energy collision dynamics present.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-010',
        description: 'Small hydraulic oil leak (approx 200ml) from crane outrigger cylinder onto concrete pad; spill kit deployed immediately and area cleaned.',
        reportType: ReportType.UNSAFE_CONDITION,
        site: 'Central Workshop',
        department: 'Heavy Equipment Maintenance',
        activity: 'Equipment Servicing',
        contractorType: 'Internal',
        workPhase: 'Routine Maintenance',
        eventDate: new Date('2026-09-08T09:15:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: reviewer.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: false,
        probability: 0.05,
        riskLevel: RiskLevel.LOW,
        hazards: ['Minor Fluid Spill', 'Slip Hazard'],
        exposures: ['Workshop Technicians'],
        criticalControls: ['Secondary Spill Containment', 'Good Housekeeping', 'Absorbent Pads'],
        controlFailures: ['Worn outrigger hydraulic O-ring seal'],
        barrierStatus: 'Remediated Immediately',
        potentialConsequences: ['Minor Slip and Fall', 'Minor Environmental Cleanup'],
        iogpRules: [],
        explanation: 'LOW Risk: Minor low-energy hydraulic oil weeping with no credible life-threatening mechanism or high consequence exposure.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-011',
        description: 'Routine scheduled monthly safety walkaround completed at lube oil storage shed. All fire extinguishers in-date, eyewash stations tested, and egress clear.',
        reportType: ReportType.UNSAFE_CONDITION,
        site: 'Central Workshop',
        department: 'Facility Services',
        activity: 'Safety Walkaround',
        contractorType: 'Internal',
        workPhase: 'Routine Inspection',
        eventDate: new Date('2026-09-08T14:00:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: manager.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: false,
        probability: 0.01,
        riskLevel: RiskLevel.LOW,
        hazards: [],
        exposures: [],
        criticalControls: ['Routine HSE Inspection Program', 'Emergency Response Equipment'],
        controlFailures: [],
        barrierStatus: 'Intact and Functional',
        potentialConsequences: [],
        iogpRules: [],
        explanation: 'SAFE / LOW Risk: Positive safety observation confirming functional barriers and compliant operational environment.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
    {
      report: {
        reportNumber: 'SYN-2026-012',
        description: 'Scaffolder working on offshore deck level 3 noticed corroded handrail clamp during shift changeover, attached red caution tag and barricaded stairway access.',
        reportType: ReportType.UNSAFE_CONDITION,
        site: 'Offshore Rig 7',
        department: 'Structural Integrity',
        activity: 'Scaffold Inspection',
        contractorType: 'Contractor',
        workPhase: 'Operations',
        eventDate: new Date('2026-09-09T08:30:00Z'),
        status: ProcessingStatus.ANALYZED,
        reporterId: analyst.id,
        sourceMetadata: syntheticMeta,
      },
      analysis: {
        sifPotential: false,
        probability: 0.22,
        riskLevel: RiskLevel.LOW,
        hazards: ['Corroded Handrail Component', 'Elevated Walkway'],
        exposures: ['Personnel using stairway'],
        criticalControls: ['Defect Tagging (Red Tag)', 'Physical Barricading', 'Maintenance Work Order'],
        controlFailures: ['Atmospheric marine corrosion degradation'],
        barrierStatus: 'Administrative Isolation Effective',
        potentialConsequences: ['Loss of Handrail Stability'],
        iogpRules: ['Working at Height'],
        explanation: 'LOW Risk: Potential hazard proactively arrested through proper red-tagging and access restriction before any human exposure.',
        modelVersion: 'v1.0.0-hybrid-nlp',
        ontologyVersion: 'v1.0.0',
        isLatest: true,
      },
    },
  ];

  // 4. Insert Reports & Analyses into Database
  const createdReports = [];

  for (const item of seedDataset) {
    const report = await prisma.safetyReport.create({
      data: item.report,
    });

    const analysis = await prisma.safetyAnalysis.create({
      data: {
        reportId: report.id,
        ...item.analysis,
      },
    });

    createdReports.push({ report, analysis });
  }

  console.log(`📋 Seeded ${createdReports.length} Safety Reports with AI Analyses.`);

  // 5. Create Corrective Actions for High/Critical Risk Precursors
  const hotWorkReport = createdReports[0].report;
  const confinedSpaceReport = createdReports[1].report;
  const lotoReport = createdReports[3].report;

  const action1 = await prisma.correctiveAction.create({
    data: {
      reportId: hotWorkReport.id,
      title: 'Mandatory Gas Testing Stand-Down & Re-training at Plant A',
      description: 'Conduct comprehensive safety stand-down for all mechanical maintenance crews regarding mandatory 4-gas testing before any hot work permits are activated.',
      priority: ActionPriority.CRITICAL,
      status: ActionStatus.IN_PROGRESS,
      assigneeId: reviewer.id,
      createdById: manager.id,
      dueDate: new Date('2026-09-18T18:00:00Z'),
    },
  });

  const action2 = await prisma.correctiveAction.create({
    data: {
      reportId: confinedSpaceReport.id,
      title: 'Audit Confined Space Entry Controls & Deploy Multi-Gas Monitors',
      description: 'Audit all active tank farm entry permits and issue calibrated personal multigas monitors with audible alarms for tank cleaning contractors.',
      priority: ActionPriority.CRITICAL,
      status: ActionStatus.OPEN,
      assigneeId: analyst.id,
      createdById: manager.id,
      dueDate: new Date('2026-09-15T18:00:00Z'),
    },
  });

  const action3 = await prisma.correctiveAction.create({
    data: {
      reportId: lotoReport.id,
      title: 'Electrical Substation LOTO Padlock Station Inspection',
      description: 'Inspect and replenish physical lockout stations across all motor control centers (MCCs) and verify electrical isolation checklist adherence.',
      priority: ActionPriority.HIGH,
      status: ActionStatus.COMPLETED,
      completedAt: new Date('2026-09-08T12:00:00Z'),
      assigneeId: reviewer.id,
      createdById: manager.id,
      dueDate: new Date('2026-09-10T18:00:00Z'),
    },
  });

  console.log('⚡ Created 3 Corrective Actions.');

  // 6. Create Recurring Safety Patterns
  const pattern1 = await prisma.safetyPattern.create({
    data: {
      title: 'Recurring Hot Work Atmospheric Gas Testing Failures',
      description: 'Multiple high-risk precursors detected at Plant A involving hot work and welding operations initiated without verified or calibrated atmospheric combustible gas tests.',
      hazardCategory: 'Hot Work',
      iogpRule: 'Hot Work',
      site: 'Plant A - Refining Complex',
      activity: 'Hot Work / Welding',
      riskLevel: RiskLevel.CRITICAL,
      reportCount: 2,
      patternType: PatternType.RECURRING_CONTROL_FAILURE,
      firstDetectedAt: new Date('2026-09-01T09:30:00Z'),
      lastDetectedAt: new Date('2026-09-06T13:10:00Z'),
      status: 'ACTIVE',
    },
  });

  // Link pattern 1 to reports SYN-2026-001 and SYN-2026-007
  await prisma.safetyPatternReport.create({
    data: {
      patternId: pattern1.id,
      reportId: createdReports[0].report.id,
      confidence: 0.95,
    },
  });

  await prisma.safetyPatternReport.create({
    data: {
      patternId: pattern1.id,
      reportId: createdReports[6].report.id,
      confidence: 0.92,
    },
  });

  const pattern2 = await prisma.safetyPattern.create({
    data: {
      title: 'Working at Height Fall Protection Barrier Breakdowns',
      description: 'Cluster of working at height observations highlighting scaffold integrity issues and unclipped harness lanyards across elevated maintenance zones.',
      hazardCategory: 'Working at Height',
      iogpRule: 'Working at Height',
      site: 'Plant A - Refining Complex',
      activity: 'Pipe Rack Insulation at Height',
      riskLevel: RiskLevel.HIGH,
      reportCount: 1,
      patternType: PatternType.HIGH_RISK_CLUSTER,
      firstDetectedAt: new Date('2026-09-05T10:00:00Z'),
      lastDetectedAt: new Date('2026-09-05T10:00:00Z'),
      status: 'ACTIVE',
    },
  });

  await prisma.safetyPatternReport.create({
    data: {
      patternId: pattern2.id,
      reportId: createdReports[4].report.id,
      confidence: 0.88,
    },
  });

  console.log('🔍 Created 2 Recurring Safety Patterns with linked reports.');

  // 7. Verification and Summary
  const userCount = await prisma.user.count();
  const reportCount = await prisma.safetyReport.count();
  const analysisCount = await prisma.safetyAnalysis.count();
  const actionCount = await prisma.correctiveAction.count();
  const patternCount = await prisma.safetyPattern.count();
  const patternReportCount = await prisma.safetyPatternReport.count();

  console.log('\n📊 Seeding Complete! Summary:');
  console.log(`- Users: ${userCount}`);
  console.log(`- Safety Reports: ${reportCount}`);
  console.log(`- Safety Analyses: ${analysisCount}`);
  console.log(`- Corrective Actions: ${actionCount}`);
  console.log(`- Safety Patterns: ${patternCount}`);
  console.log(`- Pattern Report Links: ${patternReportCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
