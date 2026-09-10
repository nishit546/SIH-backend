const { RiskLevel } = require('@prisma/client');

class MockAIAnalysisService {
  constructor() {
    this.providerName = 'mock';
    this.modelVersion = 'mock-rule-heuristic-v1.0.0';
    this.ontologyVersion = 'v1.0.0';
  }

  /**
   * Generates deterministic, synthetic safety intelligence for local development & frontend integration.
   */
  async analyzeReport(input) {
    const text = (input.reportText || '').toLowerCase();

    // 1. Hot Work / Flammable Atmosphere
    if (text.includes('weld') || text.includes('hot work') || text.includes('spark') || text.includes('gas test')) {
      const hasControlFailure = text.includes('before') || text.includes('without') || text.includes('expired') || text.includes('incomplete') || text.includes('not');
      return {
        sifPotential: hasControlFailure,
        confidence: hasControlFailure ? 0.94 : 0.45,
        riskLevel: hasControlFailure ? RiskLevel.CRITICAL : RiskLevel.MEDIUM,
        hazards: ['Hot Work / Welding Arc', 'Flammable Hydrocarbon Gas', 'Thermal Ignition Source'],
        exposures: ['Welder', 'Pipefitter', 'Nearby Facility Staff'],
        criticalControls: ['Atmospheric Combustible Gas Testing (LEL)', 'Hot Work Permit (PTW)', 'Designated Fire Watcher'],
        controlFailures: hasControlFailure ? ['Hot work initiated without verified continuous gas testing'] : [],
        barrierStatus: hasControlFailure ? 'Bypassed / Not Completed' : 'Intact and Verified',
        potentialConsequences: ['Hydrocarbon Vapor Explosion', 'Flash Fire', 'Fatal Thermal Injuries'],
        iogpRules: ['Hot Work', 'Bypassing Safety Controls'],
        explanation: hasControlFailure
          ? 'CRITICAL SIF Precursor (MOCK): Open hot work ignition source present in hydrocarbon zone with missing or incomplete pre-task gas test barrier.'
          : 'MODERATE Risk (MOCK): Hot work observed with active controls present.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'HOT_WORK_ATMOSPHERE_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 2. Confined Space Entry
    if (text.includes('confined space') || text.includes('tank') || text.includes('vessel') || text.includes('manway') || text.includes('entry')) {
      const hasControlFailure = text.includes('without') || text.includes('no gas') || text.includes('no attendant') || text.includes('no ba') || text.includes('scba');
      return {
        sifPotential: true,
        confidence: 0.97,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['Confined Space Enclosure', 'Toxic Gas (H2S / CO)', 'Oxygen Deficiency (<19.5%)'],
        exposures: ['Personnel entering enclosed vessel / tank'],
        criticalControls: ['Continuous Multi-Gas Monitoring', 'Confined Space Entry Permit', 'Trained Standby Attendant (Hole Watch)'],
        controlFailures: hasControlFailure ? ['Entry without verified atmospheric monitoring or dedicated rescue attendant'] : ['Potential barrier degradation'],
        barrierStatus: 'Failed / Incomplete',
        potentialConsequences: ['Toxic Gas Inhalation', 'Asphyxiation due to Oxygen Depletion', 'Multiple Fatalities'],
        iogpRules: ['Confined Space', 'Work Authorisation'],
        explanation: 'CRITICAL SIF Precursor (MOCK): Enclosed vessel entry detected with high susceptibility to toxic gas accumulation and rapid asphyxiation.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'CONFINED_SPACE_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 3. Energy Isolation / LOTO
    if (text.includes('loto') || text.includes('lockout') || text.includes('isolation') || text.includes('energized') || text.includes('switchgear') || text.includes('electrical')) {
      return {
        sifPotential: true,
        confidence: 0.95,
        riskLevel: RiskLevel.CRITICAL,
        hazards: ['High-Voltage Electricity', 'Stored Hazardous Energy', 'Arc Flash / Blast'],
        exposures: ['Maintenance Technician / Electrician'],
        criticalControls: ['Lockout / Tagout (LOTO)', 'Verification of Zero Energy State (Test-Before-Touch)', 'Positive Mechanical Isolation'],
        controlFailures: ['Direct contact with energized equipment without verified positive isolation'],
        barrierStatus: 'Not Applied / Failed',
        potentialConsequences: ['High-Voltage Electrocution', 'Severe Arc Flash Burns', 'Immediate Fatality'],
        iogpRules: ['Energy Isolation', 'Work Authorisation'],
        explanation: 'CRITICAL SIF Precursor (MOCK): Intervention on high-energy electrical/fluid systems without verified zero-energy isolation state.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'ENERGY_ISOLATION_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 4. Working at Height / Fall Protection
    if (text.includes('height') || text.includes('harness') || text.includes('scaffold') || text.includes('fall') || text.includes('ladder') || text.includes('tie-off')) {
      const hasControlFailure = text.includes('without') || text.includes('unclipped') || text.includes('unattached') || text.includes('missing') || text.includes('loose');
      return {
        sifPotential: hasControlFailure,
        confidence: hasControlFailure ? 0.90 : 0.35,
        riskLevel: hasControlFailure ? RiskLevel.HIGH : RiskLevel.LOW,
        hazards: ['Working at Height (>2m)', 'Gravitational Fall Potential', 'Incomplete Scaffolding'],
        exposures: ['Worker at elevated working location'],
        criticalControls: ['100% Fall Arrest Tie-Off (Double Lanyard)', 'Certified Scaffolding Platform with Guardrails', 'Static Lifeline Anchorage'],
        controlFailures: hasControlFailure ? ['Failure to anchor safety harness lanyard at height'] : [],
        barrierStatus: hasControlFailure ? 'Inactive / Bypassed' : 'Intact',
        potentialConsequences: ['Fall from Elevation', 'Traumatic Brain / Spinal Trauma', 'Fatality'],
        iogpRules: ['Working at Height'],
        explanation: hasControlFailure
          ? 'HIGH SIF Precursor (MOCK): Unprotected personnel exposure to elevation fall hazard without active 100% tie-off fall arrest engagement.'
          : 'LOW Risk (MOCK): Height observation with fall barriers maintained.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'WORKING_AT_HEIGHT_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 5. Line of Fire & Mechanical Lifting
    if (text.includes('crane') || text.includes('lift') || text.includes('suspended') || text.includes('rigging') || text.includes('line of fire') || text.includes('drop')) {
      return {
        sifPotential: true,
        confidence: 0.91,
        riskLevel: RiskLevel.HIGH,
        hazards: ['Suspended Heavy Machinery / Load', 'Stored Dynamic Gravitational Energy', 'Crane Rigging Failure'],
        exposures: ['Personnel stationed directly in load path / drop zone'],
        criticalControls: ['Exclusion Zone Barricading', 'Tagline Guidance', 'Certified Rigging Gear & Lift Plan'],
        controlFailures: ['Personnel entered active exclusion drop zone beneath suspended load'],
        barrierStatus: 'Bypassed',
        potentialConsequences: ['Crush Injury', 'Struck-by Heavy Machinery', 'Fatality'],
        iogpRules: ['Line of Fire', 'Safe Mechanical Lifting'],
        explanation: 'HIGH SIF Precursor (MOCK): Personnel positioned directly beneath suspended heavy load inside the fatal line of fire.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'LINE_OF_FIRE_LIFTING_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 6. Driving / Vehicle Safety
    if (text.includes('driving') || text.includes('speed') || text.includes('vehicle') || text.includes('seatbelt') || text.includes('truck')) {
      return {
        sifPotential: false,
        confidence: 0.42,
        riskLevel: RiskLevel.MEDIUM,
        hazards: ['Moving Heavy Vehicle', 'Road Traffic Hazard', 'Loss of Vehicle Control'],
        exposures: ['Driver and vehicle occupants'],
        criticalControls: ['Mandatory Seatbelt Compliance', 'Speed Limiter / In-Vehicle Monitoring System (IVMS)', 'Journey Management Plan'],
        controlFailures: ['Vehicle speed or restraint protocol violation'],
        barrierStatus: 'Partially Bypassed',
        potentialConsequences: ['Vehicle Collision', 'Rollover', 'Moderate Injury'],
        iogpRules: ['Driving'],
        explanation: 'MEDIUM Risk (MOCK): Mobile equipment / vehicle compliance deviation with moderate consequence potential.',
        modelVersion: this.modelVersion,
        ontologyVersion: this.ontologyVersion,
        rawResponse: {
          provider: this.providerName,
          simulated: true,
          matchedRule: 'DRIVING_SAFETY_RULE',
          evaluatedAt: new Date().toISOString(),
        },
      };
    }

    // 7. General / Baseline Low-Risk Observation
    return {
      sifPotential: false,
      confidence: 0.10,
      riskLevel: RiskLevel.LOW,
      hazards: ['General Industrial Observation'],
      exposures: [],
      criticalControls: ['Standard Operating Procedures', 'Routine Site Housekeeping'],
      controlFailures: [],
      barrierStatus: 'Not Applicable / Intact',
      potentialConsequences: ['Minor Slip / Trip / Strain'],
      iogpRules: [],
      explanation: 'LOW Risk (MOCK): Routine observation without high-energy hazards or critical safety barrier failures detected.',
      modelVersion: this.modelVersion,
      ontologyVersion: this.ontologyVersion,
      rawResponse: {
        provider: this.providerName,
        simulated: true,
        matchedRule: 'BASELINE_DEFAULT_RULE',
        evaluatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Primary interface method: analyze(text: string)
   */
  async analyze(text) {
    return this.analyzeReport({ reportText: text });
  }
}

const mockAiService = new MockAIAnalysisService();

module.exports = {
  MockAIAnalysisService,
  mockAiService,
};
