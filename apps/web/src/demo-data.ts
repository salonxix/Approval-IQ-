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

  // 1. CGTMSE Collateral-Free Credit Guarantee
  if (/cgtmse|collateral|credit guarantee|loan|bank loan|debt|sidbi|term loan|financing/.test(q)) {
    return {
      query,
      answer: "Under the **Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)**, your Pune Craft Brewery unit qualifies for up to **₹5.00 Crore** in collateral-free credit facilities. The trust provides an **85% sovereign guarantee cover** for MSME manufacturing units, allowing you to secure term loans for brewhouse equipment and working capital limits without pledging personal residential property or third-party collateral.",
      relevantSchemes: ['MSME-CGTMSE-001', 'MSME-UDYAM-001'],
      actionableSteps: [
        'Obtain Udyam MSME Registration Certificate for Small Enterprise classification',
        'Prepare Detailed Project Report (DPR) with 7-year DSCR financial projections (target DSCR >= 1.5)',
        'Submit loan application through nationalized partner banks (SBI, Bank of Baroda, HDFC, or SIDBI) under CGTMSE cover',
      ],
      confidenceScore: 0.98,
      sourceAttribution: 'Ministry of MSME & SIDBI CGTMSE Operational Guidelines 2026',
      timestamp: new Date().toISOString(),
    };
  }

  // 2. EPCG 0% Customs Duty Machinery Import
  if (/epcg|customs|import|duty|machinery|kettle|fermenter|brewhouse|bottling line/.test(q)) {
    return {
      query,
      answer: "The **EPCG (Export Promotion Capital Goods)** scheme allows you to import high-efficiency brewing kettles, conical fermenters, bright beer tanks (BBTs), and automated bottling lines at **0% basic customs duty** (normally 27.5% combined tariff). In return, you commit to an export obligation equivalent to **6 times the customs duty saved** over a block of 6 years (or 75% deemed export if supplying duty-free international export channels).",
      relevantSchemes: ['DGFT-EPCG-001'],
      actionableSteps: [
        'Obtain Importer-Exporter Code (IEC) from DGFT portal',
        'Acquire Chartered Engineer Certificate certifying technical specifications of imported brewing plant',
        'Submit online EPCG authorization application prior to equipment bill of lading',
      ],
      confidenceScore: 0.96,
      sourceAttribution: 'Directorate General of Foreign Trade (DGFT) Foreign Trade Policy',
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Maharashtra PSI 2019 & Negative List Policy Analysis
  if (/psi|maharashtra|negative list|annexure ii|subsidy|sgst|state grant|capital subsidy/.test(q)) {
    return {
      query,
      answer: "Under the **Maharashtra Package Scheme of Incentives (PSI 2019)**, potable alcohol, beer brewing, and distillery manufacturing units are categorized under the **Annexure II Negative List** (Item 4). Consequently, your unit is **excluded from direct state SGST cash reimbursement and capital cash grants**. However, your enterprise remains **100% eligible** for Central CGTMSE ₹5.00 Cr credit guarantees, EPCG 0% customs duty waivers, Section 80-IAC 3-year tax holidays, and state electricity duty exemptions.",
      relevantSchemes: ['MAHA-PSI-2019', 'MSME-CGTMSE-001', 'DGFT-EPCG-001', 'STARTUP-80IAC-001'],
      actionableSteps: [
        'Structure fiscal planning around Central MSME credit guarantees rather than state cash grants',
        'Register under MSME Udyam to claim statutory electricity duty waivers',
        'Leverage Section 80-IAC for a 3-year complete corporate income tax holiday',
      ],
      confidenceScore: 0.99,
      sourceAttribution: 'Government of Maharashtra Industries Department GR PSI-2019/CR-46 (Annexure II)',
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Section 80-IAC 3-Year Corporate Tax Holiday
  if (/80-iac|80iac|tax holiday|income tax|corporate tax|tax exemption|dpiit|startup/.test(q)) {
    return {
      query,
      answer: "Under **Section 80-IAC of the Income Tax Act**, eligible DPIIT-recognized startups can claim a **100% deduction of profits and gains for 3 consecutive financial years** out of the first 10 years of incorporation. For Pune Craft Brewery, this allows you to shelter retained earnings from corporate income tax and reinvest operating cash flows directly into plant expansion and working capital.",
      relevantSchemes: ['STARTUP-80IAC-001'],
      actionableSteps: [
        'Ensure incorporation as a Private Limited Company or LLP within the last 10 years',
        'Obtain DPIIT Startup India Recognition Certificate via Startup India portal',
        'Submit Form-1 application to the Inter-Ministerial Board (IMB) for tax exemption certificate',
      ],
      confidenceScore: 0.95,
      sourceAttribution: 'Central Board of Direct Taxes (CBDT) & DPIIT Startup India Guidelines',
      timestamp: new Date().toISOString(),
    };
  }

  // 5. MSME ZED (Zero Defect Zero Effect) Green Manufacturing Subsidy
  if (/zed|zero defect|green subsidy|iso|clean energy|environmental subsidy|audit subsidy/.test(q)) {
    return {
      query,
      answer: "The **MSME ZED (Zero Defect Zero Effect)** certification scheme provides up to an **80% financial subsidy** on environmental audits, water conservation assessments, cleaner technology adoption, and quality certification costs. Achieving ZED Silver or Gold certification also unlocks an **additional 0.5% interest rate discount** on bank credit facilities.",
      relevantSchemes: ['MSME-ZED-001', 'MSME-CGTMSE-001'],
      actionableSteps: [
        'Enrol on the MSME ZED portal using your Udyam registration number',
        'Conduct the initial online self-assessment for environmental and quality benchmarks',
        'Schedule accredited desktop and physical site verification during ETP commissioning',
      ],
      confidenceScore: 0.94,
      sourceAttribution: 'Ministry of MSME ZED Sustainable Certification Guidelines',
      timestamp: new Date().toISOString(),
    };
  }

  // 6. Electricity Duty Exemption
  if (/electricity|power tariff|duty exemption|msedcl subsidy|power rebate|energy/.test(q)) {
    return {
      query,
      answer: "Under the **Maharashtra Electricity Duty Act**, manufacturing MSMEs holding an active Udyam registration are eligible for a **100% exemption from state electricity duty for a period of 5 years** from the date of commercial production. In MIDC Chakan (Group C taluka), this duty waiver saves approximately **₹1.20 to ₹1.80 per kWh**, substantially reducing monthly power utility operating expenditure.",
      relevantSchemes: ['MSME-UDYAM-001', 'MAHA-ELEC-2026'],
      actionableSteps: [
        'Secure permanent HT 150 kVA power connection meter installation from MSEDCL',
        'Submit application for Electricity Duty Exemption to the Electrical Inspectorate, Pune Division',
        'Furnish certified copy of Udyam Certificate and factory commercial production commencement certificate',
      ],
      confidenceScore: 0.95,
      sourceAttribution: 'Maharashtra Energy Department GR on Industrial Electricity Duty Concessions',
      timestamp: new Date().toISOString(),
    };
  }

  // 7. Stamp Duty Concessions on MIDC Lease
  if (/stamp duty|lease deed stamp|registration concession|midc stamp/.test(q)) {
    return {
      query,
      answer: "Industrial lease deeds executed for plots or built-up sheds inside **MIDC Industrial Parks** qualify for **concessional stamp duty of 0.5%** under the Maharashtra Stamp Act (compared to standard 5% commercial lease rates). For your 6,000 sq.ft shed lease in MIDC Chakan Phase II, this limits stamp duty to statutory minimum slabs.",
      relevantSchemes: ['MAHA-STAMP-CONCESSION'],
      actionableSteps: [
        'Obtain formal MIDC sub-lease sanction order from MIDC Regional Officer Pune',
        'Draft registered lease deed citing Maharashtra Industrial Policy Stamp Concession clauses',
        'Pay duty via Government Receipt Accounting System (GRAS) at Sub-Registrar Khed/Chakan',
      ],
      confidenceScore: 0.93,
      sourceAttribution: 'Inspector General of Registration & Stamps, Maharashtra State',
      timestamp: new Date().toISOString(),
    };
  }

  // 8. GST, Input Tax Credit & Excise Interplay
  if (/gst|vat|mvat|tax structure|indirect tax|input tax credit|itc|inverted duty/.test(q)) {
    return {
      query,
      answer: "Under **Article 366(12A) of the Constitution of India**, alcoholic liquor for human consumption is constitutionally excluded from GST and is governed by **Maharashtra State Excise Duty + Maharashtra VAT (MVAT)**. Raw materials (malt, hops), packaging (glass bottles, cans), and brewery plant machinery incur **18% to 28% GST**. Because finished beer is outside GST, **Input Tax Credit (ITC) cannot be adjusted against State Excise or VAT**, making input GST a direct component of production cost.",
      relevantSchemes: ['DGFT-EPCG-001'],
      actionableSteps: [
        'Utilize EPCG scheme to eliminate the 27.5% customs duty/IGST component on imported brewhouse plant',
        'Maintain segregated accounting books for GST-paid capital inputs and State Excise revenue passes',
        'File regular GSTR-1 and GSTR-3B for outward supply of non-potable by-products (spent grain cattle feed)',
      ],
      confidenceScore: 0.97,
      sourceAttribution: 'GST Council Constitutional Provisions & Maharashtra State Excise Department',
      timestamp: new Date().toISOString(),
    };
  }

  // 9. Udyam MSMED Act 45-Day Payment Protection
  if (/udyam|samadhaan|delayed payment|buyer protection|section 15|45 days|payment delay/.test(q)) {
    return {
      query,
      answer: "Under **Section 15 & 16 of the MSMED Act, 2006**, all institutional buyers (hotel chains, licensed distributors, retailers) are legally mandated to make payment to registered MSME suppliers within **45 days**. If payment is delayed beyond 45 days, the buyer is statutorily liable to pay **compound interest with monthly rests at 3 times the RBI Bank Rate**.",
      relevantSchemes: ['MSME-UDYAM-001', 'MSME-SAMADHAAN-001'],
      actionableSteps: [
        'Print your Udyam Registration number on every commercial invoice and delivery challan',
        'State payment due date strictly within 45 days on all wholesale dispatch notes',
        'File delayed payment recovery claims on the MSME Samadhaan portal for summary resolution in Pune',
      ],
      confidenceScore: 0.96,
      sourceAttribution: 'Ministry of Micro, Small and Medium Enterprises (MSMED Act 2006)',
      timestamp: new Date().toISOString(),
    };
  }

  // 10. Solar Rooftop & Renewable Energy Subsidies (MEDA)
  if (/solar|meda|rooftop solar|renewable|clean energy|power cost/.test(q)) {
    return {
      query,
      answer: "Through the **Maharashtra Energy Development Agency (MEDA)** and MSEDCL Industrial Solar Net Metering regulations, your 6,000 sq.ft industrial shed in Chakan Phase II can accommodate up to a **50 kW to 80 kW grid-tied rooftop solar array**. This reduces your daytime brewhouse refrigeration and power bill by up to 40%, with excess generation banked into the MSEDCL grid under gross/net metering tariffs.",
      relevantSchemes: ['MEDA-SOLAR-2026', 'MSME-ZED-001'],
      actionableSteps: [
        'Conduct roof structural load stability assessment with an empanelled chartered engineer',
        'Submit grid-connectivity feasibility application on the MSEDCL solar rooftop portal',
        'Leverage accelerated depreciation (40%) under Section 32 of Income Tax Act for solar plant assets',
      ],
      confidenceScore: 0.92,
      sourceAttribution: 'Maharashtra Energy Development Agency (MEDA) Rooftop Guidelines',
      timestamp: new Date().toISOString(),
    };
  }

  // 11. Working Capital Lines & Priority Sector MSME Banking
  if (/working capital|cash credit|cc limit|overdraft|priority sector|bank financing/.test(q)) {
    return {
      query,
      answer: "As an Udyam-registered Small Enterprise, Pune Craft Brewery qualifies for **Priority Sector Lending (PSL)** bank facilities from public and private scheduled banks at concessional rates (8.5% to 9.5% p.a.). Lenders calculate **Cash Credit (CC) limits based on 20% to 25% of projected annual turnover** (Nayak Committee formula), hypothecated against raw malt stock, packaging material, and trade receivables.",
      relevantSchemes: ['MSME-CGTMSE-001', 'MSME-UDYAM-001'],
      actionableSteps: [
        'Prepare 12-month month-wise working capital requirement statement and inventory holding cycle',
        'Approach partner banks (State Bank of India MSME Chakan branch, Bank of Baroda, or SIDBI Pune)',
        'Link working capital loan sanction to CGTMSE guarantee cover to avoid personal real estate pledge',
      ],
      confidenceScore: 0.95,
      sourceAttribution: 'Reserve Bank of India (RBI) Priority Sector Lending Master Circular',
      timestamp: new Date().toISOString(),
    };
  }

  // 12. Dynamic Fiscal & Scheme Synthesizer (for any other inquiry)
  return {
    query,
    answer: `For **Pune Craft Brewery** (₹4.00 Cr CapEx in MIDC Chakan Phase II, Maharashtra), your statutory financial optimization strategy focuses on central credit and customs programs: **₹5.00 Crore CGTMSE** collateral-free financing (85% sovereign guarantee), **0% EPCG customs duty** on brewery plant imports, **Section 80-IAC** 3-year corporate income tax holidays, and **5-year electricity duty exemptions** under Udyam. While direct state SGST cash grants are restricted under Maharashtra PSI-2019 Annexure II, these combined central programs save over **₹75 Lakhs in capital and tax outlays**.`,
    relevantSchemes: ['MSME-CGTMSE-001', 'DGFT-EPCG-001', 'STARTUP-80IAC-001', 'MSME-ZED-001', 'MSME-UDYAM-001'],
    actionableSteps: [
      'Maintain active Udyam Small Enterprise certification for bank credit and utility concessions',
      'Apply for EPCG 0% duty authorization prior to foreign equipment shipments',
      'Submit CGTMSE collateral-free loan dossier with audited 7-year DSCR financial model',
    ],
    confidenceScore: 0.94,
    sourceAttribution: 'ApprovalIQ Statutory Regulatory Knowledge Base & MSME Policy Framework',
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
/**
 * Intelligent client-side statutory answer generator for Approve Voice Assistant
 */

/**
 * Attempt a live LLM call if the user or environment has configured an AI API key.
 */
async function tryLiveLlmAnswer(
  query: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
): Promise<AssistantChatResponse | null> {
  if (typeof window === 'undefined') return null;
  const apiKey =
    localStorage.getItem('approvaliq_ai_api_key') ||
    localStorage.getItem('openrouter_api_key') ||
    localStorage.getItem('openai_api_key') ||
    (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_AI_API_KEY) ||
    '';

  if (!apiKey) return null;

  const systemPrompt = `You are "Approve", the dedicated intelligent Voice Assistant and Statutory Compliance Copilot for ApprovalIQ (India's industrial single-window clearance intelligence platform).
The active facility is "Pune Craft Brewery":
- Location: 6,000 sq.ft. leased industrial shed in MIDC Chakan Phase II, Taluka Khed, District Pune, Maharashtra.
- Capital Outlay: ₹4.00 Crore, 25 full-time personnel.
- Industry: Craft Beer Brewing, Fermentation & Bottling (Orange Category under MPCB).
- Statutory Clearances: 10 Total. 3 Ready to file (DISH Factory Building Plan, MPCB Consent to Establish, Provisional Fire NOC), 1 In Review (State Excise BRL-001), 3 Blocked by prerequisites (MPCB CTO, Final Fire NOC, DISH Factory Licence).
- Key Regulations: Maharashtra Right to Services (RTS) Act 2015 (strict SLAs, deemed approval clauses), Factories Act 1948, Food Safety and Standards (Alcoholic Beverages) Regulations 2018, Legal Metrology (Packaged Commodities) Rules 2011 Rule 27.
- Fiscal Schemes: Eligible for ₹5.00 Cr CGTMSE collateral-free guarantee, 0% customs duty on equipment under EPCG, Section 80-IAC 3-year tax holiday, MSME ZED 80% subsidy. Excluded from direct state cash subsidies under Maharashtra PSI 2019 Annexure II negative list (Item 4).

Respond directly, accurately, and authoritatively to the user's question with specific statutory rules, authority names, technical standards, or legal procedures. Keep the tone professional, encouraging, and clear.
Return a valid JSON object in this format:
{
  "reply": "Markdown detailed answer with bullet points and bold highlights",
  "spokenText": "Plain English spoken version (2-4 clear sentences) to be read aloud via text-to-speech",
  "actions": [ { "type": "navigate", "target": "roadmap" | "schemes" | "vault" | "profile" | "time-cost" | "inspections" | "grievances", "label": "Button Label" } ]
}`;

  try {
    const isOpenRouter = apiKey.startsWith('sk-or-') || apiKey.length > 50;
    const endpoint = isOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map((h) => ({ role: h.role, content: h.content.slice(0, 1000) })),
      { role: 'user', content: query },
    ];

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: isOpenRouter ? 'google/gemini-2.0-flash-001' : 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return {
          reply: parsed.reply || parsed.answer || content,
          spokenText: parsed.spokenText || parsed.spoken || parsed.reply || content,
          mode: 'llm',
          actions: Array.isArray(parsed.actions) ? parsed.actions : [],
        };
      }
    }
  } catch {
    // Graceful fallback to deterministic statutory synthesis
  }
  return null;
}

/**
 * Dynamic Contextual Reasoning Synthesizer for questions outside the primary keyword patterns.
 * Never returns a canned greeting menu. Parses the user's intent and delivers an authoritative,
 * project-grounded statutory reply.
 */
function synthesizeDynamicReasoning(message: string, _projectId: string): AssistantChatResponse {
  const cleanQ = message.trim();
  const lower = cleanQ.toLowerCase();

  // Extract core domain concepts
  const tokens = lower
    .replace(/[?.,!/\\;:'"()[\]{}]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|what|how|why|can|will|should|with|about|tell|give|please|there|this|that|your|from|into|onto|have|does|when|where|which|who)$/.test(w));

  const subjectPhrase = tokens.slice(0, 4).join(' ') || 'regulatory operations';

  return {
    reply: [
      `### ⚖️ Statutory & Compliance Assessment: ${cleanQ}`,
      '',
      `For your **Pune Craft Brewery** facility (6,000 sq.ft. leased shed in **MIDC Chakan Phase II, Pune**, ₹4.00 Cr CapEx, 25 employees, Orange Category Fermentation):`,
      '',
      `1. **Statutory Stance & Feasibility**:`,
      `   - Commercial craft brewing and bottling in Maharashtra operates under a dual jurisdiction: **Maharashtra State Excise** (manufacturing integrity & revenue passes) and the **Directorate of Industrial Safety & Health (DISH)** / **MPCB** (occupational safety & pollution limits).`,
      `   - Any operational or facility modification relating to **"${subjectPhrase}"** must conform strictly to your approved site layout drawings and the conditions of **Form BRL-001** (State Excise) and **Consent to Establish (CTE)**.`,
      '',
      `2. **Regulatory Authority & Filing Protocols**:`,
      `   - **Competent Authorities**: Maharashtra Pollution Control Board (SRO Pune-II), MIDC Special Planning Authority (SPA), and Commissioner of State Excise, Maharashtra.`,
      `   - Under the **Maharashtra Right to Services (RTS) Act 2015**, statutory changes or endorsements carry binding SLA timelines (15 to 45 working days) with statutory deemed-approval safeguards.`,
      '',
      `3. **Immediate Recommended Action Steps**:`,
      `   - 📋 Ensure all technical specifications, equipment ratings, and floor layouts are uploaded to your **Document Vault**.`,
      `   - 🔄 File statutory filings through the **MAITRI Single Window portal** to trigger synchronized statutory time clocks.`,
      `   - 💼 Verify with your chartered engineer that all installations preserve your **₹5.00 Cr CGTMSE** loan covenants and zero-liquid-discharge (ZLD) effluent parameters.`,
    ].join('\n'),
    spokenText: `Regarding ${subjectPhrase} for your Pune Craft Brewery in MIDC Chakan, this falls under State Excise, DISH, and MPCB compliance. All technical specifications must align with your approved layout drawings and MAITRI single window filings, protected by Maharashtra Right to Services Act SLAs.`,
    mode: 'offline',
    actions: [
      { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
      { type: 'navigate', target: 'vault', label: 'Check Vault' },
      { type: 'navigate', target: 'schemes', label: 'Explore Schemes' },
    ],
  };
}

/**
 * Comprehensive Statutory Knowledge Engine for Approve Voice Assistant.
 * Covers 35+ domain areas with deep legal citations, official authority names,
 * quantitative thresholds, and immediate actionable steps.
 */
function synthesizeStatutoryAnswer(
  message: string,
  _projectId: string = DEMO_PROJECT_ID,
): AssistantChatResponse {
  const q = message.toLowerCase();

  // 1. Navigation Commands
  if (/take me to|open|go to|show me|navigate to/.test(q)) {
    if (/scheme|incentive|subsidy|subsidies|grant|funding/.test(q)) {
      return {
        reply: 'Opening Schemes and Incentives desk now.',
        spokenText: 'Opening Schemes and Incentives desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'schemes', label: 'Open Schemes & Incentives' }],
      };
    }
    if (/roadmap|approval|clearance|license|licence|dag/.test(q)) {
      return {
        reply: 'Opening Approval Roadmap desk now.',
        spokenText: 'Opening Approval Roadmap desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' }],
      };
    }
    if (/vault|document|paperwork|file|upload/.test(q)) {
      return {
        reply: 'Opening Document Vault now.',
        spokenText: 'Opening Document Vault now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'vault', label: 'Open Document Vault' }],
      };
    }
    if (/profile|business profile|parameters|intake/.test(q)) {
      return {
        reply: 'Opening Business Profile intake now.',
        spokenText: 'Opening Business Profile intake now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'profile', label: 'Open Business Profile' }],
      };
    }
    if (/time|cost|forecast|prediction|budget|estimate/.test(q)) {
      return {
        reply: 'Opening Time and Cost Prediction desk now.',
        spokenText: 'Opening Time and Cost Prediction desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'time-cost', label: 'Open Time & Cost Forecast' }],
      };
    }
    if (/inspection|site visit|auditor/.test(q)) {
      return {
        reply: 'Opening Joint Inspections desk now.',
        spokenText: 'Opening Joint Inspections desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'inspections', label: 'Open Inspections Desk' }],
      };
    }
    if (/grievance|appeal|dispute|delay|escalat/.test(q)) {
      return {
        reply: 'Opening Grievance and RTS Appeals desk now.',
        spokenText: 'Opening Grievance and RTS Appeals desk now.',
        mode: 'offline',
        actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Grievance Desk' }],
      };
    }
  }

  // 2. Project Overview & Scope
  if (/\b(what.*is.*(the|a|my|this)?\s*project|about.*(the|a|my|this)?\s*project|project.*summary|tell me about|explain.*project|what are we building|project overview|my project|describe.*project)\b/i.test(q)) {
    return {
      reply: [
        '### 🏭 Pune Craft Brewery (MIDC Chakan Phase II, Pune, Maharashtra)',
        '',
        '- **Facility Scope**: 6,000 sq.ft. leased industrial shed in MIDC Chakan Phase II, Taluka Khed, District Pune.',
        '- **Project Outlay & Team**: ₹4.00 Crore capital investment, 25 full-time personnel (18 plant operations, 7 administration).',
        '- **Industrial Classification**: Orange Category Fermentation & Potable Beer Manufacturing under MPCB norms.',
        '- **Statutory Clearances (10 Total)**:',
        '  - 🟢 **Ready for Immediate Submission (3)**: DISH Factory Building Plan Approval (Rule 3), MPCB Consent to Establish (CTE), and Provisional Fire NOC.',
        '  - 🟡 **In Review (1)**: State Excise Brewery & Bottling Licence (Form BRL-001, App ID: EX-BRL-2026-088).',
        '  - 🔴 **Blocked by Prerequisites (3)**: MPCB Consent to Operate (CTO), Final Fire NOC, and DISH Factory Licence.',
        '- **Statutory Timelines**: 45 to 65 working days governed by Maharashtra Right to Services (RTS) Act SLAs.',
        '- **Government Fee Outlay**: ₹1,85,000 to ₹2,40,000 in official statutory fees.',
      ].join('\n'),
      spokenText: 'Your project Pune Craft Brewery is a 6,000 square foot craft brewery and bottling facility in MIDC Chakan, Pune, Maharashtra. It requires 10 statutory clearances, with 3 ready for immediate filing, 1 in review, and 3 blocked by prerequisites. Clearances are tracked against Maharashtra Right to Services SLAs.',
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
        { type: 'navigate', target: 'profile', label: 'View Profile' },
      ],
    };
  }

  // 3. Blocked Clearances & Prerequisites / Bottlenecks
  if (/blocked|prerequisite|why.*block|stuck|bottleneck|waiting for|dependency|dependencies/.test(q)) {
    return {
      reply: [
        '### 🛑 Blocked Clearances & Prerequisite Dependencies',
        '',
        '1. **MPCB Consent to Operate (CTO-001)**: Strictly gated by **MPCB Consent to Establish (CTE)** and physical commissioning of your 15–20 KLD Effluent Treatment Plant (ETP).',
        '2. **Final Fire Safety Certificate (Final Fire NOC)**: Gated by **Provisional Fire NOC** and submission of Form A/B compliance certificate certifying hydro-testing of hydrants and sprinkler response.',
        '3. **DISH Factory Operational Licence**: Gated by **DISH Building Plan Approval** under Rule 3 of Maharashtra Factories Rules and physical plant erection.',
        '4. **Excise Brand & Label Registration**: Gated by issuance of primary **Excise Brewery Licence (BRL-001)**.',
        '',
        'Filing your 3 available applications (DISH Plan, MPCB CTE, Provisional Fire) unlocks the critical path to unblock these operations.',
      ].join('\n'),
      spokenText: 'You currently have 3 blocked clearances. For instance, your MPCB Consent to Operate is blocked until Consent to Establish is issued, and your Final Fire NOC requires prior Provisional Fire clearance and physical construction completion.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' }],
    };
  }

  // 4. Immediate Priority Actions / What To Do Next
  if (/pending|next|what to do|available|status|action|priority|todo|where to start|first step/.test(q)) {
    return {
      reply: [
        '### 📋 Immediate Priority Action Plan',
        '',
        '1. **Submit 3 Available Clearances in Parallel**:',
        '   - **DISH Factory Plan Approval**: Directorate of Industrial Safety & Health (30-day RTS SLA).',
        '   - **MPCB Consent to Establish (CTE)**: Orange category pollution consent (45-day RTS SLA).',
        '   - **Provisional Fire NOC**: MIDC Fire Services building drawing clearance (15-day RTS SLA).',
        '2. **Complete Document Vault**:',
        '   - Upload your registered **MIDC Lease Deed** and **ETP Process Flow & P&ID Diagram**.',
        '3. **Secure Financial Guarantee**:',
        '   - Submit your loan dossier for the **₹5.00 Cr CGTMSE** collateral-free credit facility through SIDBI/SBI.',
      ].join('\n'),
      spokenText: 'Your next steps are to submit the 3 available clearances: DISH Factory Plan Approval, MPCB Consent to Establish, and Provisional Fire NOC. Also, upload your registered MIDC lease deed and ETP flow diagram to your Document Vault.',
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'Start Applications' },
        { type: 'navigate', target: 'vault', label: 'Upload Documents' },
      ],
    };
  }

  // 5. MPCB Consent to Establish (CTE)
  if (/cte\b|consent to establish|mpcb.*establish|pollution.*establish|pollution board/.test(q)) {
    return {
      reply: [
        '### 🌿 MPCB Consent to Establish (CTE) — Regulatory Blueprint',
        '',
        '- **Competent Authority**: Maharashtra Pollution Control Board (MPCB), Sub-Regional Office Pune-II.',
        '- **Industrial Classification**: Orange Category (Fermentation & Potable Alcohol Manufacturing).',
        '- **Statutory SLA**: **45 working days** under Maharashtra Right to Services (RTS) Act 2015. Deemed approval activates on day 46 if no formal query is raised.',
        '- **Technical Mandates**:',
        '  - Dedicated **15–20 KLD Effluent Treatment Plant (ETP)** treating trade wastewater to BOD < 30 mg/L, COD < 250 mg/L, TSS < 100 mg/L before discharge into the MIDC Chakan sewer network.',
        '  - Acoustic enclosure on backup DG sets (75 dB at 1m) and stack height conforming to CPCB formulas.',
        '- **Statutory Fee**: ₹50,000 to ₹75,000 (calculated on ₹4.00 Cr Gross Capital Investment).',
        '- **Status**: **Ready for Immediate Submission** (Application ID: MPCB-CTE-2026-034).',
      ].join('\n'),
      spokenText: 'Your MPCB Consent to Establish is ready for submission under the Orange category with a 45 working day SLA. It requires a 15 to 20 KLD effluent treatment plant with BOD under 30 milligrams per litre and statutory fees between fifty and seventy-five thousand rupees.',
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'Submit CTE' },
        { type: 'navigate', target: 'vault', label: 'Check ETP Drawings' },
      ],
    };
  }

  // 6. MPCB Consent to Operate (CTO)
  if (/cto\b|consent to operate|mpcb.*operate|pollution.*operate|operating consent|trial run|trial production/.test(q)) {
    return {
      reply: [
        '### 🏭 MPCB Consent to Operate (CTO) — Pre-Commissioning Rules',
        '',
        '- **Competent Authority**: Maharashtra Pollution Control Board (MPCB), Regional Office Pune.',
        '- **Prerequisite**: Strictly gated by **MPCB Consent to Establish (CTE)** and physical completion of plant construction & ETP erection.',
        '- **Statutory SLA**: **30 working days** under the RTS Act.',
        '- **Mandatory Submission Documents**:',
        '  1. CA-certified Capital Investment Certificate verifying final plant cost.',
        '  2. ETP adequacy and performance report certified by an MoEF/NABL recognized laboratory.',
        '  3. Point-to-point compliance report against all CTE conditional terms.',
        '- ⚠️ **Legal Warning**: Operating brewing machinery without a valid CTO attracts immediate closure notices under Section 33A of the Water Act 1974, disconnection of electricity/water, and criminal penalties.',
      ].join('\n'),
      spokenText: 'MPCB Consent to Operate is strictly gated by prior Consent to Establish and physical ETP commissioning. Operating without CTO is illegal and subject to immediate power disconnection and closure under Section 33A of the Water Act.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View Roadmap' }],
    };
  }

  // 7. Effluent Treatment Plant (ETP) & Discharge Norms
  if (/etp\b|effluent|wastewater|sewage|bod\b|cod\b|tss\b|ph\b|zero liquid discharge|zld|discharge|chakan cetp|pollution treatment/.test(q)) {
    return {
      reply: [
        '### 💧 Effluent Treatment Plant (ETP) & Environmental Standards',
        '',
        '- **Design Capacity**: 15 to 20 KLD (Kilolitres per day) hydraulic handling capacity.',
        '- **Brewery Effluent Characteristics**: High organic load (spent wort, yeast trub, CIP washdown) with raw BOD ~3,000 mg/L and COD ~6,000 mg/L.',
        '- **Required Treatment Train**:',
        '  1. **Primary**: Bar screening + Oil & Grease trap + Equalization tank with coarse air diffusion.',
        '  2. **Secondary (Biological)**: Anaerobic UASB reactor (recovering 75% COD) followed by Aerobic Activated Sludge / MBBR aeration.',
        '  3. **Tertiary**: Secondary clarifier + Pressure Sand Filter + Activated Carbon Filter + Sludge drying beds.',
        '- **Treated Discharge Standards (MIDC Sewer into Chakan CETP)**:',
        '  - **BOD**: $\\le 30$ mg/L | **COD**: $\\le 250$ mg/L | **TSS**: $\\le 100$ mg/L | **pH**: 6.5 – 8.5.',
        '  - Zero untreated effluent discharge permitted outside premises.',
      ].join('\n'),
      spokenText: 'Your brewery requires a 15 to 20 KLD Effluent Treatment Plant with primary screening, anaerobic UASB, and aerobic MBBR stages. Treated discharge must meet MPCB limits of BOD under 30 and COD under 250 before entering the MIDC Chakan sewer network.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'vault', label: 'Upload ETP Flow Diagram' }],
    };
  }

  // 8. Brewers Spent Grain (BSG), Waste Disposal & Cattle Feed
  if (/spent grain|bsg|spent malt|cattle feed|spent yeast|byproduct|by-product|waste disposal|organic waste/.test(q)) {
    return {
      reply: [
        '### 🌾 Brewers Spent Grain (BSG) & Waste Management Protocols',
        '',
        '- **Generation Rate**: Approximately 20 kg of wet spent grain per 100 litres of finished craft beer.',
        '- **Nutritional Value & Commercial Off-Take**: High protein (28% dry basis) and digestible fiber, highly prized as supplementary cattle feed.',
        '- **Regulatory Mandate under MPCB Solid Waste Rules**:',
        '  - Must not be disposed into municipal dump-yards or open land.',
        '  - Must be collected in covered, stainless or HDPE hoppers with drainage traps for leachate.',
        '  - Enter into a formal buy-back / off-take agreement with local dairy cooperatives in Khed/Chakan for daily collection within 24 hours of lautering.',
      ].join('\n'),
      spokenText: 'Brewers spent grain must be stored in covered hoppers and collected daily under off-take contracts with local Pune dairy farms as cattle feed. MPCB strictly prohibits open landfill disposal of organic brewing waste.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'vault', label: 'Store Off-take Contract' }],
    };
  }

  // 9. State Excise Brewery Licence (Form BRL-001)
  if (/brl\b|brl-001|excise.*licen[sc]e|brewery licen[sc]e|bottling licen[sc]e|state excise|excise commissioner|bonded warehouse|potable alcohol/.test(q)) {
    return {
      reply: [
        '### 🍺 Maharashtra State Excise Brewery & Bottling Licence (Form BRL-001)',
        '',
        '- **Competent Authority**: Commissioner of State Excise, Maharashtra State (Old Custom House, Fort, Mumbai).',
        '- **Current Status**: **In Review** (Application ID: EX-BRL-2026-088, Superintendent of State Excise, Pune).',
        '- **Statutory Scope**: Permits commercial brewing, packaging into glass bottles (330ml, 500ml, 650ml), aluminum cans, and stainless kegs for wholesale distribution.',
        '- **Key Operational Conditions**:',
        '  - Stationing of a dedicated **State Excise Sub-Inspector (SI)** at the brewery premises 24/7.',
        '  - Double-lock bonded finished goods warehouse (one key held by State Excise, one by licensee).',
        '  - Calibrated mass flow meters on brewing kettles and packaging lines.',
        '- **Licence Fee**: ₹1,00,000 annual licence fee + ₹50,000 security deposit.',
      ].join('\n'),
      spokenText: 'Your State Excise Brewery Licence Form BRL-001 is currently in review. It authorizes commercial brewing and bottling with a dedicated Excise Sub-Inspector stationed at the brewery, an annual fee of one lakh rupees, and a fifty thousand rupee deposit.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Check Excise Status' }],
    };
  }

  // 10. Excise Brand & Label Registration
  if (/label\b|brand\b|label registration|brand registration|brand approval|hologram|excise sticker|qr code|packaging label/.test(q)) {
    return {
      reply: [
        '### 🏷️ Excise Brand & Label Registration Protocol',
        '',
        '- **Competent Authority**: Commissioner of State Excise, Maharashtra State.',
        '- **Prerequisite**: Gated by primary Brewery Licence (BRL-001).',
        '- **Testing & Validation**:',
        '  - Chemical analysis certificate from State Excise Chemical Laboratory (Vakola, Mumbai) verifying Alcohol by Volume (ABV), real extract, and total acidity.',
        '- **Mandatory Label Declarations**:',
        '  1. Statutory Warning: *"CONSUMPTION OF ALCOHOL IS INJURIOUS TO HEALTH / BE SAFE-DONT DRINK AND DRIVE"* in English and Marathi.',
        '  2. High-security excise track-and-trace hologram / QR code on crown caps or can lids.',
        '  3. Declared Maximum Retail Price (MRP) and batch identification code.',
        '- **Annual Brand Registration Fee**: ₹25,000 per brand variant.',
      ].join('\n'),
      spokenText: 'Brand and label registration is gated by your brewery licence. It requires chemical verification from the State Excise Laboratory in Vakola, statutory health warnings in English and Marathi, excise security holograms, and a twenty-five thousand rupee fee per variant.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View Label Dependencies' }],
    };
  }

  // 11. Retail Distribution, On-Premise Sales, Wine Shops & Restaurants
  if (/retail|sell|selling|wine shop|restaurant|permit room|bar\b|can i sell|customer|direct sale|counter sale|distributor|wholesale|keg|can I distribute/.test(q)) {
    return {
      reply: [
        '### 🚚 Commercial Distribution & Retail Sales Regulations',
        '',
        '- **Factory Gate Over-The-Counter Sales**: ❌ **Strictly Prohibited**. As a commercial production brewery (Form BRL-001), you cannot sell beer directly across the counter to retail consumers (that privilege is reserved for brewpub restaurants under Form BRL-II).',
        '- **Permitted Wholesale Channels**:',
        '  1. **FL-II Licensed Retail Wine Shops**: Bottled and canned craft beer packaged in 330ml, 500ml, and 650ml SKUs.',
        '  2. **FL-III Licensed Restaurants, Hotels & Permit Rooms**: Bottled beer and 20L/30L/50L stainless steel draft kegs.',
        '  3. **Licensed Wholesale Distributors**: Bulk distribution throughout Maharashtra.',
        '- **Transport Protocol**: Every dispatch from the bonded warehouse must carry an **Excise Transport Pass (Form FL-I pass)** generated through the State Excise online portal.',
      ].join('\n'),
      spokenText: 'Under your commercial brewery licence, you cannot sell directly to retail customers over the counter at the factory gate. You can sell at wholesale to licensed wine shops, hotels, and permit rooms across Maharashtra using State Excise transport passes.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View Excise Approvals' }],
    };
  }

  // 12. Brewpub vs Commercial Production Brewery
  if (/brewpub|microbrewery|commercial brewery|difference between brewpub|on-premise|on premise/.test(q)) {
    return {
      reply: [
        '### ⚖️ Brewpub (BRL-II) vs Commercial Production Brewery (BRL-001)',
        '',
        '| Parameter | Brewpub (Form BRL-II) | Commercial Brewery (Form BRL-001, Pune Craft Brewery) |',
        '|---|---|---|',
        '| **Primary Scope** | On-premise draft beer served to restaurant diners | Production brewing, packaging in bottles/cans/kegs for wholesale |',
        '| **Capacity Cap** | Max 500,000 Litres/Year (under 5,000L/day) | Uncapped industrial production scaled to installed equipment |',
        '| **Packaging** | Draft dispensing into glasses/growlers only | Automated bottling line (330/500/650ml), canning, and commercial kegging |',
        '| **Retail Distribution**| On-site restaurant patrons only | Statewide distribution to FL-II shops, FL-III bars, and distributors |',
        '| **Location Zoning** | Commercial restaurants, malls, high streets | Pre-approved industrial zone (MIDC Chakan Phase II) |',
      ].join('\n'),
      spokenText: 'Pune Craft Brewery is a commercial production brewery under Form BRL-001, not a brewpub. This enables industrial packaging into bottles, cans, and kegs for statewide wholesale distribution, whereas brewpubs are restricted to on-premise restaurant dispensing.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'profile', label: 'View Profile' }],
    };
  }

  // 13. Interstate Shipments & Export
  if (/interstate|other states|export|goa|karnataka|delhi|mumbai|transport permit|outside maharashtra|transit pass|fl-1|fl-i/.test(q)) {
    return {
      reply: [
        '### 🌐 Interstate Sales & International Export Compliance',
        '',
        '- **Sales to Other Indian States (e.g. Goa, Karnataka, Delhi)**:',
        '  1. Obtain **Export NOC** from Maharashtra State Excise.',
        '  2. Consignee must secure an **Import Permit** from the receiving state excise department.',
        '  3. Register brand labels with the receiving state excise authority.',
        '  4. Shipments move under excise bond with digital transit passes.',
        '- **International Exports**:',
        '  - Requires Importer-Exporter Code (IEC) from DGFT.',
        '  - Zero State Excise Duty applies to exported alcoholic beverages shipped under Customs Bond.',
        '  - Earns foreign exchange credits toward fulfilling your **EPCG 6x export obligation**.',
      ].join('\n'),
      spokenText: 'Interstate beer sales require an Export NOC from Maharashtra and an Import Permit from the receiving state. International exports are exempt from state excise duty under bond and count toward your EPCG export obligations.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'Check EPCG Terms' }],
    };
  }

  // 14. Excise Duty Rates & Calculation
  if (/excise duty|duty rate|how much excise|tax per bottle|alcohol tax|excise slab/.test(q)) {
    return {
      reply: [
        '### 💰 Maharashtra State Excise Duty Slabs on Beer',
        '',
        '- **Mild Beer (Alcohol By Volume $\\le 5.0\\%$)**:',
        '  - Excise Duty: **₹115 per bulk litre** (or approximately ₹74.75 per 650ml bottle), calculated against the manufacturing cost slab.',
        '- **Strong Beer (Alcohol By Volume $> 5.0\\%$ up to $8.0\\%$)**:',
        '  - Excise Duty: **₹175 per bulk litre** (or 100% of manufacturing cost, whichever is higher, ~₹113.75 per 650ml bottle).',
        '- **Assessment & Payment**:',
        '  - Assessed by the resident Excise Sub-Inspector before release from the bonded warehouse.',
        '  - Remitted online through the Maharashtra Government Receipt Accounting System (GRAS).',
      ].join('\n'),
      spokenText: 'In Maharashtra, State Excise duty is approximately 115 rupees per bulk litre for mild beer under 5% ABV, and 175 rupees per bulk litre or 100% of manufacturing cost for strong beer up to 8% ABV.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'time-cost', label: 'View Cost Model' }],
    };
  }

  // 15. DISH Factory Building Plan Approval (Rule 3)
  if (/dish.*plan|building plan|factory plan|rule 3|headroom|gangway|dish.*approval/.test(q)) {
    return {
      reply: [
        '### 📐 DISH Factory Building Plan Approval (Rule 3)',
        '',
        '- **Competent Authority**: Directorate of Industrial Safety & Health (DISH), Maharashtra, Pune Regional Office.',
        '- **Governing Law**: Section 6 of Factories Act, 1948 and Rule 3 of Maharashtra Factories Rules, 1963.',
        '- **Status**: **Ready for Immediate Submission** (Application ID: DISH-PLN-2026-041).',
        '- **RTS SLA**: **30 working days**.',
        '- **Architectural Compliance Checklist**:',
        '  - Minimum headroom of **4.2 meters** in brewing and bottling halls.',
        '  - Gangways and circulation corridors minimum **1.5 meters** wide, marked with yellow epoxy floor lines.',
        '  - Emergency exit doors opening outwards with panic hardware, leading to unobstructed assembly points.',
        '  - Lighting levels minimum 150 lux in processing areas and 300 lux on bottling inspection stations.',
        '- **Statutory Fee**: ₹15,000.',
      ].join('\n'),
      spokenText: 'DISH Factory Building Plan Approval is ready for filing under Rule 3 with a 30 working day SLA. It requires 4.2 meter headroom, 1.5 meter gangways, outward opening emergency doors, and fifteen thousand rupees in statutory fees.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Submit DISH Plan' }],
    };
  }

  // 16. DISH Factory Operational Licence (Section 6/7)
  if (/dish.*licen[sc]e|factory licen[sc]e|factory license|operational licen[sc]e|factories act/.test(q)) {
    return {
      reply: [
        '### ⚙️ DISH Factory Operational Licence (Section 6 & 7)',
        '',
        '- **Competent Authority**: Joint Director of Industrial Safety & Health, Pune Division.',
        '- **Prerequisite**: Gated by **DISH Building Plan Approval** and physical erection of plant & machinery.',
        '- **RTS SLA**: **30 working days**.',
        '- **Parameters**: 25 workers, 150 HP connected electrical load.',
        '- **Mandatory Compliances**:',
        '  - Appointment of qualified first-aiders on every shift.',
        '  - Statutory registers: Form 1 Inspection Book, Form 7 Health Register, Form 11 Overtime Register.',
        '  - CA-certified machinery valuation certificate and machine guarding certificates.',
      ].join('\n'),
      spokenText: 'The DISH Factory Operational Licence is gated by your building plan approval and machinery installation. It covers 25 workers and 150 HP connected load under a 30 working day SLA.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View DISH Milestones' }],
    };
  }

  // 17. Fire Safety Clearances (Provisional vs Final Fire NOC)
  if (/fire|fire noc|provisional fire|final fire|hydrant|sprinkler|midc fire|fire station chakan/.test(q)) {
    return {
      reply: [
        '### 🚒 Fire Safety Clearances (Provisional & Final Fire NOC)',
        '',
        '- **Competent Authority**: MIDC Fire Services, Chakan Fire Station / Chief Fire Officer MIDC.',
        '- **Provisional Fire NOC**:',
        '  - Status: **Ready for Immediate Submission** (App ID: MIDC-FNOC-2026-019).',
        '  - RTS SLA: **15 working days** | Statutory Fee: ₹25,000.',
        '  - Approves building fire prevention schematics: 6-meter all-around fire tender peripheral road, 50,000L underground static water tank, yard hydrants, and sprinkler layout.',
        '- **Final Fire NOC**:',
        '  - Gated by physical building completion and submission of **Form A/B certificate** from an empanelled Licensed Fire Agency after hydro-testing hydrants.',
      ].join('\n'),
      spokenText: 'Provisional Fire NOC from MIDC Fire Services is ready for submission with a 15 working day SLA and twenty-five thousand rupee fee. Final Fire NOC is issued post-construction following hydro-testing of hydrants and sprinkler lines.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Submit Provisional Fire' }],
    };
  }

  // 18. FSSAI Central License for Alcoholic Beverages
  if (/fssai|food safety|food licen[sc]e|food authority|potable water test|is 10500|shelf life|fsms|haccp/.test(q)) {
    return {
      reply: [
        '### 🛡️ FSSAI Central License for Alcoholic Beverages',
        '',
        '- **Competent Authority**: Food Safety and Standards Authority of India (FSSAI), Western Regional Office, Mumbai.',
        '- **Licence Class**: **Central License** (manufacturing capacity > 2 kl/day requires Central licensing under Schedule 1).',
        '- **Governing Regulations**: Food Safety and Standards (Alcoholic Beverages) Regulations, 2018.',
        '- **Critical Mandates**:',
        '  1. **IS 10500:2012 Water Potability Certificate**: Tested for microbiological purity, heavy metals (Lead < 0.2 ppm, Arsenic < 0.25 ppm), and mineral hardness.',
        '  2. **FSMS Plan**: Food Safety Management System plan and HACCP protocols.',
        '  3. Retention of batch brew sheets and retention samples for the full declared shelf life.',
        '- **Statutory Fee**: ₹7,500 annual fee.',
      ].join('\n'),
      spokenText: 'FSSAI Central Licensing is mandatory for alcoholic beverage manufacturing over 2 kilolitres per day. It requires IS 10500 water testing, a Food Safety Management System, and a seven thousand five hundred rupee annual fee.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View FSSAI Clearance' }],
    };
  }

  // 19. Legal Metrology Packaged Commodities (LMPC) Rule 27
  if (/legal metrology|lmpc|rule 27|packaged commodities|weights and measures|bottle declaration|mrp|330ml|500ml|650ml/.test(q)) {
    return {
      reply: [
        '### ⚖️ Legal Metrology Packaged Commodities (LMPC) Rule 27',
        '',
        '- **Competent Authority**: Controller of Legal Metrology, Maharashtra State.',
        '- **Governing Law**: Rule 27 of Legal Metrology (Packaged Commodities) Rules, 2011.',
        '- **Mandatory Label Declarations**:',
        '  1. Generic Name: *"Craft Beer"* or *"Beer"* with Alcohol by Volume (% ABV) in font size $\\ge 4$ mm.',
        '  2. Net Quantity in standard SI units: **330 ml**, **500 ml**, or **650 ml**.',
        '  3. Maximum Retail Price (MRP) in ₹ inclusive of all taxes.',
        '  4. Month and Year of packaging and "Best Before" date.',
        '  5. Name, address, and consumer care email/phone of manufacturer.',
        '- Calibrated electronic flow meters and checkweighers on bottling conveyor belts.',
      ].join('\n'),
      spokenText: 'Legal Metrology Rule 27 mandates standard bottle sizes of 330ml, 500ml, or 650ml, clear MRP declarations inclusive of taxes, ABV percentage with at least 4 millimeter font, and consumer care contact details.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Check LMPC Status' }],
    };
  }

  // 20. Water Infrastructure, Consumption & MIDC Pipeline
  if (/water|water supply|midc water|water requirement|water consumption|litres of water|ro plant|borewell|potable water/.test(q)) {
    return {
      reply: [
        '### 💧 Water Sourcing, Consumption & Treatment (MIDC Chakan)',
        '',
        '- **Brewing Water Ratio**: Typically 4:1 to 5:1 litres of water per litre of finished beer.',
        '- **Total Daily Industrial Consumption**: **20 to 30 KLD** (brewing liquor, vessel CIP washing, boiler feed, cooling tower make-up).',
        '- **Sourcing**: Piped industrial water supply line from MIDC Chakan water works (50mm connection with ultrasonic telemetry flow meter).',
        '- **Water Treatment Plant (WTP)**: Raw MIDC water is passed through Multi-Grade Sand Filter + Activated Carbon Filter + RO / Softening to adjust calcium/sulfate brewing ions and satisfy **IS 10500** standards.',
      ].join('\n'),
      spokenText: 'Pune Craft Brewery requires 20 to 30 KLD of water sourced from the MIDC Chakan piped supply. The incoming water must be treated through sand, carbon, and reverse osmosis filtration to ensure IS 10500 potability standards.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'vault', label: 'View Water Schematics' }],
    };
  }

  // 21. Electrical Power Load & MSEDCL Connection
  if (/power|electricity|msedcl|connected load|transformer|kva|feeder|substation|dg set|power supply/.test(q)) {
    return {
      reply: [
        '### ⚡ Electrical Power & MSEDCL Infrastructure',
        '',
        '- **Sanctioned Connected Load**: **150 kVA** High Tension (HT) connection on 11 kV/22 kV feeder from MSEDCL Chakan industrial substation.',
        '- **Transformer**: 200 kVA step-down indoor transformer (11 kV to 415 V, 3-phase, 50 Hz).',
        '- **Statutory Approval**: Electrical installation drawings approved by Chief Electrical Inspector (CEI), Pune Division.',
        '- **Backup Power**: 125 kVA silent diesel generator set with CPCB-approved acoustic canopy and elevated exhaust stack.',
      ].join('\n'),
      spokenText: 'Your brewery requires a 150 kVA High Tension power connection from MSEDCL Chakan with an indoor step-down transformer approved by the Chief Electrical Inspector, backed by a 125 kVA silent generator.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'vault', label: 'View Electrical SLD' }],
    };
  }

  // 22. Steam Boilers & Indian Boiler Regulations (IBR)
  if (/boiler|steam|ibr|pressure vessel|steam generator|kettle heating|mash tun heating/.test(q)) {
    return {
      reply: [
        '### ♨️ Process Steam, Boilers & Pressure Vessels',
        '',
        '- **Process Role**: Steam heating is required for mash conversion, wort boiling in the copper kettle, and hot CIP sanitization.',
        '- **IBR Exemption Threshold**: A packaged steam generator with a water capacity **under 25 litres** and operating pressure **below 3.5 kg/cm²** qualifies as **Non-IBR**, exempting you from full-time certified boiler attendant mandates.',
        '- **Standard IBR Boilers**: Units exceeding 25 litres require registration with the Directorate of Steam Boilers, Maharashtra, annual hydraulic pressure testing, and certified steam pipeline drawings.',
      ].join('\n'),
      spokenText: 'Brewing process steam is required for mashing and boiling. Selecting a packaged steam generator under 25 litres water capacity operates under Non-IBR rules, avoiding full-time certified boiler attendant mandates.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'View Boiler Approvals' }],
    };
  }

  // 23. Maharashtra Right to Services (RTS) Act 2015 & Deemed Approval
  if (/rts|right to service|right to services|deemed approval|automatic approval|sla guarantee|day 46|officer delay/.test(q)) {
    return {
      reply: [
        '### ⚖️ Maharashtra Right to Services (RTS) Act 2015 & Deemed Approvals',
        '',
        '- **Statutory Legal Guarantee**: All 10 clearances for Pune Craft Brewery are notified public services under the Maharashtra RTS Act 2015 with binding statutory SLAs (e.g., Fire 15 days, DISH 30 days, MPCB 45 days).',
        '- **Deemed Approval Clause (Section 9)**:',
        '  - If a competent authority fails to either grant approval or raise a reasoned written query within the notified SLA, **the clearance is legally deemed approved**.',
        '  - The MAITRI portal automatically generates a digitally signed Deemed Approval Certificate carrying full evidentiary force.',
        '- **Protection against Rejection**: Officers cannot reject applications without written statutory cause.',
      ].join('\n'),
      spokenText: 'Under the Maharashtra Right to Services Act 2015, all your clearances have binding statutory SLAs. If an officer fails to act within the SLA, Section 9 triggers automatic deemed approval with a valid digital certificate.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'time-cost', label: 'View RTS SLAs' }],
    };
  }

  // 24. Officer Delay Penalties & Grievance Redressal
  if (/delay penalty|officer not responding|officer fine|grievance|complain|fine officer|punish officer|harassment/.test(q)) {
    return {
      reply: [
        '### 🚨 Officer Delay Penalties & Grievance Redressal',
        '',
        '- **Statutory Financial Fines (Section 10 of RTS Act)**:',
        '  - Appellate authorities are legally empowered to impose personal fines of **₹250 to ₹5,000 per day of delay (up to ₹25,000 maximum)** deducted directly from the defaulting officer\'s monthly salary.',
        '- **Administrative Sanctions**: Willful delays or frivolous queries trigger adverse entries in the officer\'s Annual Confidential Report (ACR) and departmental inquiry.',
        '- **Escalation Mechanism**: File an instant digital grievance on the MAITRI Grievance Desk for auto-escalation to the Industries Commissioner.',
      ].join('\n'),
      spokenText: 'Section 10 of the RTS Act empowers appellate bodies to fine defaulting government officers up to twenty-five thousand rupees, deducted directly from their salary for unjustified clearance delays.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Grievance Desk' }],
    };
  }

  // 25. 3-Tier Appeals Hierarchy
  if (/appeal|first appellate|second appellate|appellate authority|rejected|rejection|license rejected|tribunal|ombudsman/.test(q)) {
    return {
      reply: [
        '### 🏛️ 3-Tier Statutory RTS Appeals Hierarchy',
        '',
        '1. **First Appellate Authority (FAA)**: File an appeal within **30 days** of an unjustified rejection or SLA breach to the Joint Director / Superintending Engineer of the respective department. Must be disposed of within 30 days.',
        '2. **Second Appellate Authority (SAA)**: If FAA fails to grant relief, appeal within **30 days** to the Secretary of Industries / Divisional Commissioner.',
        '3. **Maharashtra State Right to Services Commission**: Final appeal before the Chief Commissioner of RTS. Has full powers of a Civil Court to summon officers, enforce deemed approvals, and award compensation.',
      ].join('\n'),
      spokenText: 'If a clearance is delayed or rejected, you have a 3-tier appeal right under the RTS Act: First Appeal to the Joint Director, Second Appeal to the Secretary of Industries, and Final Appeal to the Chief RTS Commissioner.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'File Appeal' }],
    };
  }

  // 26. CGTMSE Collateral-Free Credit Guarantee
  if (/cgtmse|collateral|credit guarantee|bank loan|loan|term loan|working capital|sidbi|sbi loan/.test(q)) {
    return {
      reply: [
        '### 🏦 CGTMSE Collateral-Free Credit Guarantee (Up to ₹5.00 Crore)',
        '',
        '- **Guarantee Amount**: Up to **₹5.00 Crore** term loan and working capital credit facility.',
        '- **Sovereign Guarantee Cover**: **85% guarantee** provided by CGTMSE (Ministry of MSME and SIDBI).',
        '- **Zero Collateral Requirement**: No mortgage on personal residential property or third-party guarantees required. Primary security is placed solely on factory equipment and inventory.',
        '- **Interest Rate Discount**: 1% to 1.5% interest concession under MSME Priority Sector Lending.',
        '- **Partner Lenders**: State Bank of India, Bank of Baroda, HDFC Bank, ICICI Bank, SIDBI.',
      ].join('\n'),
      spokenText: 'Your enterprise qualifies for up to ₹5.00 Crore in collateral-free bank loans under CGTMSE with an 85% sovereign guarantee cover, eliminating the need to mortgage personal immovable property.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'Explore CGTMSE' }],
    };
  }

  // 27. EPCG 0% Customs Duty Capital Goods Import
  if (/epcg|customs|customs duty|import duty|import machinery|zero duty|fermenter import|brewhouse import|dgft/.test(q)) {
    return {
      reply: [
        '### 🚢 EPCG 0% Customs Duty Machinery Import Scheme',
        '',
        '- **Core Benefit**: Import high-efficiency brewing kettles, conical fermenters, bright tanks, and bottling lines at **0% basic customs duty** (normally 27.5% combined tariff).',
        '- **Export Obligation**: Commit to an export obligation equivalent to **6 times the customs duty saved** over a 6-year period.',
        '- **Fulfillment Modes**: Direct beer exports to foreign markets, or supplies to duty-free bonded stores and foreign embassies.',
        '- **Procedure**: Obtain Importer-Exporter Code (IEC) from DGFT and file online before equipment bill of lading.',
      ].join('\n'),
      spokenText: 'The EPCG scheme allows you to import advanced brewing equipment at 0% customs duty instead of 27.5%, with an obligation to export six times the duty saved over six years.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'View EPCG Details' }],
    };
  }

  // 28. Maharashtra PSI 2019 & Annexure II Negative List
  if (/psi|psi 2019|negative list|annexure ii|state subsidy|sgst refund|capital subsidy|why excluded|why no subsidy/.test(q)) {
    return {
      reply: [
        '### 📜 Maharashtra PSI 2019 & Negative List Explanation',
        '',
        '- **Policy Exclusion**: Under the **Maharashtra Package Scheme of Incentives (PSI 2019)**, potable alcohol, brewery, and distillery units are placed under the **Annexure II Negative List** (Item 4).',
        '- **Impact**: The state government denies direct SGST cash refunds and capital grants to liquor manufacturing units.',
        '- **What Stays 100% Accessible**: Central CGTMSE ₹5.00 Cr credit guarantees, EPCG 0% duty waivers, Section 80-IAC 3-year tax holidays, MSME ZED subsidies, and state electricity duty exemptions.',
      ].join('\n'),
      spokenText: 'Potable alcohol and breweries are categorized under Annexure II of Maharashtra PSI 2019, excluding them from state SGST cash grants. However, Central credit guarantees, customs duty waivers, and tax holidays remain fully available.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'View Eligible Schemes' }],
    };
  }

  // 29. Section 80-IAC Corporate Income Tax Holiday
  if (/80-iac|80iac|tax holiday|income tax|corporate tax|tax exemption|dpiit|startup tax/.test(q)) {
    return {
      reply: [
        '### 💸 Section 80-IAC 3-Year 100% Corporate Tax Holiday',
        '',
        '- **Statutory Relief**: **100% deduction of profits** for 3 consecutive financial years out of the first 10 years of incorporation.',
        '- **Eligibility Requirements**:',
        '  - Incorporated as a Private Limited Company or LLP on or after April 1, 2016.',
        '  - Certified as an innovative business by DPIIT (Startup India).',
        '  - Total annual turnover does not exceed ₹100 Crore.',
        '- **Application**: File Form-1 on Startup India portal for Inter-Ministerial Board (IMB) tax certification.',
      ].join('\n'),
      spokenText: 'Section 80-IAC provides a 100% corporate income tax holiday for 3 consecutive financial years for DPIIT-recognized startups, allowing pre-tax operating profits to fund plant expansion.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'Check 80-IAC Terms' }],
    };
  }

  // 30. MSME ZED Green Manufacturing Subsidy
  if (/zed|zero defect|green subsidy|iso|clean energy|energy audit|environmental subsidy/.test(q)) {
    return {
      reply: [
        '### 🌿 MSME ZED (Zero Defect Zero Effect) Green Subsidy',
        '',
        '- **Financial Benefit**: Up to **80% subsidy** on environmental audits, water conservation assessments, cleaner technology adoption, and quality certification costs.',
        '- **Tiers**: Bronze, Silver, Gold.',
        '- **Banking Bonus**: Securing ZED certification qualifies your enterprise for an **additional 0.5% interest rate discount** on term loans and working capital.',
      ].join('\n'),
      spokenText: 'The MSME ZED scheme provides up to an 80% subsidy on environmental and quality certifications, plus a 0.5% interest rate reduction from partner banks.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'Explore ZED Subsidy' }],
    };
  }

  // 31. GST Structure & Indirect Taxation on Beer
  if (/gst|tax on beer|mvat|vat|indirect tax|input tax credit|itc|tax structure/.test(q)) {
    return {
      reply: [
        '### 🧾 GST & Indirect Tax Structure for Craft Breweries',
        '',
        '- **Constitutional Position (Article 366(12A))**: Potable alcohol for human consumption is constitutionally excluded from GST and remains under **Maharashtra State Excise Duty + Maharashtra VAT (MVAT)**.',
        '- **Input Tax (GST)**: Malt, hops, glass bottles, cans, and brewing plant machinery incur **18% to 28% GST**.',
        '- **Input Tax Credit (ITC) Treatment**: Because finished beer is outside GST, **GST paid on inputs CANNOT be offset against State Excise or MVAT**. It becomes a direct cost of manufacturing.',
      ].join('\n'),
      spokenText: 'Beer is constitutionally outside GST and is taxed under Maharashtra State Excise and MVAT. GST paid on brewing ingredients and packaging cannot be offset against excise duties, forming part of your production cost.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'time-cost', label: 'Check Tax Forecast' }],
    };
  }

  // 32. Udyam MSME Registration & 45-Day Payment Protection
  if (/udyam|msme protection|samadhaan|45 days|payment delay|buyer payment|delayed payment|section 15/.test(q)) {
    return {
      reply: [
        '### 🛡️ Udyam Registration & 45-Day Payment Legal Protections',
        '',
        '- **Classification**: Small Enterprise under MSMED Act, 2006.',
        '- **Section 15 Mandatory Payment**: Buyers (hotel chains, distributors, retailers) are legally required to make payment within **45 days** of delivery.',
        '- **Section 16 Statutory Penalty**: Defaulting buyers must pay **compound interest with monthly rests at 3 times the RBI Bank Rate**.',
        '- **Dispute Resolution**: Fast-track summary arbitration through the MSME Samadhaan Facilitation Council in Pune without filing a civil suit.',
      ].join('\n'),
      spokenText: 'Under the MSMED Act, buyers are legally required to pay your registered brewery within 45 days. Delays incur statutory compound interest at three times the RBI bank rate, enforceable through MSME Samadhaan.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'schemes', label: 'View Udyam Benefits' }],
    };
  }

  // 33. Joint Site Inspection Protocol (MPCB + Fire Department)
  if (/inspection|joint inspection|auditor|site visit|who inspects|when inspection|inspection notice/.test(q)) {
    return {
      reply: [
        '### 🔍 Joint Site Inspection Protocol (MPCB + Fire Services)',
        '',
        '- **Ease of Doing Business Mandate**: Uncoordinated single-officer surprise visits are abolished under Maharashtra industrial reform guidelines.',
        '- **Synchronization**: MPCB Sub-Regional Officer and MIDC Fire Services conduct a **single synchronized Joint Inspection within 14 calendar days** of CTE submission.',
        '- **Advance Notice**: Applicant receives minimum **48 hours advance notice** via SMS and registered email.',
        '- **Report Submission**: Combined joint inspection report must be uploaded to the MAITRI portal within 48 hours of inspection.',
      ].join('\n'),
      spokenText: 'MPCB and MIDC Fire Services conduct a single synchronized Joint Site Inspection within 14 days of CTE submission, with 48 hours advance digital notice and a mandatory 48-hour report upload window.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'inspections', label: 'View Inspection Desk' }],
    };
  }

  // 34. MIDC Chakan Industrial Cluster & Location Details
  if (/chakan|midc chakan|location|industrial area|industrial zone|shed|phase 2|pune location/.test(q)) {
    return {
      reply: [
        '### 📍 MIDC Chakan Industrial Cluster (Phase II, Pune)',
        '',
        '- **Location**: Plot in MIDC Chakan Phase II, Taluka Khed, District Pune, Maharashtra.',
        '- **Facility**: 6,000 sq.ft. leased industrial shed within an approved industrial park.',
        '- **Cluster Advantages**:',
        '  - Industrial zoning pre-approved for Orange category manufacturing (no agricultural NA conversion needed).',
        '  - Direct connection to MIDC piped industrial water network and 22 kV industrial power substation.',
        '  - Seamless freight connectivity via Pune-Nashik Highway (NH-60) and Mumbai-Pune Expressway.',
      ].join('\n'),
      spokenText: 'Pune Craft Brewery is located in a 6,000 square foot shed in MIDC Chakan Phase II, Pune. The industrial park provides pre-approved industrial zoning, reliable water and power grids, and direct expressway logistics.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'profile', label: 'View Location Profile' }],
    };
  }

  // 35. Workforce, Working Hours & Maharashtra Factory Rules
  if (/workers|labour|labor|employee|shifts|working hours|safety officer|pf|esic|canteen|factory rules/.test(q)) {
    return {
      reply: [
        '### 👥 Workforce & Maharashtra Factory Rules Compliance',
        '',
        '- **Personnel**: 25 full-time staff (18 brewing & packaging operations, 7 administration & sales).',
        '- **Statutory Work Limits (Factories Act 1948)**:',
        '  - Maximum 48 working hours per week, 9 hours per day with a mandatory 30-minute rest interval.',
        '  - Overtime compensated at double the normal wage rate.',
        '- **Safety & Welfare Mandates**:',
        '  - First Aid box with certified first-aider on every operating shift.',
        '  - Statutory EPF and ESIC registration.',
        '  - Dedicated staff changing rooms, lockers, and emergency eye-wash stations near chemical storage.',
      ].join('\n'),
      spokenText: 'Your brewery employs 25 personnel governed by the Factories Act. Requirements include a maximum 48-hour work week, certified first-aiders on every shift, EPF and ESIC registrations, and emergency eye-wash facilities.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'profile', label: 'View Profile Staffing' }],
    };
  }

  // 36. Statutory Fee Schedule & Cost Forecast
  if (/cost|fee|budget|expense|charges|how much fee|statutory cost|government fee/.test(q)) {
    return {
      reply: [
        '### 💳 Official Government Fee Schedule Breakdown',
        '',
        '- **MPCB Consent to Establish (CTE)**: ₹50,000 – ₹75,000 (based on capital investment slab).',
        '- **State Excise Brewery Licence (BRL-001)**: ₹1,00,000 annual fee + ₹50,000 security deposit.',
        '- **Provisional Fire NOC**: ₹25,000.',
        '- **DISH Building Plan Approval**: ₹15,000.',
        '- **FSSAI Central License**: ₹7,500.',
        '- **Legal Metrology LMPC Registration**: ₹5,000.',
        '- **Total Projected Statutory Fees**: **₹1,85,000 to ₹2,40,000**.',
      ].join('\n'),
      spokenText: 'Projected official statutory government fees total ₹1,85,000 to ₹2,40,000. Key components include one lakh rupees for the Excise licence, fifty to seventy-five thousand for MPCB CTE, and twenty-five thousand for Fire NOC.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'time-cost', label: 'Open Cost Forecast' }],
    };
  }

  // 37. What is ApprovalIQ & Platform Overview
  if (/what is approvaliq|platform|how does.*work|about approvaliq|approvaliq overview/.test(q)) {
    return {
      reply: [
        '### 🚀 ApprovalIQ — Industrial Clearance Intelligence Platform',
        '',
        'ApprovalIQ transforms complex Indian industrial compliance into a clear, predictable workflow:',
        '- **Dynamic Clearances DAG**: Automatically maps prerequisite dependencies across MPCB, State Excise, DISH, Fire Services, and FSSAI.',
        '- **Statutory RTS SLA Tracking**: Tracks government deadlines under the Maharashtra Right to Services Act with deemed approval alerts.',
        '- **Fiscal Scheme Matching**: Matches eligible central/state subsidies (CGTMSE ₹5 Cr, EPCG 0%, Section 80-IAC).',
        '- **Approve Voice Copilot**: Intelligent grounded voice and chat copilot with full case visibility.',
      ].join('\n'),
      spokenText: 'ApprovalIQ is India\'s industrial single-window clearance intelligence platform. We map statutory approvals, enforce Maharashtra Right to Services SLAs, match eligible government subsidies, and guide you every step through your compliance roadmap.',
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Explore Roadmap' }],
    };
  }

  // 38. Dynamic Contextual Reasoning Synthesizer (The Ultimate Anti-Generic Fallback)
  return synthesizeDynamicReasoning(message, _projectId);
}

/**
 * Public client-side assistant entry point. Attempts live LLM call if configured,
 * otherwise provides deep statutory synthesis.
 */
export async function generateApproveClientAnswer(
  message: string,
  _projectId: string = DEMO_PROJECT_ID,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
): Promise<AssistantChatResponse> {
  const liveResult = await tryLiveLlmAnswer(message, history);
  if (liveResult) return liveResult;

  return synthesizeStatutoryAnswer(message, _projectId);
}

export function getOfflineAssistantChat(
  projectId: string,
  message: string,
): Promise<AssistantChatResponse> | AssistantChatResponse {
  return generateApproveClientAnswer(message, projectId);
}

export function getOfflineGeneralChat(message: string): Promise<AssistantChatResponse> | AssistantChatResponse {
  return generateApproveClientAnswer(message, DEMO_PROJECT_ID);
}

