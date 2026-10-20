import type {
  RoadmapResponse,
  RoadmapNode,
  RoadmapEdge,
  SchemeEvaluationInfo,
  UpdateStatusResponse,
  QuickOverviewResponse,
  AiSchemeAnalysisResponse,
  AiSchemeChatResponse,
  Document,
  AssistantChatResponse,
  InspectionCandidatesResponse,
  JointInspectionView,
  ClarificationsInbox,
  ApprovalInstanceStatus,
} from './api-client';

export const DEMO_PROJECT_ID = 'biz-demo-pune-brewery';

// Dynamic in-memory status override map to let applicants interactively test status transitions
const demoStatusOverrides = new Map<string, ApprovalInstanceStatus>();

export function updateDemoInstanceStatus(
  instanceId: string,
  status: Exclude<ApprovalInstanceStatus, 'blocked'>,
): UpdateStatusResponse {
  demoStatusOverrides.set(instanceId, status);
  const roadmap = getDemoRoadmap();
  const node = roadmap.nodes.find((n) => n.id === instanceId) ?? roadmap.nodes[0]!;
  
  const unlockedDependentIds: string[] = [];
  if (status === 'done') {
    // If MPCB CTE is done, unblock CTO
    if (instanceId === 'inst-mpcb-cte') {
      demoStatusOverrides.set('inst-mpcb-cto', 'available');
      unlockedDependentIds.push('inst-mpcb-cto');
    }
    // If Fire Provisional is done, unblock Final Fire
    if (instanceId === 'inst-fire-prov') {
      demoStatusOverrides.set('inst-fire-final', 'available');
      unlockedDependentIds.push('inst-fire-final');
    }
    // If DISH Plan is done, unblock DISH Licence
    if (instanceId === 'inst-dish-plan') {
      demoStatusOverrides.set('inst-dish-lic', 'available');
      unlockedDependentIds.push('inst-dish-lic');
    }
  }

  return {
    ...node,
    status,
    unlockedDependentIds,
  };
}

export function getDemoRoadmap(projectId: string = DEMO_PROJECT_ID): RoadmapResponse {
  const getStatus = (id: string, fallback: ApprovalInstanceStatus): ApprovalInstanceStatus => {
    return demoStatusOverrides.get(id) ?? fallback;
  };

  const nodes: RoadmapNode[] = [
    {
      id: 'inst-mpcb-cte',
      projectId,
      approvalDefinitionId: 'def-mpcb-cte',
      approvalCode: 'MPCB-CTE-001',
      approvalName: 'Consent to Establish (CTE)',
      shortName: 'MPCB CTE',
      whyRequired: 'Mandatory prior statutory consent under Section 25 of Water Act 1974 & Section 21 of Air Act 1981 before starting factory civil construction or machinery installation.',
      inspectionRequired: true,
      renewalRequired: false,
      slaDays: 45,
      slaBasis: 'Maharashtra Right to Services (RTS) Act 2015 - Notified 45 Working Days',
      ambiguityNotes: 'Requires ETP sizing calculations and site plan certification by an accredited environmental consultant.',
      authority: {
        id: 'auth-mpcb',
        code: 'AUTH-MPCB',
        name: 'Maharashtra Pollution Control Board (MPCB)',
      },
      source: {
        id: 'src-mpcb',
        name: 'Water (Prevention and Control of Pollution) Act 1974',
        citation: 'Sec 25/26 Water Act 1974',
        url: 'https://mpcb.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-mpcb-cte',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-LEASE-DEED', name: 'MIDC Registered Lease Deed' },
        { id: 'DOC-ETP-PLAN', name: 'Effluent Treatment Plant (ETP) Process Flow & Schematics' },
        { id: 'DOC-SITE-PLAN', name: 'Factory Site Layout Plan' },
      ],
      status: getStatus('inst-mpcb-cte', 'in_progress'),
      sourceUrl: 'https://mpcb.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-fire-prov',
      projectId,
      approvalDefinitionId: 'def-fire-prov',
      approvalCode: 'FIRE-PROVISIONAL-001',
      approvalName: 'Provisional Fire NOC',
      shortName: 'Provisional Fire NOC',
      whyRequired: 'Statutory approval of factory fire fighting schemes, hydrants, water storage, and emergency egress drawings prior to construction.',
      inspectionRequired: true,
      renewalRequired: false,
      slaDays: 15,
      slaBasis: 'Maharashtra Fire Prevention and Life Safety Measures Act 2006',
      ambiguityNotes: null,
      authority: {
        id: 'auth-fire',
        code: 'AUTH-FIRE',
        name: 'MIDC Fire Services Department',
      },
      source: {
        id: 'src-fire',
        name: 'Maharashtra Fire Prevention and Life Safety Measures Act 2006',
        citation: 'Section 3 Fire Act 2006',
        url: 'https://midcindia.org',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-fire-prov',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FIRE-DRAWING', name: 'Fire Fighting System Layout & Evacuation Plan' },
        { id: 'DOC-ARCH-DRAWING', name: 'Architectural Blueprint' },
      ],
      status: getStatus('inst-fire-prov', 'available'),
      sourceUrl: 'https://midcindia.org',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-dish-plan',
      projectId,
      approvalDefinitionId: 'def-dish-plan',
      approvalCode: 'DISH-PLAN-001',
      approvalName: 'Factory Building Plan Approval',
      shortName: 'DISH Plan Approval',
      whyRequired: 'Approval of factory structural layout, machinery spacing, ventilation, and worker safety under Section 6 of Factories Act 1948.',
      inspectionRequired: false,
      renewalRequired: false,
      slaDays: 30,
      slaBasis: 'Maharashtra Factories Rules 1963 - Rule 3',
      ambiguityNotes: null,
      authority: {
        id: 'auth-dish',
        code: 'AUTH-DISH',
        name: 'Directorate of Industrial Safety & Health (DISH)',
      },
      source: {
        id: 'src-dish',
        name: 'Factories Act 1948',
        citation: 'Sec 6 Factories Act 1948',
        url: 'https://dish.maharashtra.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-dish-plan',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FACTORY-LAYOUT', name: 'Machinery Placement & Egress Layout Drawing' },
        { id: 'DOC-STABILITY-CERT', name: 'Chartered Structural Engineer Stability Certificate' },
      ],
      status: getStatus('inst-dish-plan', 'available'),
      sourceUrl: 'https://dish.maharashtra.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-fssai-lic',
      projectId,
      approvalDefinitionId: 'def-fssai-lic',
      approvalCode: 'FSSAI-LICENCE-001',
      approvalName: 'FSSAI Central Manufacturing Licence',
      shortName: 'FSSAI Central Licence',
      whyRequired: 'Statutory food & beverage safety manufacturing licence for craft beer and alcoholic beverage production and bottling.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 60,
      slaBasis: 'Food Safety and Standards (Licensing and Registration) Regulations 2011',
      ambiguityNotes: null,
      authority: {
        id: 'auth-fssai',
        code: 'AUTH-FSSAI',
        name: 'Food Safety and Standards Authority of India (FSSAI)',
      },
      source: {
        id: 'src-fssai',
        name: 'Food Safety and Standards Act 2006',
        citation: 'Sec 31 FSS Act 2006',
        url: 'https://foscos.fssai.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-fssai-lic',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-WATER-TEST', name: 'Potable Water Analysis Report (IS 10500)' },
        { id: 'DOC-FSMS-PLAN', name: 'Food Safety Management System (FSMS) Plan' },
      ],
      status: getStatus('inst-fssai-lic', 'available'),
      sourceUrl: 'https://foscos.fssai.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-lm-pack',
      projectId,
      approvalDefinitionId: 'def-lm-pack',
      approvalCode: 'LM-PACKAGED-001',
      approvalName: 'Legal Metrology Packaged Commodities Registration',
      shortName: 'Legal Metrology Packaged',
      whyRequired: 'Mandatory statutory registration for pre-packaged commodities, kegs, bottles, and volume verification under Rule 27.',
      inspectionRequired: false,
      renewalRequired: false,
      slaDays: 20,
      slaBasis: 'Legal Metrology (Packaged Commodities) Rules 2011',
      ambiguityNotes: null,
      authority: {
        id: 'auth-lm',
        code: 'AUTH-LM',
        name: 'Legal Metrology Department, Maharashtra',
      },
      source: {
        id: 'src-lm',
        name: 'Legal Metrology Act 2009',
        citation: 'Sec 19 Legal Metrology Act',
        url: 'https://consumeraffairs.nic.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-lm-pack',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-LABEL-SPEC', name: 'Package Net Volume & MRP Label Proof' },
      ],
      status: getStatus('inst-lm-pack', 'available'),
      sourceUrl: 'https://consumeraffairs.nic.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: '2026-09-20T10:00:00.000Z',
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-mpcb-cto',
      projectId,
      approvalDefinitionId: 'def-mpcb-cto',
      approvalCode: 'MPCB-CTO-001',
      approvalName: 'Consent to Operate (CTO)',
      shortName: 'MPCB CTO',
      whyRequired: 'Statutory operating consent required before trial runs or commercial production; verifies ETP commissioning.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 45,
      slaBasis: 'Water & Air Pollution Control Acts - 45 Day RTS SLA',
      ambiguityNotes: 'Gated by MPCB Consent to Establish (CTE). Unlocks automatically once CTE is granted.',
      authority: {
        id: 'auth-mpcb',
        code: 'AUTH-MPCB',
        name: 'Maharashtra Pollution Control Board (MPCB)',
      },
      source: {
        id: 'src-mpcb-cto',
        name: 'Water & Air Acts',
        citation: 'Sec 25/26 Water Act',
        url: 'https://mpcb.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-mpcb-cto',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-ETP-COMMISSION', name: 'ETP Commissioning & Treated Effluent Analysis Report' },
        { id: 'DOC-CTE-COPY', name: 'Copy of Granted Consent to Establish (CTE)' },
      ],
      status: getStatus('inst-mpcb-cto', 'blocked'),
      sourceUrl: 'https://mpcb.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-fire-final',
      projectId,
      approvalDefinitionId: 'def-fire-final',
      approvalCode: 'FIRE-FINAL-001',
      approvalName: 'Final Fire Safety Certificate (Final Fire NOC)',
      shortName: 'Final Fire NOC',
      whyRequired: 'Final physical verification of active fire hydrants, smoke detectors, and alarms after building construction.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 20,
      slaBasis: 'Maharashtra Fire Prevention Act 2006',
      ambiguityNotes: 'Gated by Provisional Fire NOC and physical building completion.',
      authority: {
        id: 'auth-fire',
        code: 'AUTH-FIRE',
        name: 'MIDC Fire Services Department',
      },
      source: {
        id: 'src-fire-final',
        name: 'Maharashtra Fire Prevention Act',
        citation: 'Sec 3 Fire Act',
        url: 'https://midcindia.org',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-fire-final',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FIRE-COMPLETION', name: 'Fire Fighting System Installation Completion Certificate (Form A)' },
      ],
      status: getStatus('inst-fire-final', 'blocked'),
      sourceUrl: 'https://midcindia.org',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-brl',
      projectId,
      approvalDefinitionId: 'def-brl',
      approvalCode: 'BRL-001',
      approvalName: 'Brewery & Bottling Licence (Form BRL)',
      shortName: 'Excise Brewery Licence',
      whyRequired: 'Manufacturing and wholesale storage licence under Maharashtra Prohibition Act 1949 and Brewery Rules 1969.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 60,
      slaBasis: 'Maharashtra Brewery Rules 1969 - RTS SLA 60 Days',
      ambiguityNotes: 'Gated by prior MPCB CTE, Provisional Fire NOC, and DISH Factory Plan Approval.',
      authority: {
        id: 'auth-excise',
        code: 'AUTH-EXCISE',
        name: 'State Excise Department, Maharashtra',
      },
      source: {
        id: 'src-excise',
        name: 'Maharashtra Prohibition Act 1949',
        citation: 'Sec 58-A Prohibition Act',
        url: 'https://stateexcise.maharashtra.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-brl',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-EXCISE-CHALLAN', name: 'Treasury Challan for Licence Fee' },
        { id: 'DOC-SOLVENCY-CERT', name: 'Bank Solvency Certificate (₹25 Lakhs)' },
      ],
      status: getStatus('inst-brl', 'blocked'),
      sourceUrl: 'https://stateexcise.maharashtra.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-dish-lic',
      projectId,
      approvalDefinitionId: 'def-dish-lic',
      approvalCode: 'DISH-LICENCE-001',
      approvalName: 'Factory Operational Licence (Form 4)',
      shortName: 'Factory Licence',
      whyRequired: 'Statutory operational licence under Section 6 of Factories Act 1948 prior to employing workers.',
      inspectionRequired: true,
      renewalRequired: true,
      slaDays: 30,
      slaBasis: 'Maharashtra Factories Rules 1963',
      ambiguityNotes: 'Gated by prior DISH Factory Building Plan Approval.',
      authority: {
        id: 'auth-dish',
        code: 'AUTH-DISH',
        name: 'Directorate of Industrial Safety & Health (DISH)',
      },
      source: {
        id: 'src-dish-lic',
        name: 'Factories Act 1948',
        citation: 'Sec 6 & 7 Factories Act',
        url: 'https://dish.maharashtra.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-dish-lic',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-FORM-2', name: 'Notice of Occupation (Form 2)' },
      ],
      status: getStatus('inst-dish-lic', 'blocked'),
      sourceUrl: 'https://dish.maharashtra.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
    {
      id: 'inst-excise-lbl',
      projectId,
      approvalDefinitionId: 'def-excise-lbl',
      approvalCode: 'EXCISE-LABEL-001',
      approvalName: 'Excise Brand & Label Registration',
      shortName: 'Brand & Label Approval',
      whyRequired: 'Statutory approval of beer brand labels, alcoholic strength, and packaging specifications before commercial retail dispatch.',
      inspectionRequired: false,
      renewalRequired: true,
      slaDays: 15,
      slaBasis: 'Maharashtra Potable Liquor Rules',
      ambiguityNotes: 'Gated by State Excise Brewery Licence (BRL-001).',
      authority: {
        id: 'auth-excise',
        code: 'AUTH-EXCISE',
        name: 'State Excise Department, Maharashtra',
      },
      source: {
        id: 'src-excise-lbl',
        name: 'Maharashtra Potable Liquor Rules',
        citation: 'Rule 14 Label Approval',
        url: 'https://stateexcise.maharashtra.gov.in',
        verificationStatus: 'verified',
      },
      evaluationResultId: 'eval-res-excise-lbl',
      outcome: 'applicable',
      attentionRequired: false,
      missingFields: [],
      requiredDocuments: [
        { id: 'DOC-LABEL-ART', name: 'Label Artwork & Chemical Analysis Certificate' },
      ],
      status: getStatus('inst-excise-lbl', 'blocked'),
      sourceUrl: 'https://stateexcise.maharashtra.gov.in',
      lastVerifiedDate: '2026-09-15',
      releaseId: 'rel-2026-09',
      releaseVersion: 'ruleset-v2026.09.1',
      unlockedAt: null,
      updatedAt: '2026-10-18T14:30:00.000Z',
    },
  ];

  const edges: RoadmapEdge[] = [
    {
      id: 'edge-mpcb-cte-cto',
      fromInstanceId: 'inst-mpcb-cte',
      toInstanceId: 'inst-mpcb-cto',
      fromApprovalId: 'def-mpcb-cte',
      fromApprovalCode: 'MPCB-CTE-001',
      toApprovalId: 'def-mpcb-cto',
      toApprovalCode: 'MPCB-CTO-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-fire-prov-final',
      fromInstanceId: 'inst-fire-prov',
      toInstanceId: 'inst-fire-final',
      fromApprovalId: 'def-fire-prov',
      fromApprovalCode: 'FIRE-PROVISIONAL-001',
      toApprovalId: 'def-fire-final',
      toApprovalCode: 'FIRE-FINAL-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-mpcb-brl',
      fromInstanceId: 'inst-mpcb-cte',
      toInstanceId: 'inst-brl',
      fromApprovalId: 'def-mpcb-cte',
      fromApprovalCode: 'MPCB-CTE-001',
      toApprovalId: 'def-brl',
      toApprovalCode: 'BRL-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-fire-brl',
      fromInstanceId: 'inst-fire-prov',
      toInstanceId: 'inst-brl',
      fromApprovalId: 'def-fire-prov',
      fromApprovalCode: 'FIRE-PROVISIONAL-001',
      toApprovalId: 'def-brl',
      toApprovalCode: 'BRL-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-dish-brl',
      fromInstanceId: 'inst-dish-plan',
      toInstanceId: 'inst-brl',
      fromApprovalId: 'def-dish-plan',
      fromApprovalCode: 'DISH-PLAN-001',
      toApprovalId: 'def-brl',
      toApprovalCode: 'BRL-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-dish-plan-lic',
      fromInstanceId: 'inst-dish-plan',
      toInstanceId: 'inst-dish-lic',
      fromApprovalId: 'def-dish-plan',
      fromApprovalCode: 'DISH-PLAN-001',
      toApprovalId: 'def-dish-lic',
      toApprovalCode: 'DISH-LICENCE-001',
      type: 'depends_on',
      gates: true,
    },
    {
      id: 'edge-brl-label',
      fromInstanceId: 'inst-brl',
      toInstanceId: 'inst-excise-lbl',
      fromApprovalId: 'def-brl',
      fromApprovalCode: 'BRL-001',
      toApprovalId: 'def-excise-lbl',
      toApprovalCode: 'EXCISE-LABEL-001',
      type: 'depends_on',
      gates: true,
    },
  ];

  const parallelGroups = [
    ['inst-mpcb-cte', 'inst-fire-prov', 'inst-dish-plan', 'inst-fssai-lic', 'inst-lm-pack'],
    ['inst-mpcb-cto', 'inst-fire-final', 'inst-brl', 'inst-dish-lic'],
    ['inst-excise-lbl'],
  ];

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
      factsUsed: { industry: 'brewery', investmentAmountInr: 40000000 },
      neededInformation: [],
      explanation: 'Your enterprise is registered as an MSME manufacturing unit with capital outlay within eligible limits. You qualify for up to ₹5.00 Crore collateral-free debt financing.',
    },
    {
      scheme: {
        id: 'DGFT-EPCG-001',
        name: 'Export Promotion Capital Goods Scheme (EPCG)',
        shortName: 'EPCG 0% Customs Duty',
        description: 'Zero customs duty import on capital goods & brewery machinery with export commitment.',
        jurisdiction: 'Central (DGFT & Ministry of Commerce)',
        sourceTitle: 'Foreign Trade Policy 2023-2028',
        sourceUrl: 'https://www.dgft.gov.in',
        verificationDate: '2026-09-01',
      },
      outcome: 'potentially_eligible',
      matchedConditions: ['Import of capital machinery for industrial production'],
      matchedExclusions: [],
      factsUsed: { industry: 'brewery' },
      neededInformation: [],
      explanation: 'Eligible for 0% customs duty on imported brewery and bottling equipment subject to fulfilling an export obligation of 6x duty saved over 6 years.',
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
      factsUsed: { industry: 'brewery' },
      neededInformation: [],
      explanation: 'Qualifies for 80% financial subsidy on green factory certification and effluent treatment plant energy audits.',
    },
    {
      scheme: {
        id: 'STARTUP-80IAC-001',
        name: 'Section 80-IAC Corporate Income Tax Exemption',
        shortName: 'Section 80-IAC Tax Holiday',
        description: '100% tax holiday on corporate profits for 3 consecutive financial years out of 10 years.',
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
      explanation: 'DPIIT recognized entities can elect a 100% deduction on corporate tax profits for 3 consecutive financial years.',
    },
    {
      scheme: {
        id: 'MAHA-PSI-2019',
        name: 'Package Scheme of Incentives 2019 (Maharashtra)',
        shortName: 'Maharashtra PSI 2019',
        description: 'State industrial capital and SGST cash subsidy scheme.',
        jurisdiction: 'Maharashtra (Industries Department)',
        sourceTitle: 'Government Resolution No. PSI-2019/CR-46/IND-8',
        sourceUrl: 'https://maitri.mahaonline.gov.in',
        verificationDate: '2026-09-01',
        exclusionReason: 'Alcohol and potable liquor manufacturing is classified under Annexure II negative list.',
      },
      outcome: 'excluded',
      matchedConditions: ['Industrial unit located in Maharashtra (Zone B - Chakan, Pune)'],
      matchedExclusions: ['Annexure II Negative List Item 4: Manufacture of potable alcohol, beer, or distilled spirits'],
      factsUsed: { industry: 'brewery', state: 'Maharashtra', district: 'Pune' },
      neededInformation: [],
      explanation: 'Alcohol and brewery manufacturing is specifically excluded from direct state capital cash subsidies under Maharashtra PSI-2019 Annexure II. Central fiscal guarantees and duty exemptions remain fully accessible.',
    },
  ];

  return {
    projectId,
    releaseVersion: 'ruleset-v2026.09.1',
    nodes,
    edges,
    parallelGroups,
    schemes,
  };
}

export function getDemoQuickOverview(projectId: string = DEMO_PROJECT_ID): QuickOverviewResponse {
  return {
    isReady: true,
    projectId,
    projectName: 'Pune Craft Brewery',
    summary: 'Your 6,000 sq.ft. craft brewing and bottling facility in MIDC Chakan, Pune has 10 applicable statutory clearances with 3 ready for immediate submission and 3 blocked by prerequisites. Clearances are protected under the Maharashtra Right to Services Act.',
    businessContext: {
      name: 'Pune Craft Brewery',
      industry: 'Craft Brewery & Distilleries',
      location: 'Pune, Maharashtra (MIDC Chakan Phase II)',
      investmentFormatted: '₹4.00 Crore',
      workforceFormatted: '25 Personnel',
      status: 'Intake Confirmed',
    },
    keyHighlights: [
      { label: 'Statutory Clearances', value: '10 Applicable', badge: 'Active Docket', tone: 'positive' },
      { label: 'Ready to File', value: '3 Approvals', badge: 'Parallel Batch', tone: 'positive' },
      { label: 'Blocked Prereqs', value: '3 Dependencies', badge: 'Critical Path', tone: 'warning' },
      { label: 'RTS SLA Target', value: '45–65 Days', badge: 'Deemed Approval', tone: 'neutral' },
    ],
    situation: 'Your industrial profile is fully confirmed with 10 statutory approvals identified across MPCB, DISH, Fire Services, FSSAI, and State Excise. Initial pre-construction filings can start immediately in parallel.',
    whatYouNeedToDo: 'Submit your 3 available filings (DISH Plan, MPCB CTE, Provisional Fire) simultaneously to trigger coordinated joint site inspection, and upload the MIDC lease agreement to your Document Vault.',
    whatIsReady: 'DISH Factory Plan Approval (30-day SLA), MPCB Consent to Establish (45-day SLA), and Provisional Fire NOC (15-day SLA).',
    whatIsBlocking: 'MPCB Consent to Operate is blocked until CTE is issued; Final Fire NOC requires Provisional Fire clearance; State Excise BRL requires prior clearances.',
    schemesAndIncentives: 'Eligible for ₹5.00 Cr CGTMSE collateral-free financing, 0% customs duty under EPCG, and 80% MSME ZED green certification subsidies. Direct Maharashtra PSI-2019 cash subsidies are excluded under Annexure II.',
    missingInformation: [],
    documents: {
      totalRequired: 6,
      uploadedCount: 4,
      verifiedCount: 4,
      missingCount: 2,
      missingList: [
        'MIDC Registered Lease Deed',
        'Effluent Treatment Plant (ETP) Process Flow & Schematics',
      ],
    },
    nextSteps: [
      {
        id: 'step-01',
        title: 'Batch Submit 3 Available Clearances',
        description: 'Initiate DISH Plan, MPCB CTE, and Provisional Fire NOC simultaneously in Layer 0.',
        actionLabel: 'Open Roadmap',
        actionRoute: `/projects/${projectId}/roadmap`,
        priority: 'high',
      },
      {
        id: 'step-02',
        title: 'Upload Registered MIDC Lease Deed',
        description: 'Upload your verified lease agreement to unblock MPCB and DISH verification.',
        actionLabel: 'Manage Vault',
        actionRoute: `/projects/${projectId}/roadmap`,
        priority: 'high',
      },
      {
        id: 'step-03',
        title: 'Apply for ₹5 Cr CGTMSE Guarantee',
        description: 'Lock in collateral-free working capital and term loan guarantees with SIDBI partner banks.',
        actionLabel: 'Explore Schemes',
        actionRoute: `/projects/${projectId}/schemes`,
        priority: 'medium',
      },
    ],
    rtsSlaTimelineSummary: '45 to 65 working days on critical path with statutory deemed-approval protection.',
    generatedAt: new Date().toISOString(),
    isAiSynthesized: true,
  };
}

export function getDemoAiSchemeAnalysis(projectId: string = DEMO_PROJECT_ID): AiSchemeAnalysisResponse {
  return {
    projectId,
    businessContext: {
      legalName: 'Pune Craft Brewery Private Limited',
      industry: 'Craft Brewery & Distilleries',
      activity: 'Fermentation, brewing, and packaging of craft beverages',
      state: 'Maharashtra',
      district: 'Pune',
      investmentAmountInr: 40000000,
      investmentCr: '₹4.00 Cr',
      builtUpAreaSqft: 6000,
      workforceHeadcount: 25,
      fuelType: 'Electric & LPG Boilers',
    },
    aiReadinessScore: 88,
    totalPotentialFiscalBenefit: '₹5.42 Crore',
    strategicSummary: 'While Maharashtra PSI-2019 excludes potable alcohol from direct SGST cash subsidies under Annexure II, your facility has exceptionally high fiscal leverage through central schemes: ₹5.00 Cr CGTMSE debt guarantee, ₹32 Lakhs customs duty savings under EPCG, and ₹10 Lakhs ZED green manufacturing grants.',
    recommendations: [
      {
        id: 'rec-01',
        title: 'Leverage CGTMSE for Collateral-Free Capex Term Loans',
        domain: 'Credit & Capital',
        impact: 'High',
        estimatedSavings: '₹5.00 Cr Guarantee Cover',
        action: 'Approach public sector banks with Udyam registration to waive third-party collateral requirements.',
      },
      {
        id: 'rec-02',
        title: 'Import Brewing Kettles via EPCG Scheme at 0% Duty',
        domain: 'Customs & Taxation',
        impact: 'High',
        estimatedSavings: '₹32 Lakhs Customs Waiver',
        action: 'Apply for DGFT EPCG authorization prior to opening letter of credit for imported European fermenters.',
      },
      {
        id: 'rec-03',
        title: 'Claim MSME ZED Green Certification Subsidies',
        domain: 'Environmental Standards',
        impact: 'Medium',
        estimatedSavings: '₹10 Lakhs Testing & Audit Subsidy',
        action: 'Enrol in MSME ZED portal during ETP installation to receive 80% subsidy on environmental audits.',
      },
    ],
    generatedAt: new Date().toISOString(),
    aiModel: 'ApprovalIQ Statutory Regulatory Model v2026.09',
  };
}

export function getDemoAiSchemeAdvisorAnswer(query: string): AiSchemeChatResponse {
  const q = query.toLowerCase();
  
  if (/cgtmse|collateral|loan|credit|bank|financing/.test(q)) {
    return {
      query,
      answer: "Under the Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE), your Pune Craft Brewery unit qualifies for up to **₹5.00 Crore** in collateral-free credit facilities. The trust provides an 85% sovereign guarantee cover for MSME manufacturing units, allowing you to secure term loans and working capital without pledging personal immovable property.",
      relevantSchemes: ['MSME-CGTMSE-001', 'MSME-UDYAM-001'],
      actionableSteps: [
        'Obtain Udyam MSME Registration Certificate',
        'Prepare Detailed Project Report (DPR) with 7-year DSCR financial projections',
        'Submit loan application through any scheduled commercial bank under CGTMSE cover',
      ],
      confidenceScore: 0.96,
      sourceAttribution: 'Ministry of MSME & SIDBI CGTMSE Guidelines 2026',
      timestamp: new Date().toISOString(),
    };
  }

  if (/epcg|customs|import|duty|machinery|kettle|fermenter/.test(q)) {
    return {
      query,
      answer: "The **EPCG (Export Promotion Capital Goods)** scheme allows you to import high-efficiency brewing kettles, bottling lines, and refrigeration plant at **0% customs duty** (normally 27.5% combined tariff). In return, you commit to an export obligation equivalent to 6 times the duty saved over a 6-year block.",
      relevantSchemes: ['DGFT-EPCG-001'],
      actionableSteps: [
        'Obtain Importer-Exporter Code (IEC) from DGFT portal',
        'Get Chartered Engineer certificate certifying import machinery specs',
        'Submit online EPCG authorization application prior to equipment bill of lading',
      ],
      confidenceScore: 0.94,
      sourceAttribution: 'Directorate General of Foreign Trade (DGFT) Foreign Trade Policy',
      timestamp: new Date().toISOString(),
    };
  }

  if (/psi|maharashtra|negative list|annexure ii|subsidy|sgst/.test(q)) {
    return {
      query,
      answer: "Under the **Maharashtra Package Scheme of Incentives (PSI 2019)**, potable alcohol, beer brewing, and distillery manufacturing units are categorized under the **Annexure II Negative List** (Item 4). This means your unit is not eligible for state SGST cash reimbursement or direct capital grants. However, you can still claim central CGTMSE credit guarantees, EPCG duty waivers, and Section 80-IAC corporate tax deductions.",
      relevantSchemes: ['MAHA-PSI-2019', 'MSME-CGTMSE-001', 'DGFT-EPCG-001'],
      actionableSteps: [
        'Focus on Central MSME schemes rather than state cash subsidies',
        'Register under MSME Udyam for local electricity duty exemptions',
        'Leverage Section 80-IAC for a 3-year complete corporate income tax holiday',
      ],
      confidenceScore: 0.98,
      sourceAttribution: 'Government of Maharashtra Industries Department GR PSI-2019/CR-46',
      timestamp: new Date().toISOString(),
    };
  }

  return {
    query,
    answer: "Your Pune Craft Brewery enterprise is eligible for key central fiscal programs: **₹5.00 Crore CGTMSE** collateral-free financing, **0% customs duty** on brewery machinery imports under EPCG, and **80% subsidies** for MSME ZED green manufacturing certifications. While direct state SGST cash reimbursement is restricted under Maharashtra PSI-2019 Annexure II, your central fiscal incentives remain 100% accessible.",
    relevantSchemes: ['MSME-CGTMSE-001', 'DGFT-EPCG-001', 'MSME-ZED-001', 'STARTUP-80IAC-001'],
    actionableSteps: [
      'File Udyam Registration to unlock priority sector lending discounts',
      'Apply for EPCG license before importing high-tech fermenters',
      'Submit CGTMSE loan dossier to partner lenders',
    ],
    confidenceScore: 0.92,
    sourceAttribution: 'ApprovalIQ Statutory Regulatory Knowledge Base',
    timestamp: new Date().toISOString(),
  };
}

export function getDemoDocuments(projectId: string = DEMO_PROJECT_ID): Document[] {
  return [
    {
      id: 'doc-01',
      projectId,
      documentDefinitionId: 'def-pan',
      documentDefinitionCode: 'DOC-PAN',
      documentDefinitionManualOverride: false,
      metadata: { entityName: 'Pune Craft Brewery Pvt Ltd', panNumber: 'AABCP1234D' },
      currentVersion: {
        id: 'ver-01',
        versionNumber: 1,
        storageKey: 'docs/pan.pdf',
        originalFilename: 'Company_PAN_Certificate.pdf',
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
      id: 'doc-02',
      projectId,
      documentDefinitionId: 'def-cin',
      documentDefinitionCode: 'DOC-CIN',
      documentDefinitionManualOverride: false,
      metadata: { cin: 'U15549PN2026PTC123456' },
      currentVersion: {
        id: 'ver-02',
        versionNumber: 1,
        storageKey: 'docs/cin.pdf',
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
      id: 'doc-03',
      projectId,
      documentDefinitionId: 'def-site-plan',
      documentDefinitionCode: 'DOC-SITE-PLAN',
      documentDefinitionManualOverride: false,
      metadata: { architect: 'S. Patil & Associates', scale: '1:100' },
      currentVersion: {
        id: 'ver-03',
        versionNumber: 1,
        storageKey: 'docs/site_layout.pdf',
        originalFilename: 'MIDC_Chakan_Site_Layout_Drawing.pdf',
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
      id: 'doc-04',
      projectId,
      documentDefinitionId: 'def-water-test',
      documentDefinitionCode: 'DOC-WATER-TEST',
      documentDefinitionManualOverride: false,
      metadata: { standard: 'IS 10500:2012', lab: 'NABL Accredited Water Lab' },
      currentVersion: {
        id: 'ver-04',
        versionNumber: 1,
        storageKey: 'docs/water_report.pdf',
        originalFilename: 'Potable_Water_Test_IS10500.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 410000,
        fileHash: 'b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
        uploadedByUserId: 'usr-applicant',
        uploadedAt: '2026-09-22T09:15:00Z',
        state: 'verified',
      },
      createdAt: '2026-09-22T09:15:00Z',
      updatedAt: '2026-09-22T09:15:00Z',
    },
  ];
}

export function getDemoInspectionsCandidates(_projectId: string = DEMO_PROJECT_ID): InspectionCandidatesResponse {
  return {
    candidates: [
      {
        stage: 'pre_construction',
        stageTitle: 'Pre-Construction Joint Site Inspection',
        stageDescription: 'Synchronized physical site inspection by MPCB and MIDC Fire Services to verify boundary coordinates, water source, and egress plans.',
        recommendedTimeframe: 'Day 10–14 of application filing',
        leadAuthorityCode: 'AUTH-MPCB',
        leadAuthorityName: 'Maharashtra Pollution Control Board',
        participatingApprovals: [
          {
            approvalCode: 'MPCB-CTE-001',
            approvalName: 'Consent to Establish (CTE)',
            authorityCode: 'AUTH-MPCB',
            authorityName: 'Maharashtra Pollution Control Board',
            inspectionMandate: 'Physical verification of industrial zoning, ETP location, and effluent discharge point.',
            checklistTemplate: [],
          },
          {
            approvalCode: 'FIRE-PROVISIONAL-001',
            approvalName: 'Provisional Fire NOC',
            authorityCode: 'AUTH-FIRE',
            authorityName: 'MIDC Fire Services Department',
            inspectionMandate: 'Verification of approach road width (min 6 meters) and static water reservoir coordinates.',
            checklistTemplate: [],
          },
        ],
        readinessRequirements: [
          { id: 'req-1', title: 'Site Boundary Demarcated', description: 'Physical perimeter coordinates verified', completed: true },
          { id: 'req-2', title: 'MIDC Water Connection Point Accessible', description: 'Utility junction identified', completed: true },
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
}

export function getDemoJointInspections(projectId: string = DEMO_PROJECT_ID): JointInspectionView[] {
  return [
    {
      id: 'insp-demo-01',
      projectId,
      title: 'Joint Site & Environmental Verification Inspection',
      stage: 'pre_construction',
      status: 'scheduled',
      scheduledDate: '2026-11-05',
      timeSlot: '11:00 AM - 01:00 PM',
      premisesAddress: 'Plot No. PAP-A-12, MIDC Phase II, Chakan, Pune, Maharashtra 410501',
      leadAuthorityCode: 'AUTH-MPCB',
      leadAuthorityName: 'Maharashtra Pollution Control Board',
      notes: 'Consolidated inspection scheduled under Ease of Doing Business protocol.',
      readinessChecklist: [
        { id: 'chk-1', title: 'Site Boundary & Access Road Clear (min 6m)', description: 'Approach road clear for emergency vehicles', completed: true },
        { id: 'chk-2', title: 'Effluent Treatment Plant (ETP) Demarcation', description: 'Civil foundation coordinates staked', completed: true },
        { id: 'chk-3', title: 'Fire Hydrant & Water Reservoir Plan Onsite', description: 'Static reservoir drawings present', completed: false },
      ],
      rectificationPlan: null,
      jointReportSummary: 'Consolidated inspection scheduled under Ease of Doing Business protocol.',
      participatingApprovals: [],
      inspectorChecklists: [],
      createdAt: '2026-10-15T10:00:00Z',
      updatedAt: '2026-10-18T12:00:00Z',
    },
  ];
}

export function getDemoClarifications(_projectId: string = DEMO_PROJECT_ID): ClarificationsInbox {
  return {
    projectId: _projectId,
    total: 0,
    openCount: 0,
    awaitingApplicantCount: 0,
    countsByStatus: {
      requested: 0,
      responded: 0,
      resolved: 0,
      cancelled: 0,
    },
    clarifications: [],
  };
}

/**
 * Intelligent client-side statutory answer generator for Approve Voice Assistant
 */
export function generateApproveClientAnswer(
  message: string,
  _projectId: string = DEMO_PROJECT_ID,
): AssistantChatResponse {
  const q = message.toLowerCase();

  // 1. Navigation Commands
  if (/take me to|open|go to|show me|navigate to/.test(q)) {
    if (/scheme|incentive|subsidy|subsidies/.test(q)) {
      return {
        reply: 'Opening Schemes and Incentives desk now.',
        spokenText: 'Opening Schemes and Incentives desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'schemes', label: 'Open Schemes & Incentives' }],
      };
    }
    if (/roadmap|approval|clearance/.test(q)) {
      return {
        reply: 'Opening Approval Roadmap desk now.',
        spokenText: 'Opening Approval Roadmap desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' }],
      };
    }
    if (/vault|document/.test(q)) {
      return {
        reply: 'Opening Document Vault now.',
        spokenText: 'Opening Document Vault now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'vault', label: 'Open Document Vault' }],
      };
    }
    if (/profile/.test(q)) {
      return {
        reply: 'Opening Business Profile intake now.',
        spokenText: 'Opening Business Profile intake now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'profile', label: 'Open Business Profile' }],
      };
    }
    if (/time|cost|forecast|prediction/.test(q)) {
      return {
        reply: 'Opening Time and Cost Prediction desk now.',
        spokenText: 'Opening Time and Cost Prediction desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'time-cost', label: 'Open Time & Cost Forecast' }],
      };
    }
    if (/inspection/.test(q)) {
      return {
        reply: 'Opening Joint Inspections desk now.',
        spokenText: 'Opening Joint Inspections desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'inspections', label: 'Open Inspections Desk' }],
      };
    }
  }

  // 2. Project Overview / "What is my project?" / "Explain project"
  if (/\b(what.*is.*(the|a|my|this)?\s*project|about.*(the|a|my|this)?\s*project|project.*summary|tell me about|explain.*project|what are we building|project overview|my project|describe.*project)\b/i.test(q)) {
    return {
      reply: [
        '### 🏭 Pune Craft Brewery (MIDC Chakan, Pune, Maharashtra)',
        '',
        '- **Facility Scope**: 6,000 sq.ft. leased industrial shed in MIDC Chakan Phase II, Pune.',
        '- **Project Outlay & Team**: ₹4.00 Crore capital investment, 25 full-time personnel.',
        '- **Statutory Clearances (10 Total)**:',
        '  - 🟢 **Ready for Immediate Submission (3)**: DISH Factory Building Plan Approval, MPCB Consent to Establish (CTE), and Provisional Fire NOC.',
        '  - 🟡 **In Review (1)**: State Excise Brewery & Bottling Licence (BRL-001).',
        '  - 🔴 **Blocked by Prerequisites (3)**: MPCB Consent to Operate (CTO), Final Fire NOC, and DISH Factory Licence.',
        '- **Projected Timelines**: 45 to 65 working days governed by the Maharashtra Right to Services (RTS) Act SLAs.',
        '- **Estimated Statutory Outlay**: ₹1,85,000 to ₹2,40,000 in official government fees.',
      ].join('\n'),
      spokenText: 'Your project Pune Craft Brewery is a 6,000 square foot craft brewery and bottling facility in MIDC Chakan, Pune, Maharashtra. It requires 10 statutory clearances, with 3 ready for immediate filing, 1 in review, and 3 blocked by prerequisites. Clearances are tracked against Maharashtra Right to Services SLAs.',
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
        { type: 'navigate', target: 'profile', label: 'View Profile' },
      ],
    };
  }

  // 3. Blocked Clearances & Prerequisites / "Why blocked" / "Bottlenecks"
  if (/blocked|prerequisite|why.*block|stuck|bottleneck|waiting for|dependency|dependencies/.test(q)) {
    return {
      reply: [
        '### 🛑 Blocked Clearances & Prerequisite Dependencies',
        '',
        '1. **MPCB Consent to Operate (CTO-001)**: Gated by *MPCB Consent to Establish (CTE)*. Once CTE is granted and your effluent treatment plant (ETP) is commissioned, CTO automatically unlocks.',
        '2. **Final Fire Safety Certificate (Final Fire NOC)**: Gated by *Provisional Fire NOC* and physical fire-fighting equipment installation certificate.',
        '3. **DISH Factory Operational Licence**: Gated by *DISH Building Plan Approval* under Rule 3 of Maharashtra Factory Rules.',
        '4. **Excise Brand & Label Registration**: Gated by *Excise Brewery Licence (BRL-001)*.',
        '',
        'Submitting your 3 available filings (DISH Plan, MPCB CTE, Provisional Fire) will clear the critical path to unblock these operations.',
      ].join('\n'),
      spokenText: 'You currently have 3 blocked clearances. For instance, your MPCB Consent to Operate is blocked until Consent to Establish is issued, and your Final Fire NOC requires prior Provisional Fire clearance and physical construction completion.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' }],
    };
  }

  // 4. Available / Next Steps / "What to do next" / "Pending"
  if (/pending|next|what to do|available|status|action|priority|todo/.test(q)) {
    return {
      reply: [
        '### 📋 Immediate Priority Actions',
        '',
        '1. **File 3 Ready Clearances in Parallel**:',
        '   - **DISH Plan Approval**: Directorate of Industrial Safety & Health (30-day RTS SLA).',
        '   - **MPCB Consent to Establish (CTE)**: Orange category industrial pollution consent (45-day RTS SLA).',
        '   - **Provisional Fire NOC**: MIDC Fire Services building drawing clearance (15-day RTS SLA).',
        '2. **Complete Document Vault**:',
        '   - Upload registered MIDC lease deed and ETP process flow diagram.',
        '3. **Claim Priority Credit**:',
        '   - Apply for the ₹5 Cr CGTMSE collateral-free credit guarantee via SIDBI partner banks.',
      ].join('\n'),
      spokenText: 'Your next steps are to submit the 3 available clearances: DISH Factory Plan Approval, MPCB Consent to Establish, and Provisional Fire NOC. Also, upload your registered MIDC lease deed and ETP flow diagram to your Document Vault.',
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'Start Applications' },
        { type: 'navigate', target: 'vault', label: 'Upload Documents' },
      ],
    };
  }

  // 5. Schemes & Incentives / Subsidies / CGTMSE / EPCG / ZED
  if (/scheme|incentive|subsidy|subsidies|grant|cgtmse|epcg|zed|tax holiday|funding|loan|credit|psi/.test(q)) {
    return {
      reply: [
        '### 💰 Government Schemes & Fiscal Incentives',
        '',
        '- **CGTMSE Collateral-Free Credit Guarantee**: Up to **₹5.00 Crore** credit facility without third-party collateral (85% sovereign guarantee cover for MSMEs).',
        '- **EPCG Capital Goods Import Scheme**: **0% customs duty** on imported brewery and bottling equipment against an export obligation of 6x duty saved over 6 years.',
        '- **MSME ZED (Zero Defect Zero Effect)**: **80% subsidy** on green manufacturing certification, water recycling, and ETP standards.',
        '- **Section 80-IAC Tax Holiday**: 100% corporate income tax holiday for 3 consecutive financial years if registered with DPIIT.',
        '- ⚠️ **Maharashtra PSI 2019 Advisory**: Direct state capital subsidies exclude alcohol/distillery manufacturing under Annexure II negative list, but central credit guarantees and duty concessions remain 100% accessible.',
      ].join('\n'),
      spokenText: 'Your enterprise qualifies for three major national programs: a ₹5 Crore collateral-free credit guarantee under CGTMSE, 0% customs duty machinery imports under the EPCG scheme, and an 80% subsidy for MSME ZED green certification. Note that state PSI 2019 cash subsidies exclude alcohol manufacturing under Annexure II.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'Explore Schemes & Incentives' }],
    };
  }

  // 6. Timeline & Costs / Right to Services SLA
  if (/sla|time|timeline|how long|days|cost|fee|budget|duration|expense/.test(q)) {
    return {
      reply: [
        '### ⏱️ Statutory Timeline & Cost Forecast',
        '',
        '- **Total Critical Path Duration**: **45 to 65 working days**.',
        '- **Right to Services (RTS) Protection**: Clearances are subject to statutory deemed-approval clauses under the Maharashtra RTS Act 2015 if competent authorities delay beyond notified SLAs.',
        '- **Statutory Fee Schedule**:',
        '  - MPCB Consent to Establish (CTE): ₹50,000 – ₹75,000 (based on capital investment).',
        '  - Provisional Fire NOC: ₹25,000.',
        '  - DISH Building Plan Approval: ₹15,000.',
        '  - State Excise BRL Licence: ₹1,00,000.',
        '  - **Total Projected Statutory Fees**: **₹1,85,000 – ₹2,40,000**.',
      ].join('\n'),
      spokenText: 'Statutory readiness for Pune Craft Brewery is projected at 45 to 65 working days on the critical path, governed by Maharashtra Right to Services Act SLAs with deemed-approval clauses. Estimated statutory government fees total ₹1,85,000 to ₹2,40,000.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'time-cost', label: 'View Time & Cost Forecast' }],
    };
  }

  // 7. Documents & Vault
  if (/document|vault|missing doc|verification|upload|paperwork|form/.test(q)) {
    return {
      reply: [
        '### 📁 Document Vault & Verification Status',
        '',
        '- **Verified Files (4)**: Company PAN, Certificate of Incorporation, Board Resolution, Site Layout Drawing.',
        '- **Missing Mandatory Files (2)**:',
        '  1. **Registered MIDC Lease Deed**: Gating MPCB CTE & DISH Plan.',
        '  2. **Effluent Treatment Plant (ETP) Process Flow & Schematics**: Required for pollution board consent.',
        '- Upload verified PDFs to auto-populate statutory portal forms across MAITRI and Single Window hubs.',
      ].join('\n'),
      spokenText: 'Your document vault has 4 verified statutory documents. You have 2 missing mandatory documents required for MPCB CTE: the registered MIDC Lease Deed and the ETP Process Flow Diagram.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'vault', label: 'Open Document Vault' }],
    };
  }

  // 8. Inspections
  if (/inspection|joint inspection|site visit|auditor/.test(q)) {
    return {
      reply: [
        '### 🔍 Statutory Inspections Schedule',
        '',
        '- **Joint Site Inspection**: MPCB and MIDC Fire Services conduct a single synchronized inspection within 14 days of CTE submission under Ease of Doing Business mandates.',
        '- **DISH Factory Safety Inspection**: Pre-commissioning verification of plant safety guards, pressure vessels, and worker emergency exits.',
      ].join('\n'),
      spokenText: 'Your project requires 2 statutory inspections: a Joint Site Inspection by MPCB and MIDC Fire Services prior to CTE, and a final factory inspection by the Directorate of Industrial Safety and Health.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'inspections', label: 'View Inspection Schedule' }],
    };
  }

  // Default Rich Response
  return {
    reply: [
      '### 👋 I\'m Approve, your AI Voice Copilot',
      '',
      'I have complete visibility into your **Pune Craft Brewery** case file:',
      '- **10 Applicable Statutory Clearances** (3 ready to file, 1 in review, 3 blocked by dependencies).',
      '- **45–65 Working Days SLA Timeline** under the Maharashtra RTS Act.',
      '- **₹5.00 Cr CGTMSE Credit Guarantee & 0% EPCG Duty Waiver**.',
      '',
      'You can speak or type questions like:',
      '- *"What approvals are blocked?"*',
      '- *"What do I need to do next?"*',
      '- *"What subsidies am I eligible for?"*',
      '- *"How long will my clearances take?"*',
      '- *"Show me my document vault"*',
    ].join('\n'),
    spokenText: 'I\'m Approve, your voice assistant for ApprovalIQ. For your Pune Craft Brewery project, you have 10 statutory clearances, 3 ready to file, and 3 blocked by prerequisites. You are also eligible for ₹5 Crore CGTMSE financing and 0% duty machinery imports. What would you like to explore?',
    mode: 'offline',
    actions: [
      { type: 'navigate', target: 'roadmap', label: 'Open Roadmap' },
      { type: 'navigate', target: 'schemes', label: 'View Schemes' },
    ],
  };
}

export function getOfflineAssistantChat(
  projectId: string,
  message: string,
): AssistantChatResponse {
  return generateApproveClientAnswer(message, projectId);
}

export function getOfflineGeneralChat(message: string): AssistantChatResponse {
  const q = message.toLowerCase();

  if (/what is approvaliq|explain|overview|how does.*work|about/.test(q)) {
    return {
      reply: "ApprovalIQ is India's industrial single-window clearance intelligence platform. We evaluate your business parameters, map out a clear dependency roadmap of statutory clearances, and match you with eligible government schemes and subsidies.",
      spokenText: "ApprovalIQ is India's industrial single-window clearance intelligence platform. We evaluate your business parameters, map out a clear dependency roadmap of statutory clearances, and match you with eligible government schemes and subsidies.",
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Explore Platform' }],
    };
  }

  if (/scheme|incentive|subsidy|subsidies|grant|cgtmse|epcg|tax holiday|zed/.test(q)) {
    return {
      reply: 'ApprovalIQ checks your eligibility for top state and central schemes, including ₹5 Crore CGTMSE collateral-free financing, 0% export customs duty under EPCG, Section 80-IAC tax holidays, and MSME ZED green certification subsidies.',
      spokenText: 'ApprovalIQ checks your eligibility for top state and central schemes, including ₹5 Crore CGTMSE collateral-free financing, 0% export customs duty under EPCG, Section 80-IAC tax holidays, and MSME ZED green certification subsidies.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'View Schemes' }],
    };
  }

  return generateApproveClientAnswer(message, DEMO_PROJECT_ID);
}
