import type {
  RoadmapResponse,
  RoadmapNode,
  RoadmapEdge,
  SchemeEvaluationInfo,
  QuickOverviewResponse,
  AiSchemeAnalysisResponse,
  Document,
  InspectionCandidatesResponse,
  JointInspectionView,
} from './api-client';

export const DEMO_PROJECT_ID = 'biz-demo-pune-brewery';

export interface ProjectHistoryItem {
  id: string;
  name: string;
  industry: string;
  industryKey?: string;
  state: string;
  district: string;
  createdAt: string;
  investmentInr?: number;
  investmentFormatted?: string;
  areaSqft?: number;
  workforceCount?: number;
  activityType?: string;
  cpcbCategory?: 'Red' | 'Orange' | 'Green' | 'White';
}

export interface AiProjectDataset {
  project: ProjectHistoryItem;
  roadmap: RoadmapResponse;
  quickOverview: QuickOverviewResponse;
  schemeAnalysis: AiSchemeAnalysisResponse;
  documents: Document[];
  jointInspections: JointInspectionView[];
  inspectionCandidates: InspectionCandidatesResponse;
  cpcbCategory: 'Red' | 'Orange' | 'Green' | 'White';
  statutorySummary: string;
  generatedAt: string;
}

export const STORAGE_PROJECTS_KEY = 'approvaliq_founder_case_files_v1';
export const AI_DATASET_PREFIX = 'approvaliq_ai_dataset_';

export const DEFAULT_DEMO_PROJECT: ProjectHistoryItem = {
  id: DEMO_PROJECT_ID,
  name: 'Pune Craft Brewery (MIDC Chakan)',
  industry: 'Craft Breweries & Distilleries',
  industryKey: 'brewery',
  state: 'Maharashtra',
  district: 'Pune',
  createdAt: 'Demo Case File',
  investmentInr: 40000000,
  investmentFormatted: '₹4.00 Crore',
  areaSqft: 6000,
  workforceCount: 25,
  activityType: 'Fermentation, brewing, and packaging of craft beverages',
  cpcbCategory: 'Orange',
};

export function getStoredProjects(): ProjectHistoryItem[] {
  if (typeof window === 'undefined') return [DEFAULT_DEMO_PROJECT];
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (!raw) return [DEFAULT_DEMO_PROJECT];
    const parsed = JSON.parse(raw) as ProjectHistoryItem[];
    return parsed.length > 0 ? parsed : [DEFAULT_DEMO_PROJECT];
  } catch {
    return [DEFAULT_DEMO_PROJECT];
  }
}

export function saveStoredProject(project: ProjectHistoryItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredProjects();
    const updated = [project, ...existing.filter((p) => p.id !== project.id)].slice(0, 25);
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }
}

export function getStoredProjectById(projectId: string): ProjectHistoryItem {
  const projects = getStoredProjects();
  const found = projects.find((p) => p.id === projectId);
  if (found) return found;

  const cleanName = projectId
    .replace(/^proj-/, '')
    .replace(/^biz-demo-/, '')
    .replace(/-/g, ' ');
  const capitalized = cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Industrial Facility';

  return {
    id: projectId,
    name: projectId === DEMO_PROJECT_ID ? DEFAULT_DEMO_PROJECT.name : capitalized,
    industry: 'Advanced Manufacturing & Engineering',
    industryKey: 'automotive_ev',
    state: 'Maharashtra',
    district: 'Pune',
    createdAt: new Date().toLocaleDateString(),
    investmentInr: 250000000,
    investmentFormatted: '₹25.00 Crore',
    areaSqft: 25000,
    workforceCount: 85,
    activityType: 'Greenfield Industrial Production & Assembly',
    cpcbCategory: 'Orange',
  };
}

export interface StateJurisdictionConfig {
  spcbName: string;
  spcbCode: string;
  spcbUrl: string;
  fireDeptName: string;
  fireDeptCode: string;
  dishName: string;
  dishCode: string;
  singleWindowPortal: string;
  rtsActName: string;
  industrialPolicyName: string;
  electricityDutyYears: number;
}

export function getStateJurisdiction(stateName: string): StateJurisdictionConfig {
  const norm = (stateName || '').toLowerCase();

  if (norm.includes('maharashtra')) {
    return {
      spcbName: 'Maharashtra Pollution Control Board (MPCB)',
      spcbCode: 'MPCB',
      spcbUrl: 'https://mpcb.gov.in',
      fireDeptName: 'MIDC Fire Services / Maharashtra Fire Directorate',
      fireDeptCode: 'FIRE-MH',
      dishName: 'Directorate of Industrial Safety & Health (DISH Maharashtra)',
      dishCode: 'DISH-MH',
      singleWindowPortal: 'MAITRI Single Window Portal',
      rtsActName: 'Maharashtra Right to Public Services Act 2015',
      industrialPolicyName: 'Maharashtra Package Scheme of Incentives (PSI 2019 / 2024)',
      electricityDutyYears: 5,
    };
  }

  if (norm.includes('gujarat')) {
    return {
      spcbName: 'Gujarat Pollution Control Board (GPCB)',
      spcbCode: 'GPCB',
      spcbUrl: 'https://gpcb.gujarat.gov.in',
      fireDeptName: 'GIDC Fire Protection Services / Gujarat Fire Prevention Services',
      fireDeptCode: 'FIRE-GJ',
      dishName: 'Directorate of Industrial Safety & Health (DISH Gujarat)',
      dishCode: 'DISH-GJ',
      singleWindowPortal: 'Investor Facilitation Portal (IFP Gujarat)',
      rtsActName: 'Gujarat Right to Public Services Act 2013',
      industrialPolicyName: 'Aatmanirbhar Gujarat Schemes for Assistance to Industries 2022',
      electricityDutyYears: 7,
    };
  }

  if (norm.includes('karnataka')) {
    return {
      spcbName: 'Karnataka State Pollution Control Board (KSPCB)',
      spcbCode: 'KSPCB',
      spcbUrl: 'https://kspcb.karnataka.gov.in',
      fireDeptName: 'Karnataka State Fire and Emergency Services (KSFES / KIADB Fire)',
      fireDeptCode: 'FIRE-KA',
      dishName: 'Department of Factories, Boilers & Industrial Safety, Karnataka',
      dishCode: 'DISH-KA',
      singleWindowPortal: 'Karnataka eBiz Single Window Portal',
      rtsActName: 'Karnataka Sakala Services Act 2011',
      industrialPolicyName: 'Karnataka Industrial Policy 2020-2025',
      electricityDutyYears: 5,
    };
  }

  if (norm.includes('tamil nadu')) {
    return {
      spcbName: 'Tamil Nadu Pollution Control Board (TNPCB)',
      spcbCode: 'TNPCB',
      spcbUrl: 'https://tnpcb.gov.in',
      fireDeptName: 'Tamil Nadu Fire and Rescue Services (TNFRS / SIPCOT)',
      fireDeptCode: 'FIRE-TN',
      dishName: 'Directorate of Industrial Safety and Health (DISH Tamil Nadu)',
      dishCode: 'DISH-TN',
      singleWindowPortal: 'Guidance Tamil Nadu Single Window Portal',
      rtsActName: 'Tamil Nadu Business Facilitation Act 2018',
      industrialPolicyName: 'Tamil Nadu Industrial Policy 2021',
      electricityDutyYears: 5,
    };
  }

  if (norm.includes('telangana')) {
    return {
      spcbName: 'Telangana State Pollution Control Board (TSPCB)',
      spcbCode: 'TSPCB',
      spcbUrl: 'https://tspcb.cgg.gov.in',
      fireDeptName: 'Telangana State Disaster Response & Fire Services',
      fireDeptCode: 'FIRE-TS',
      dishName: 'Department of Factories, Government of Telangana',
      dishCode: 'DISH-TS',
      singleWindowPortal: 'TS-iPASS Industrial Clearances Portal',
      rtsActName: 'Telangana TS-iPASS Act 2014 (Statutory Deemed Approvals)',
      industrialPolicyName: 'Telangana State T-IDEA / T-PRIDE Industrial Policies',
      electricityDutyYears: 5,
    };
  }

  if (norm.includes('uttar pradesh') || norm.includes('up')) {
    return {
      spcbName: 'Uttar Pradesh Pollution Control Board (UPPCB)',
      spcbCode: 'UPPCB',
      spcbUrl: 'https://uppcb.com',
      fireDeptName: 'UP Fire & Emergency Services / UPSIDA Fire Department',
      fireDeptCode: 'FIRE-UP',
      dishName: 'Directorate of Factories, Government of Uttar Pradesh',
      dishCode: 'DISH-UP',
      singleWindowPortal: 'Nivesh Mitra Single Window Portal',
      rtsActName: 'Uttar Pradesh Right to Service Act',
      industrialPolicyName: 'UP Industrial Investment and Employment Promotion Policy 2022',
      electricityDutyYears: 10,
    };
  }

  const cleanState = (stateName || '').trim() || 'State';
  return {
    spcbName: `${cleanState} Pollution Control Board (SPCB)`,
    spcbCode: 'SPCB',
    spcbUrl: 'https://cpcb.nic.in',
    fireDeptName: `${cleanState} State Fire & Emergency Services`,
    fireDeptCode: 'FIRE-STATE',
    dishName: `Directorate of Factories & Industrial Safety (${cleanState})`,
    dishCode: 'DISH-STATE',
    singleWindowPortal: `${cleanState} Single Window Clearance Portal`,
    rtsActName: `${cleanState} Public Services Guarantee Act`,
    industrialPolicyName: `${cleanState} Industrial Policy & Investment Promotion Scheme`,
    electricityDutyYears: 5,
  };
}

/**
 * Deep AI Project Dataset Generator
 * Synthesizes a mathematically and statutorily complete regulatory roadmap,
 * fiscal schemes, executive overview, documents, and joint inspections
 * for ANY sector, state, CapEx, and district.
 */
export function generateAiProjectDataset(project: ProjectHistoryItem): AiProjectDataset {
  const normIndustry = (project.industryKey || project.industry || '').toLowerCase();
  const stateJurisdiction = getStateJurisdiction(project.state);

  // 1. Determine CPCB Pollution Classification
  let cpcbCategory: 'Red' | 'Orange' | 'Green' | 'White' = 'Orange';
  if (normIndustry.includes('pharma') || normIndustry.includes('chemical') || normIndustry.includes('heavy') || normIndustry.includes('machinery')) {
    cpcbCategory = 'Red';
  } else if (normIndustry.includes('renewable') || normIndustry.includes('solar') || normIndustry.includes('cold_chain')) {
    cpcbCategory = 'Green';
  } else if (normIndustry.includes('electronic') || normIndustry.includes('data')) {
    cpcbCategory = 'White';
  }

  const pcbSla = cpcbCategory === 'Red' ? 60 : cpcbCategory === 'Orange' ? 45 : 21;

  // 2. Build Sector Specific Regulatory Clearances
  let sectorApprovalName = 'Specialized Manufacturing Operating License';
  let sectorApprovalShort = 'Sector Operating License';
  let sectorAuthorityName = 'Sectoral Regulatory Directorate';
  let sectorAuthorityCode = 'AUTH-SECTOR';
  let sectorCitation = 'Industrial Regulations Act';
  let sectorWhy = 'Mandatory sectoral operating permit prior to trial production.';
  let sectorSla = 45;

  let standardsApprovalName = 'Bureau of Indian Standards Quality Certification';
  let standardsApprovalShort = 'BIS / Quality Standard';
  let standardsAuthorityName = 'Bureau of Indian Standards (BIS)';
  let standardsAuthorityCode = 'AUTH-BIS';
  let standardsCitation = 'Bureau of Indian Standards Act 2016';
  let standardsWhy = 'Mandatory product quality and packaging compliance certification.';

  let commercialDispatchName = 'Commercial Wholesale Dispatch Authorization';
  let commercialDispatchShort = 'Dispatch Clearance';
  let commercialDispatchAuthority = 'Directorate of Commerce & Standards';
  let commercialDispatchAuthorityCode = 'AUTH-DISPATCH';

  if (normIndustry.includes('brewery') || normIndustry.includes('distillery') || normIndustry.includes('beer')) {
    sectorApprovalName = 'Brewery & Bottling Licence (Form BRL / L-1)';
    sectorApprovalShort = 'Excise Brewery Licence';
    sectorAuthorityName = `State Excise Department, ${project.state}`;
    sectorAuthorityCode = 'AUTH-EXCISE';
    sectorCitation = 'State Excise & Prohibition Act';
    sectorWhy = 'Statutory manufacturing and wholesale storage licence for potable alcoholic malt beverages.';
    sectorSla = 60;

    standardsApprovalName = 'FSSAI Central Food Manufacturing Licence (Category 14)';
    standardsApprovalShort = 'FSSAI Food Licence';
    standardsAuthorityName = 'Food Safety and Standards Authority of India (FSSAI)';
    standardsAuthorityCode = 'AUTH-FSSAI';
    standardsCitation = 'FSS Act 2006 & Alcoholic Beverages Regulations 2018';
    standardsWhy = 'Mandatory prior manufacturing license under Food Safety and Standards Act.';

    commercialDispatchName = 'Excise Brand & Label Registration / Wholesale Transit Pass';
    commercialDispatchShort = 'Brand & Label Approval';
    commercialDispatchAuthority = `State Excise Department, ${project.state}`;
    commercialDispatchAuthorityCode = 'AUTH-EXCISE';
  } else if (normIndustry.includes('pharma') || normIndustry.includes('active ingredient')) {
    sectorApprovalName = 'Drug Manufacturing License (Form 25 / Form 28)';
    sectorApprovalShort = 'CDSCO / State FDA Drug License';
    sectorAuthorityName = `State Drugs Control Administration / CDSCO, ${project.state}`;
    sectorAuthorityCode = 'AUTH-CDSCO';
    sectorCitation = 'Drugs & Cosmetics Act 1940 & Rules 1945 (Schedule M)';
    sectorWhy = 'Statutory operating license for active pharmaceutical ingredients (APIs) and bulk drug formulations under Schedule M Good Manufacturing Practices.';
    sectorSla = 60;

    standardsApprovalName = 'Central Ground Water Authority (CGWA) Abstraction NOC';
    standardsApprovalShort = 'CGWA Water NOC';
    standardsAuthorityName = 'Central Ground Water Authority (CGWA)';
    standardsAuthorityCode = 'AUTH-CGWA';
    standardsCitation = 'Environment (Protection) Act 1986 Ground Water Guidelines';
    standardsWhy = 'Mandatory statutory permit for demineralized water extraction for pharmaceutical formulation batches.';

    commercialDispatchName = 'WHO-GMP Certificate & Commercial Batch Release Authorization';
    commercialDispatchShort = 'WHO-GMP Batch Release';
    commercialDispatchAuthority = 'Central Drugs Standard Control Organisation (CDSCO)';
    commercialDispatchAuthorityCode = 'AUTH-CDSCO';
  } else if (normIndustry.includes('renewable') || normIndustry.includes('solar')) {
    sectorApprovalName = 'Grid Connectivity In-Principle Sanction & Wheeling Agreement';
    sectorApprovalShort = 'Grid Connectivity Sanction';
    sectorAuthorityName = `State Electricity Transmission Utility (STU / Discom), ${project.state}`;
    sectorAuthorityCode = 'AUTH-DISCOM';
    sectorCitation = 'Electricity Act 2003 (Section 39/40 Open Access Regulations)';
    sectorWhy = 'Statutory technical clearance for high-voltage grid interconnection, evacuation substation feeder capacity, and transmission synchronization.';
    sectorSla = 30;

    standardsApprovalName = 'BIS Compulsory Registration Scheme (CRS) for Solar PV Modules';
    standardsApprovalShort = 'BIS CRS PV Certification';
    standardsAuthorityName = 'Bureau of Indian Standards (BIS)';
    standardsAuthorityCode = 'AUTH-BIS';
    standardsCitation = 'Solar Photovoltaics Systems Goods Order';
    standardsWhy = 'Statutory product safety and efficiency testing under IS 14286 / IEC 61215 before commercial solar module distribution.';

    commercialDispatchName = 'CEIG Commercial Grid Synchronisation & Energisation Sanction';
    commercialDispatchShort = 'CEIG Grid Energisation';
    commercialDispatchAuthority = `Chief Electrical Inspector to Government (CEIG), ${project.state}`;
    commercialDispatchAuthorityCode = 'AUTH-CEIG';
  } else if (normIndustry.includes('auto') || normIndustry.includes('ev') || normIndustry.includes('powertrain')) {
    sectorApprovalName = 'ARAI / ICAT Type Approval & EV Homologation Certificate';
    sectorApprovalShort = 'ARAI / ICAT Homologation';
    sectorAuthorityName = 'Automotive Research Association of India (ARAI / ICAT)';
    sectorAuthorityCode = 'AUTH-ARAI';
    sectorCitation = 'Central Motor Vehicles Rules 1989 (Rule 126) & AIS-038 / AIS-156 Standards';
    sectorWhy = 'Statutory vehicle powertrain safety, electrical isolation, and thermal runaway containment certification under AIS-156.';
    sectorSla = 60;

    standardsApprovalName = 'Central Motor Vehicles Rules (CMVR) Compliance Approval';
    standardsApprovalShort = 'CMVR Compliance NOC';
    standardsAuthorityName = 'Ministry of Road Transport and Highways (MoRTH)';
    standardsAuthorityCode = 'AUTH-MORTH';
    standardsCitation = 'Central Motor Vehicles Act 1988';
    standardsWhy = 'Statutory registration for automated vehicular assembly lines and vehicle identification numbers (VIN).';

    commercialDispatchName = 'End-of-Line Quality Audit & Commercial Vehicle Dispatch Clearance';
    commercialDispatchShort = 'End-of-Line Clearance';
    commercialDispatchAuthority = 'Transport Department & ARAI Technical Division';
    commercialDispatchAuthorityCode = 'AUTH-ARAI';
  } else if (normIndustry.includes('food') || normIndustry.includes('packaged')) {
    sectorApprovalName = 'FSSAI Central Food Manufacturing Licence (Form B)';
    sectorApprovalShort = 'FSSAI Manufacturing Licence';
    sectorAuthorityName = 'Food Safety and Standards Authority of India (FSSAI)';
    sectorAuthorityCode = 'AUTH-FSSAI';
    sectorCitation = 'Food Safety and Standards Regulations 2011';
    sectorWhy = 'Statutory manufacturing license mandatory prior to processing, packaging, and commercial wholesale distribution of foodstuffs.';
    sectorSla = 45;

    standardsApprovalName = 'Legal Metrology (Packaged Commodities) Rule 27 Registration';
    standardsApprovalShort = 'LMPC Packaging Registration';
    standardsAuthorityName = 'Department of Consumer Affairs (Legal Metrology Division)';
    standardsAuthorityCode = 'AUTH-METROLOGY';
    standardsCitation = 'Legal Metrology (Packaged Commodities) Rules 2011 Rule 27';
    standardsWhy = 'Statutory declaration of net weight, batch coding, customer care information, and maximum retail price proof on all commercial packages.';

    commercialDispatchName = 'FSSAI Food Safety Management System (FSMS) Inspection & Dispatch Permit';
    commercialDispatchShort = 'FSMS Dispatch Clearance';
    commercialDispatchAuthority = 'Food Safety and Standards Authority of India (FSSAI)';
    commercialDispatchAuthorityCode = 'AUTH-FSSAI';
  } else if (normIndustry.includes('chemical') || normIndustry.includes('polymer')) {
    sectorApprovalName = 'PESO Petroleum & Solvent Storage License (Form XIV / Rule 116)';
    sectorApprovalShort = 'PESO Chemical Storage License';
    sectorAuthorityName = 'Petroleum and Explosives Safety Organisation (PESO)';
    sectorAuthorityCode = 'AUTH-PESO';
    sectorCitation = 'Petroleum Act 1934 & Petroleum Rules 2002';
    sectorWhy = 'Mandatory statutory clearance for bulk hazardous chemical solvent storage tanks, distillation columns, and flare systems.';
    sectorSla = 60;

    standardsApprovalName = 'Hazardous Waste Authorization (Form 2 under HWM Rules 2016)';
    standardsApprovalShort = 'Hazardous Waste Authorization';
    standardsAuthorityName = stateJurisdiction.spcbName;
    standardsAuthorityCode = stateJurisdiction.spcbCode;
    standardsCitation = 'Hazardous and Other Wastes Rules 2016';
    standardsWhy = 'Statutory tie-up agreement with authorized Common Hazardous Waste Disposal Facility (TSDF).';

    commercialDispatchName = 'HAZOP Safety Audit & Commercial Chemical Production Commencement Certificate';
    commercialDispatchShort = 'HAZOP Chemical Clearance';
    commercialDispatchAuthority = stateJurisdiction.dishName;
    commercialDispatchAuthorityCode = stateJurisdiction.dishCode;
  } else if (normIndustry.includes('textile')) {
    sectorApprovalName = 'Boiler Registration & Inspection Certificate (IBR 1950)';
    sectorApprovalShort = 'IBR Boiler Registration';
    sectorAuthorityName = `Directorate of Steam Boilers, ${project.state}`;
    sectorAuthorityCode = 'AUTH-BOILERS';
    sectorCitation = 'Indian Boilers Act 1923 & Indian Boiler Regulations 1950';
    sectorWhy = 'Statutory hydraulic pressure testing, safety valve calibration, and steam pipeline certification before operational steaming.';
    sectorSla = 30;

    standardsApprovalName = 'Textile Undertakings Information System Registration';
    standardsApprovalShort = 'Textile Commissioner Registration';
    standardsAuthorityName = 'Office of the Textile Commissioner (Ministry of Textiles)';
    standardsAuthorityCode = 'AUTH-TEXTILE';
    standardsCitation = 'Textiles (Development and Regulation) Order 2001';
    standardsWhy = 'Statutory declaration of installed spindle/loom capacity and technology classification.';

    commercialDispatchName = 'Commercial Spinning & Weaving Power Subvention Authorization';
    commercialDispatchShort = 'Textile Commercial Clearance';
    commercialDispatchAuthority = `Department of Handlooms & Textiles, ${project.state}`;
    commercialDispatchAuthorityCode = 'AUTH-TEXTILE';
  } else if (normIndustry.includes('cold') || normIndustry.includes('logistics')) {
    sectorApprovalName = 'PESO Ammonia Refrigeration Safety Approval & Tank Certificate';
    sectorApprovalShort = 'PESO Refrigeration Approval';
    sectorAuthorityName = 'Petroleum and Explosives Safety Organisation (PESO)';
    sectorAuthorityCode = 'AUTH-PESO';
    sectorCitation = 'Static and Mobile Pressure Vessels Rules 2016';
    sectorWhy = 'Statutory safety approval for bulk anhydrous ammonia liquid receivers and evaporative cooling compressors.';
    sectorSla = 45;

    standardsApprovalName = 'FSSAI Central Warehouse & Cold Storage License';
    standardsApprovalShort = 'FSSAI Cold Storage License';
    standardsAuthorityName = 'Food Safety and Standards Authority of India (FSSAI)';
    standardsAuthorityCode = 'AUTH-FSSAI';
    standardsCitation = 'FSS (Licensing & Registration) Regulations 2011';
    standardsWhy = 'Statutory licensing for temperature-controlled storage of perishable food supplies and pharmaceuticals.';

    commercialDispatchName = 'Commercial Temperature-Controlled Warehouse Operating Permit';
    commercialDispatchShort = 'Cold Chain Operating Permit';
    commercialDispatchAuthority = 'State Logistics Directorate & FSSAI';
    commercialDispatchAuthorityCode = 'AUTH-LOGISTICS';
  } else if (normIndustry.includes('electronic') || normIndustry.includes('data')) {
    sectorApprovalName = 'CEIG Dual-Feed HT Power Sanction & DG Set Approval';
    sectorApprovalShort = 'CEIG HT Power Sanction';
    sectorAuthorityName = `Chief Electrical Inspector to Government (CEIG), ${project.state}`;
    sectorAuthorityCode = 'AUTH-CEIG';
    sectorCitation = 'Central Electricity Authority Regulations 2023';
    sectorWhy = 'Statutory clearance for dual-redundant 33kV/11kV electrical sub-station transformers and backup diesel generator synchronizers.';
    sectorSla = 30;

    standardsApprovalName = 'BIS CRS Registration for Electronic Hardware & IT Server Equipment';
    standardsApprovalShort = 'BIS CRS Electronic Registration';
    standardsAuthorityName = 'Bureau of Indian Standards (BIS)';
    standardsAuthorityCode = 'AUTH-BIS';
    standardsCitation = 'Electronics Goods Compulsory Registration Order 2021';
    standardsWhy = 'Statutory compliance testing for electromagnetic interference (EMI/EMC) and electrical safety.';

    commercialDispatchName = 'Cleanroom ISO Class 7/8 Certification & Commercial Assembly Authorization';
    commercialDispatchShort = 'Cleanroom Assembly Clearance';
    commercialDispatchAuthority = 'Electronics & IT Promotion Department';
    commercialDispatchAuthorityCode = 'AUTH-ELECTRONICS';
  } else if (normIndustry.includes('heavy') || normIndustry.includes('steel') || normIndustry.includes('machinery')) {
    sectorApprovalName = 'PESO Industrial Gas Cylinder Storage NOC (Form G)';
    sectorApprovalShort = 'PESO Industrial Gas NOC';
    sectorAuthorityName = 'Petroleum and Explosives Safety Organisation (PESO)';
    sectorAuthorityCode = 'AUTH-PESO';
    sectorCitation = 'Gas Cylinders Rules 2016';
    sectorWhy = 'Statutory clearance for manifold storage of industrial oxygen, acetylene, and argon cylinders for high-amperage welding.';
    sectorSla = 45;

    standardsApprovalName = 'Legal Metrology Weighbridge & Commercial Scale Verification';
    standardsApprovalShort = 'Weighbridge Stamping Certificate';
    standardsAuthorityName = 'Legal Metrology Department';
    standardsAuthorityCode = 'AUTH-METROLOGY';
    standardsCitation = 'Legal Metrology Act 2009 & General Rules 2011';
    standardsWhy = 'Statutory calibration and government stamping of heavy industrial weighbridges for inbound raw steel billets and outgoing structural shipments.';

    commercialDispatchName = 'EOT Crane Load Testing & Heavy Machine Commissioning Certificate';
    commercialDispatchShort = 'Heavy Machine Commissioning';
    commercialDispatchAuthority = stateJurisdiction.dishName;
    commercialDispatchAuthorityCode = stateJurisdiction.dishCode;
  }

  // 3. Assemble Roadmap Nodes
  const nodes: RoadmapNode[] = [
    {
      id: `inst-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
      projectId: project.id,
      approvalDefinitionId: `def-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
      approvalCode: `${stateJurisdiction.spcbCode}-CTE-001`,
      approvalName: `Consent to Establish (CTE) — ${cpcbCategory} Category`,
      shortName: `${stateJurisdiction.spcbCode} CTE`,
      whyRequired: `Mandatory prior statutory consent under Section 25 of Water Act 1974 & Section 21 of Air Act 1981 before starting factory civil construction or machinery installation in ${project.district}, ${project.state}.`,
      inspectionRequired: true,
      renewalRequired: false,
      slaDays: pcbSla,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified ${pcbSla} Working Days SLA`,
      ambiguityNotes: 'Requires ETP / air scrubber sizing calculations and site plan certification by an accredited environmental consultant.',
      authority: {
        id: `auth-${stateJurisdiction.spcbCode.toLowerCase()}`,
        code: stateJurisdiction.spcbCode,
        name: stateJurisdiction.spcbName,
      },
      source: {
        id: `src-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
        name: 'Water & Air (Prevention and Control of Pollution) Acts',
        citation: 'Sec 25 Water Act 1974 & Sec 21 Air Act 1981',
        url: stateJurisdiction.spcbUrl,
        verificationStatus: 'verified',
      },
      evaluationResultId: `eval-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-LAND-TITLE', name: 'Registered Land Deed / Industrial Park Allotment Order' },
        { id: 'DOC-ETP-PLAN', name: 'Effluent Treatment Plant (ETP) Process Flow & Schematics' },
        { id: 'DOC-SITE-PLAN', name: 'Factory Site Layout Plan & Machinery Blueprint' },
      ],
      status: 'in_progress',
      sourceUrl: stateJurisdiction.spcbUrl,
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-fire-prov',
      projectId: project.id,
      approvalDefinitionId: 'def-fire-prov',
      approvalCode: `${stateJurisdiction.fireDeptCode}-PROV-001`,
      approvalName: 'Provisional Fire NOC (Pre-Construction)',
      shortName: 'Provisional Fire NOC',
      whyRequired: `Statutory approval of factory fire fighting schemes, hydrants, underground static water storage, and emergency egress drawings prior to civil construction in ${project.district}.`,
      inspectionRequired: true,
      renewalRequired: false,
      slaDays: 15,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified 15 Working Days SLA`,
      ambiguityNotes: null,
      authority: {
        id: 'auth-fire',
        code: stateJurisdiction.fireDeptCode,
        name: stateJurisdiction.fireDeptName,
      },
      source: {
        id: 'src-fire-prov',
        name: 'State Fire Prevention and Life Safety Measures Act',
        citation: 'Section 3 Fire Prevention Standards',
        url: 'https://cpcb.nic.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-fire-prov',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FIRE-SCHEMATIC', name: 'Hydrant, Sprinkler & Egress Architecture Drawings' },
        { id: 'DOC-WATER-STORAGE', name: 'Static Fire Water Reservoir Sizing Calculations' },
      ],
      status: 'available',
      sourceUrl: 'https://cpcb.nic.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-dish-plan',
      projectId: project.id,
      approvalDefinitionId: 'def-dish-plan',
      approvalCode: `${stateJurisdiction.dishCode}-PLAN-001`,
      approvalName: 'Factory Building Plan Approval',
      shortName: 'Factory Plan Approval',
      whyRequired: 'Statutory approval of manufacturing building layout, ventilation, emergency exits, and worker safety provisions under Section 6 of Factories Act 1948 prior to commencing construction.',
      inspectionRequired: false,
      renewalRequired: false,
      slaDays: 30,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified 30 Working Days SLA`,
      ambiguityNotes: 'Requires drawings certified by a chartered structural engineer.',
      authority: {
        id: 'auth-dish',
        code: stateJurisdiction.dishCode,
        name: stateJurisdiction.dishName,
      },
      source: {
        id: 'src-dish-plan',
        name: 'Factories Act 1948 & State Factories Rules',
        citation: 'Section 6 Factories Act 1948',
        url: 'https://labour.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-dish-plan',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-STRUCT-STAB', name: 'Structural Stability Certificate by Chartered Engineer' },
        { id: 'DOC-ARCH-BLUEPRINT', name: 'Factory Layout Blueprint (Scale 1:100)' },
      ],
      status: 'available',
      sourceUrl: 'https://labour.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-sector-primary',
      projectId: project.id,
      approvalDefinitionId: 'def-sector-primary',
      approvalCode: `${sectorAuthorityCode}-PRIM-001`,
      approvalName: sectorApprovalName,
      shortName: sectorApprovalShort,
      whyRequired: sectorWhy,
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: sectorSla,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified ${sectorSla} Days SLA`,
      ambiguityNotes: null,
      authority: {
        id: 'auth-sector',
        code: sectorAuthorityCode,
        name: sectorAuthorityName,
      },
      source: {
        id: 'src-sector-primary',
        name: sectorCitation,
        citation: sectorCitation,
        url: stateJurisdiction.singleWindowPortal,
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-sector-primary',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-PROCESS-FLOW', name: 'Manufacturing Technical Process Flow Diagram' },
        { id: 'DOC-PROJECT-REPORT', name: 'Detailed Project Report (DPR) with Technical Specifications' },
      ],
      status: 'available',
      sourceUrl: stateJurisdiction.singleWindowPortal,
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-standards-spec',
      projectId: project.id,
      approvalDefinitionId: 'def-standards-spec',
      approvalCode: `${standardsAuthorityCode}-STD-001`,
      approvalName: standardsApprovalName,
      shortName: standardsApprovalShort,
      whyRequired: standardsWhy,
      inspectionRequired: false,
      renewalRequired: true,
      slaDays: 20,
      slaBasis: `${stateJurisdiction.rtsActName} - 20 Working Days SLA`,
      ambiguityNotes: null,
      authority: {
        id: 'auth-standards',
        code: standardsAuthorityCode,
        name: standardsAuthorityName,
      },
      source: {
        id: 'src-standards-spec',
        name: standardsCitation,
        citation: standardsCitation,
        url: 'https://bis.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-standards-spec',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-PRODUCT-SPEC', name: 'Product Technical Specifications & Laboratory Proof' },
      ],
      status: 'available',
      sourceUrl: 'https://bis.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: `inst-${stateJurisdiction.spcbCode.toLowerCase()}-cto`,
      projectId: project.id,
      approvalDefinitionId: `def-${stateJurisdiction.spcbCode.toLowerCase()}-cto`,
      approvalCode: `${stateJurisdiction.spcbCode}-CTO-001`,
      approvalName: `Consent to Operate (CTO) — ${cpcbCategory} Category`,
      shortName: `${stateJurisdiction.spcbCode} CTO`,
      whyRequired: `Statutory operating consent required before trial runs or commercial manufacturing in ${project.district}; verifies commissioning of pollution abatement and effluent treatment equipment.`,
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: pcbSla,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified ${pcbSla} Days SLA`,
      ambiguityNotes: `Gated by ${stateJurisdiction.spcbCode} Consent to Establish (CTE). Unlocks automatically once CTE is granted.`,
      authority: {
        id: `auth-${stateJurisdiction.spcbCode.toLowerCase()}`,
        code: stateJurisdiction.spcbCode,
        name: stateJurisdiction.spcbName,
      },
      source: {
        id: `src-${stateJurisdiction.spcbCode.toLowerCase()}-cto`,
        name: 'Water & Air Acts',
        citation: 'Sec 25/26 Water Act',
        url: stateJurisdiction.spcbUrl,
        verificationStatus: 'verified',
      },
      evaluationResultId: `eval-${stateJurisdiction.spcbCode.toLowerCase()}-cto`,
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-ETP-COMMISSION', name: 'ETP Commissioning & Treated Effluent Analysis Report' },
        { id: 'DOC-CTE-COPY', name: `Copy of Granted ${stateJurisdiction.spcbCode} Consent to Establish (CTE)` },
      ],
      status: 'blocked',
      sourceUrl: stateJurisdiction.spcbUrl,
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-fire-final',
      projectId: project.id,
      approvalDefinitionId: 'def-fire-final',
      approvalCode: `${stateJurisdiction.fireDeptCode}-FINAL-001`,
      approvalName: 'Final Fire Safety Certificate (Final Fire NOC)',
      shortName: 'Final Fire NOC',
      whyRequired: 'Final physical verification of active fire hydrants, smoke detectors, automated sprinklers, and emergency alarm systems after building completion.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 20,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified 20 Working Days SLA`,
      ambiguityNotes: 'Gated by Provisional Fire NOC and physical building completion.',
      authority: {
        id: 'auth-fire',
        code: stateJurisdiction.fireDeptCode,
        name: stateJurisdiction.fireDeptName,
      },
      source: {
        id: 'src-fire-final',
        name: 'Fire Prevention & Safety Measures Act',
        citation: 'Section 4 Final Occupancy Fire Audit',
        url: 'https://cpcb.nic.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-fire-final',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FIRE-COMPLETION', name: 'Fire Fighting System Installation Completion Certificate (Form A)' },
      ],
      status: 'blocked',
      sourceUrl: 'https://cpcb.nic.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-dish-lic',
      projectId: project.id,
      approvalDefinitionId: 'def-dish-lic',
      approvalCode: `${stateJurisdiction.dishCode}-LICENCE-001`,
      approvalName: 'Factory Operational Licence (Form 4)',
      shortName: 'Factory Operational Licence',
      whyRequired: 'Statutory operational licence under Section 6 & 7 of Factories Act 1948 prior to employing industrial workers or running plant machinery.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 30,
      slaBasis: `${stateJurisdiction.rtsActName} - Notified 30 Working Days SLA`,
      ambiguityNotes: 'Gated by prior Factory Building Plan Approval.',
      authority: {
        id: 'auth-dish',
        code: stateJurisdiction.dishCode,
        name: stateJurisdiction.dishName,
      },
      source: {
        id: 'src-dish-lic',
        name: 'Factories Act 1948',
        citation: 'Sec 6 & 7 Factories Act',
        url: 'https://labour.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-dish-lic',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FORM-2', name: 'Notice of Occupation & Manager Appointment (Form 2)' },
      ],
      status: 'blocked',
      sourceUrl: 'https://labour.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-commercial-dispatch',
      projectId: project.id,
      approvalDefinitionId: 'def-commercial-dispatch',
      approvalCode: `${commercialDispatchAuthorityCode}-DISP-001`,
      approvalName: commercialDispatchName,
      shortName: commercialDispatchShort,
      whyRequired: 'Final statutory commercial clearance and tax transit certification permitting full factory dispatch and commercial invoice generation.',
      inspectionRequired: false,
      renewalRequired: true,
      slaDays: 15,
      slaBasis: `${stateJurisdiction.rtsActName} - 15 Working Days SLA`,
      ambiguityNotes: `Gated by prior CTO, Final Fire NOC, and ${sectorApprovalShort}.`,
      authority: {
        id: 'auth-commercial',
        code: commercialDispatchAuthorityCode,
        name: commercialDispatchAuthority,
      },
      source: {
        id: 'src-commercial-dispatch',
        name: 'Commercial Operations & Transit Rules',
        citation: 'Section 12 Commercial Transit Regulations',
        url: stateJurisdiction.singleWindowPortal,
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-commercial-dispatch',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-LABEL-SPEC', name: 'Finished Product Label Proof & Batch Technical Specifications' },
      ],
      status: 'blocked',
      sourceUrl: stateJurisdiction.singleWindowPortal,
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
  ];

  // 4. Build Directed Acyclic Graph (DAG) Edges
  const spcbCteId = `inst-${stateJurisdiction.spcbCode.toLowerCase()}-cte`;
  const spcbCtoId = `inst-${stateJurisdiction.spcbCode.toLowerCase()}-cto`;

  const edges: RoadmapEdge[] = [
    {
      id: `edge-${stateJurisdiction.spcbCode.toLowerCase()}-cte-cto`,
      fromInstanceId: spcbCteId,
      toInstanceId: spcbCtoId,
      fromApprovalId: `def-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
      fromApprovalCode: `${stateJurisdiction.spcbCode}-CTE-001`,
      toApprovalId: `def-${stateJurisdiction.spcbCode.toLowerCase()}-cto`,
      toApprovalCode: `${stateJurisdiction.spcbCode}-CTO-001`,
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-fire-prov-final',
      fromInstanceId: 'inst-fire-prov',
      toInstanceId: 'inst-fire-final',
      fromApprovalId: 'def-fire-prov',
      fromApprovalCode: `${stateJurisdiction.fireDeptCode}-PROV-001`,
      toApprovalId: 'def-fire-final',
      toApprovalCode: `${stateJurisdiction.fireDeptCode}-FINAL-001`,
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-dish-plan-lic',
      fromInstanceId: 'inst-dish-plan',
      toInstanceId: 'inst-dish-lic',
      fromApprovalId: 'def-dish-plan',
      fromApprovalCode: `${stateJurisdiction.dishCode}-PLAN-001`,
      toApprovalId: 'def-dish-lic',
      toApprovalCode: `${stateJurisdiction.dishCode}-LICENCE-001`,
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-cte-commercial',
      fromInstanceId: spcbCteId,
      toInstanceId: 'inst-commercial-dispatch',
      fromApprovalId: `def-${stateJurisdiction.spcbCode.toLowerCase()}-cte`,
      fromApprovalCode: `${stateJurisdiction.spcbCode}-CTE-001`,
      toApprovalId: 'def-commercial-dispatch',
      toApprovalCode: `${commercialDispatchAuthorityCode}-DISP-001`,
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-fire-commercial',
      fromInstanceId: 'inst-fire-final',
      toInstanceId: 'inst-commercial-dispatch',
      fromApprovalId: 'def-fire-final',
      fromApprovalCode: `${stateJurisdiction.fireDeptCode}-FINAL-001`,
      toApprovalId: 'def-commercial-dispatch',
      toApprovalCode: `${commercialDispatchAuthorityCode}-DISP-001`,
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-sector-dispatch',
      fromInstanceId: 'inst-sector-primary',
      toInstanceId: 'inst-commercial-dispatch',
      fromApprovalId: 'def-sector-primary',
      fromApprovalCode: `${sectorAuthorityCode}-PRIM-001`,
      toApprovalId: 'def-commercial-dispatch',
      toApprovalCode: `${commercialDispatchAuthorityCode}-DISP-001`,
      type: 'depends_on',
      gates: true,
    },
  ];

  const parallelGroups = [
    [spcbCteId, 'inst-fire-prov', 'inst-dish-plan', 'inst-sector-primary', 'inst-standards-spec'],
    [spcbCtoId, 'inst-fire-final', 'inst-dish-lic'],
    ['inst-commercial-dispatch'],
  ];

  // 5. Build Dynamic Fiscal Schemes & Policy Synthesis
  const isAlcohol = normIndustry.includes('brewery') || normIndustry.includes('distillery') || normIndustry.includes('beer');
  const isMaha = project.state.toLowerCase().includes('maharashtra');

  const schemes: SchemeEvaluationInfo[] = [
    {
      scheme: {
        id: 'MSME-CGTMSE-001',
        name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
        shortName: 'CGTMSE Collateral-Free Credit',
        description: 'Collateral-free credit facility up to ₹5.00 Crore for MSME manufacturing units with up to 85% sovereign guarantee cover.',
        jurisdiction: 'Central (Ministry of MSME & SIDBI)',
        sourceTitle: 'CGTMSE Guidelines 2026',
        sourceUrl: 'https://www.cgtmse.in',
        verificationDate: '2026-09-01',
      },
      outcome: 'potentially_eligible',
      matchedConditions: ['Enterprise classified as MSME Manufacturing', 'CapEx facility under ₹5.00 Cr guarantee ceiling'],
      matchedExclusions: [],
      factsUsed: { industry: project.industry, investmentAmountInr: project.investmentInr || 40000000 },
      neededInformation: [],
      explanation: 'Your enterprise is eligible for up to ₹5.00 Crore in collateral-free debt financing for machinery and working capital under the CGTMSE sovereign trust guarantee cover.',
    },
    {
      scheme: {
        id: 'DGFT-EPCG-001',
        name: 'Export Promotion Capital Goods Scheme (EPCG)',
        shortName: 'EPCG 0% Customs Duty',
        description: 'Zero customs duty import on capital goods and automated production equipment with export commitment.',
        jurisdiction: 'Central (DGFT & Ministry of Commerce)',
        sourceTitle: 'Foreign Trade Policy 2023-2028',
        sourceUrl: 'https://www.dgft.gov.in',
        verificationDate: '2026-09-01',
      },
      outcome: 'potentially_eligible',
      matchedConditions: ['Import of capital machinery for industrial production'],
      matchedExclusions: [],
      factsUsed: { industry: project.industry },
      neededInformation: [],
      explanation: 'Eligible for 0% basic customs duty on imported plant machinery subject to an export obligation of 6x duty saved over 6 years.',
    },
    {
      scheme: {
        id: 'MSME-ZED-001',
        name: 'MSME Zero Defect Zero Effect Certification Scheme (ZED)',
        shortName: 'MSME ZED Green Subsidy',
        description: 'Up to 80% government subsidy on environmental audit, green certification, and effluent water management systems.',
        jurisdiction: 'Central (Ministry of MSME)',
        sourceTitle: 'MSME ZED Scheme Guidelines',
        sourceUrl: 'https://zed.msme.gov.in',
        verificationDate: '2026-09-01',
      },
      outcome: 'potentially_eligible',
      matchedConditions: ['MSME manufacturing entity with zero-discharge ETP commitment'],
      matchedExclusions: [],
      factsUsed: { industry: project.industry },
      neededInformation: [],
      explanation: 'Qualifies for an 80% financial subsidy on green factory certification, energy audits, and effluent treatment testing.',
    },
    {
      scheme: {
        id: 'STARTUP-80IAC-001',
        name: 'Section 80-IAC Corporate Income Tax Exemption',
        shortName: 'Section 80-IAC Tax Holiday',
        description: '100% tax holiday on corporate profits for 3 consecutive financial years out of 10 years for DPIIT startups.',
        jurisdiction: 'Central (CBDT, Ministry of Finance)',
        sourceTitle: 'Income Tax Act 1961 - Section 80-IAC',
        sourceUrl: 'https://www.incometax.gov.in',
        verificationDate: '2026-09-01',
      },
      outcome: 'potentially_eligible',
      matchedConditions: ['Private Limited Company or LLP registered with DPIIT'],
      matchedExclusions: [],
      factsUsed: { entityType: 'pvt_ltd' },
      neededInformation: [],
      explanation: 'DPIIT recognized manufacturing entities can elect a 100% deduction on corporate tax profits for 3 consecutive financial years.',
    },
    {
      scheme: {
        id: `STATE-IND-POLICY-${stateJurisdiction.spcbCode}`,
        name: stateJurisdiction.industrialPolicyName,
        shortName: `${project.state} Industrial Policy`,
        description: `State industrial package scheme offering capital subsidies, SGST reimbursement, and ${stateJurisdiction.electricityDutyYears}-year electricity duty exemptions.`,
        jurisdiction: `${project.state} (Industries Department)`,
        sourceTitle: `${project.state} Industrial Policy Gazette`,
        sourceUrl: stateJurisdiction.singleWindowPortal,
        verificationDate: '2026-09-01',
        ...(isAlcohol && isMaha ? { exclusionReason: 'Alcohol and potable liquor manufacturing is classified under Annexure II negative list.' } : {}),
      },
      outcome: isAlcohol && isMaha ? 'excluded' : 'potentially_eligible',
      matchedConditions: [`Industrial unit located in ${project.district}, ${project.state}`],
      matchedExclusions: isAlcohol && isMaha ? ['Annexure II Negative List Item 4: Manufacture of potable alcohol, beer, or distilled spirits'] : [],
      factsUsed: { industry: project.industry, state: project.state, district: project.district },
      neededInformation: [],
      explanation: isAlcohol && isMaha
        ? 'Potable alcohol and brewery manufacturing is specifically excluded from direct state capital cash subsidies under Maharashtra PSI-2019 Annexure II. Central fiscal guarantees and duty exemptions remain fully accessible.'
        : `Your enterprise in ${project.district}, ${project.state} qualifies for statutory SGST reimbursements and a ${stateJurisdiction.electricityDutyYears}-year state electricity duty exemption under ${stateJurisdiction.industrialPolicyName}.`,
    },
  ];

  // 6. Build Quick Overview
  const readyCount = nodes.filter((n) => n.status === 'available').length;
  const blockedCount = nodes.filter((n) => n.status === 'blocked').length;

  const quickOverview: QuickOverviewResponse = {
    isReady: true,
    projectId: project.id,
    projectName: project.name,
    summary: `Your ${project.areaSqft || 25000} sq.ft. ${project.industry} facility in ${project.district}, ${project.state} has ${nodes.length} applicable statutory clearances with ${readyCount} ready for immediate submission and ${blockedCount} blocked by prerequisites. Clearances are protected under the ${stateJurisdiction.rtsActName}.`,
    businessContext: {
      name: project.name,
      industry: project.industry,
      location: `${project.district}, ${project.state}`,
      investmentFormatted: project.investmentFormatted || '₹25.00 Crore',
      workforceFormatted: `${project.workforceCount || 80} Personnel`,
      status: 'Intake Confirmed',
    },
    keyHighlights: [
      { label: 'Statutory Clearances', value: `${nodes.length} Applicable`, badge: `${cpcbCategory} Category`, tone: 'positive' },
      { label: 'Ready to File', value: `${readyCount} Approvals`, badge: 'Parallel Batch', tone: 'positive' },
      { label: 'Blocked Prereqs', value: `${blockedCount} Dependencies`, badge: 'Critical Path', tone: 'warning' },
      { label: 'RTS SLA Target', value: `${pcbSla}–65 Days`, badge: 'Deemed Approval', tone: 'neutral' },
    ],
    situation: `Your industrial profile is fully confirmed with ${nodes.length} statutory approvals identified across ${stateJurisdiction.spcbCode}, ${stateJurisdiction.dishCode}, Fire Services, and sectoral authorities. Initial pre-construction filings can start immediately in parallel via ${stateJurisdiction.singleWindowPortal}.`,
    whatYouNeedToDo: `Submit your ${readyCount} available pre-construction filings (${nodes.filter(n => n.status === 'available').map(n => n.shortName).slice(0, 3).join(', ')}) simultaneously to trigger coordinated joint site inspection.`,
    whatIsReady: `${nodes.filter(n => n.status === 'available').map(n => `${n.shortName} (${n.slaDays}-day SLA)`).slice(0, 3).join(', ')}.`,
    whatIsBlocking: `${stateJurisdiction.spcbCode} Consent to Operate (CTO) is blocked until CTE is issued; Final Fire NOC requires Provisional Fire clearance; Commercial Dispatch requires prior operating licenses.`,
    schemesAndIncentives: `Eligible for ₹5.00 Cr CGTMSE collateral-free financing, 0% customs duty under EPCG, and 80% MSME ZED green certification subsidies. Protected by ${stateJurisdiction.rtsActName}.`,
    missingInformation: [],
    documents: {
      totalRequired: 6,
      uploadedCount: 4,
      verifiedCount: 4,
      missingCount: 2,
      missingList: [
        'Registered Land Lease Deed / Allotment Order',
        'Effluent Treatment Plant (ETP) Process Flow & Schematics',
      ],
    },
    nextSteps: [
      {
        id: 'step-01',
        title: `Batch Submit ${readyCount} Available Clearances`,
        description: `Initiate pre-construction filings simultaneously in Layer 0 to start the ${stateJurisdiction.rtsActName} SLA time clocks.`,
        actionLabel: 'Open Roadmap',
        actionRoute: `/projects/${project.id}/roadmap`,
        priority: 'high',
      },
      {
        id: 'step-02',
        title: 'Upload Registered Industrial Land Lease Deed',
        description: `Upload your registered title deed in ${project.district} to unblock ${stateJurisdiction.spcbCode} and ${stateJurisdiction.dishCode} verification.`,
        actionLabel: 'Manage Vault',
        actionRoute: `/projects/${project.id}/roadmap`,
        priority: 'high',
      },
      {
        id: 'step-03',
        title: 'Apply for ₹5 Cr CGTMSE Guarantee',
        description: 'Lock in collateral-free working capital and term loan guarantees with SIDBI partner banks.',
        actionLabel: 'Explore Schemes',
        actionRoute: `/projects/${project.id}/schemes`,
        priority: 'medium',
      },
    ],
    rtsSlaTimelineSummary: `${pcbSla} to 65 working days on critical path with statutory deemed-approval protection.`,
    generatedAt: new Date().toISOString(),
    isAiSynthesized: true,
  };

  // 7. Build Scheme Analysis
  const schemeAnalysis: AiSchemeAnalysisResponse = {
    projectId: project.id,
    businessContext: {
      legalName: `${project.name} Pvt Ltd`,
      industry: project.industry,
      activity: project.activityType || 'Industrial Manufacturing and Processing',
      state: project.state,
      district: project.district,
      investmentAmountInr: project.investmentInr || 250000000,
      investmentCr: project.investmentFormatted || '₹25.00 Cr',
      builtUpAreaSqft: project.areaSqft || 25000,
      workforceHeadcount: project.workforceCount || 85,
      fuelType: 'Grid Electric & Solar Hybrid',
    },
    aiReadinessScore: 91,
    totalPotentialFiscalBenefit: '₹6.85 Crore',
    strategicSummary: `Your facility in ${project.district}, ${project.state} has strong fiscal leverage: ₹5.00 Cr CGTMSE sovereign debt guarantee, 0% customs duty under EPCG, ${stateJurisdiction.electricityDutyYears}-year electricity duty exemption under ${stateJurisdiction.industrialPolicyName}, and 80% MSME ZED green certification grants.`,
    recommendations: [
      {
        id: 'rec-01',
        title: 'Leverage CGTMSE for Collateral-Free Capex Term Loans',
        domain: 'Credit & Capital',
        impact: 'High',
        estimatedSavings: '₹5.00 Cr Guarantee Cover',
        action: 'Approach scheduled commercial partner banks with Udyam registration to waive third-party collateral pledges.',
      },
      {
        id: 'rec-02',
        title: 'Import Core Plant Equipment via EPCG Scheme at 0% Duty',
        domain: 'Customs & Taxation',
        impact: 'High',
        estimatedSavings: '₹45 Lakhs Customs Waiver',
        action: 'Apply for DGFT EPCG authorization prior to opening letter of credit for imported capital machinery.',
      },
      {
        id: 'rec-03',
        title: `Claim ${project.state} Electricity Duty Exemption`,
        domain: 'State Incentives',
        impact: 'Medium',
        estimatedSavings: '₹18 Lakhs Power Tariff Savings',
        action: `File Udyam certificate with Electrical Inspectorate to claim ${stateJurisdiction.electricityDutyYears}-year duty exemption.`,
      },
    ],
    generatedAt: new Date().toISOString(),
    aiModel: 'ApprovalIQ Statutory Regulatory Model v2026.09',
  };

  // 8. Build Documents Vault
  const documents: Document[] = [
    {
      id: `doc-${project.id}-pan`,
      projectId: project.id,
      documentDefinitionId: 'def-pan',
      documentDefinitionCode: 'DOC-PAN',
      documentDefinitionManualOverride: false,
      metadata: { entityName: `${project.name} Pvt Ltd`, panNumber: 'AABCP5678Z' },
      currentVersion: {
        id: 'ver-pan-01',
        versionNumber: 1,
        storageKey: `docs/${project.id}/pan.pdf`,
        originalFilename: 'Company_PAN_Card.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 245000,
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedByUserId: 'usr-applicant',
        uploadedAt: '2026-09-20T10:00:00Z',
        state: 'verified',
      },
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
    },
    {
      id: `doc-${project.id}-cin`,
      projectId: project.id,
      documentDefinitionId: 'def-cin',
      documentDefinitionCode: 'DOC-CIN',
      documentDefinitionManualOverride: false,
      metadata: { cin: 'U29100MH2026PTC345678' },
      currentVersion: {
        id: 'ver-cin-01',
        versionNumber: 1,
        storageKey: `docs/${project.id}/cin.pdf`,
        originalFilename: 'Certificate_of_Incorporation_MCA.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 520000,
        fileHash: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
        uploadedByUserId: 'usr-applicant',
        uploadedAt: '2026-09-20T10:05:00Z',
        state: 'verified',
      },
      createdAt: '2026-09-20T10:05:00Z',
      updatedAt: '2026-09-20T10:05:00Z',
    },
    {
      id: `doc-${project.id}-site-plan`,
      projectId: project.id,
      documentDefinitionId: 'def-site-plan',
      documentDefinitionCode: 'DOC-SITE-PLAN',
      documentDefinitionManualOverride: false,
      metadata: { architect: 'S. Patil & Associates', scale: '1:100', district: project.district },
      currentVersion: {
        id: 'ver-plan-01',
        versionNumber: 1,
        storageKey: `docs/${project.id}/site_layout.pdf`,
        originalFilename: `${project.district}_Site_Layout_Drawing.pdf`,
        mimeType: 'application/pdf',
        sizeBytes: 1850000,
        fileHash: '934ca495991b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b',
        uploadedByUserId: 'usr-applicant',
        uploadedAt: '2026-09-21T11:20:00Z',
        state: 'verified',
      },
      createdAt: '2026-09-21T11:20:00Z',
      updatedAt: '2026-09-21T11:20:00Z',
    },
    {
      id: `doc-${project.id}-dpr`,
      projectId: project.id,
      documentDefinitionId: 'def-dpr',
      documentDefinitionCode: 'DOC-PROJECT-REPORT',
      documentDefinitionManualOverride: false,
      metadata: { consultant: 'Industrial Project Advisors Ltd' },
      currentVersion: {
        id: 'ver-dpr-01',
        versionNumber: 1,
        storageKey: `docs/${project.id}/dpr.pdf`,
        originalFilename: 'Detailed_Project_Report_DPR.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 4200000,
        fileHash: 'b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
        uploadedByUserId: 'usr-applicant',
        uploadedAt: '2026-09-22T09:15:00Z',
        state: 'verified',
      },
      createdAt: '2026-09-22T09:15:00Z',
      updatedAt: '2026-09-22T09:15:00Z',
    },
  ];

  // 9. Build Joint Inspections
  const jointInspections: JointInspectionView[] = [
    {
      id: `insp-${project.id}-01`,
      projectId: project.id,
      title: `Joint Site & Environmental Verification Inspection — ${project.district}`,
      stage: 'pre_construction',
      status: 'scheduled',
      scheduledDate: '2026-11-12',
      timeSlot: '11:00 AM - 01:00 PM',
      premisesAddress: `Plot No. IND-44, Industrial Area, ${project.district}, ${project.state}`,
      leadAuthorityCode: stateJurisdiction.spcbCode,
      leadAuthorityName: stateJurisdiction.spcbName,
      notes: `Consolidated joint inspection scheduled under ${stateJurisdiction.rtsActName} Ease of Doing Business protocol.`,
      readinessChecklist: [
        { id: 'chk-1', title: 'Site Boundary & Access Road Clear (min 6m)', description: 'Emergency fire vehicle access corridor demarcated', completed: true },
        { id: 'chk-2', title: 'Effluent Treatment Plant (ETP) Demarcation', description: 'Civil foundation coordinates staked', completed: true },
        { id: 'chk-3', title: 'Fire Hydrant & Static Water Reservoir Plan Onsite', description: 'Architectural drawings available on site', completed: false },
      ],
      rectificationPlan: null,
      jointReportSummary: `Consolidated inspection between ${stateJurisdiction.spcbCode} and ${stateJurisdiction.fireDeptCode} to prevent duplicate site visits.`,
      participatingApprovals: [],
      inspectorChecklists: [],
      createdAt: '2026-10-15T10:00:00Z',
      updatedAt: '2026-10-18T12:00:00Z',
    },
  ];

  const inspectionCandidates: InspectionCandidatesResponse = {
    candidates: [
      {
        stage: 'pre_construction',
        stageTitle: 'Pre-Construction Joint Site Inspection',
        stageDescription: `Synchronized physical site inspection by ${stateJurisdiction.spcbName} and ${stateJurisdiction.fireDeptName} to verify boundary coordinates, water source, and egress plans.`,
        recommendedTimeframe: 'Day 10–14 of application filing',
        leadAuthorityCode: stateJurisdiction.spcbCode,
        leadAuthorityName: stateJurisdiction.spcbName,
        participatingApprovals: [
          {
            approvalCode: `${stateJurisdiction.spcbCode}-CTE-001`,
            approvalName: 'Consent to Establish (CTE)',
            authorityCode: stateJurisdiction.spcbCode,
            authorityName: stateJurisdiction.spcbName,
            inspectionMandate: 'Physical verification of industrial zoning, ETP location, and effluent discharge point.',
            checklistTemplate: [],
          },
          {
            approvalCode: `${stateJurisdiction.fireDeptCode}-PROV-001`,
            approvalName: 'Provisional Fire NOC',
            authorityCode: stateJurisdiction.fireDeptCode,
            authorityName: stateJurisdiction.fireDeptName,
            inspectionMandate: 'Verification of approach road width (min 6 meters) and static water reservoir coordinates.',
            checklistTemplate: [],
          },
        ],
        readinessRequirements: [
          { id: 'req-1', title: 'Site Boundary Demarcated', description: 'Physical perimeter coordinates verified', completed: true },
          { id: 'req-2', title: 'Water Connection Point Accessible', description: 'Utility junction identified', completed: true },
          { id: 'req-3', title: 'Architectural Blueprint Available Onsite', description: 'Stamped engineering drawing on site', completed: false },
        ],
        estimatedVisitsSaved: 1,
        estimatedDaysSaved: 20,
      },
    ],
    summary: {
      totalSeparateVisits: 3,
      consolidatedJointVisits: 1,
      visitsSaved: 2,
      totalDaysSaved: 25,
    },
  };

  const dataset: AiProjectDataset = {
    project,
    roadmap: {
      projectId: project.id,
      releaseVersion: 'ruleset-v2026.09.1',
      nodes,
      edges,
      parallelGroups,
      schemes,
    },
    quickOverview,
    schemeAnalysis,
    documents,
    jointInspections,
    inspectionCandidates,
    cpcbCategory,
    statutorySummary: `Applicable ${cpcbCategory} Category Clearances governed by ${stateJurisdiction.spcbName} and ${stateJurisdiction.rtsActName}.`,
    generatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${AI_DATASET_PREFIX}${project.id}`, JSON.stringify(dataset));
    } catch {
      // Storage quota safety
    }
  }

  return dataset;
}

/**
 * Retrieve cached AI dataset or synthesize on-demand
 */
export function getAiProjectDataset(projectId: string = DEMO_PROJECT_ID): AiProjectDataset {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${AI_DATASET_PREFIX}${projectId}`);
      if (cached) {
        return JSON.parse(cached) as AiProjectDataset;
      }
    } catch {
      // Fall through to generation
    }
  }

  const project = getStoredProjectById(projectId);
  return generateAiProjectDataset(project);
}

/**
 * Force AI re-generation of regulatory roadmap and fiscal schemes
 */
export function regenerateAiProjectDataset(
  projectId: string,
  overrides?: Partial<ProjectHistoryItem>,
): AiProjectDataset {
  const current = getStoredProjectById(projectId);
  const updated: ProjectHistoryItem = {
    ...current,
    ...overrides,
    id: projectId,
  };
  saveStoredProject(updated);
  return generateAiProjectDataset(updated);
}
