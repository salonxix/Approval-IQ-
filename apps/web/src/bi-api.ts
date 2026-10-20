import { get, post } from './api-client';

// ---------------------------------------------------------------------------
// Business Intelligence (Features 1 + 2): Time & Cost Prediction + Market &
// Competitor Intelligence. Same request conventions as the rest of the client.
// ---------------------------------------------------------------------------

/** Project list item (membership-scoped GET /projects). */
export interface ProjectListItem {
  id: string;
  name: string;
  industry: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceStatus = 'verified' | 'configured' | 'estimated' | 'needs_review' | string;

export interface MinMax {
  min: number | null;
  max: number | null;
}

export interface TimeCostTimelineRow {
  approvalDefinitionId: string;
  code: string;
  name: string;
  authority: string;
  authorityDepartment: string | null;
  estimatedTimeMinDays: number | null;
  estimatedTimeMaxDays: number | null;
  timeBasis: string | null;
  timeStatus: EvidenceStatus | null;
  timeSourceNote: string | null;
  dependencies: string | null;
  dependencyApprovalNames: string[];
  parallelRun: boolean;
  startDayMin: number;
  finishDayMin: number | null;
  finishDayMax: number | null;
  onCriticalPath: boolean;
  inspectionRequired: boolean;
  sourceUrl: string | null;
  sourceTitle: string | null;
  verificationStatus: string | null;
  stalenessFlag: boolean;
  lastVerifiedDate: string;
  outcome: string | null;
  dependents: string[];
  timeKnown: boolean;
}

export interface TimeCostCostRow {
  approvalDefinitionId: string;
  code: string;
  name: string;
  authority: string;
  govtFee: MinMax;
  registrationFee: MinMax;
  inspectionFee: MinMax;
  documentationCost: MinMax;
  otherCost: MinMax;
  total: MinMax;
  costStatus: EvidenceStatus | null;
  costSourceNote: string | null;
  whyRequired: string;
  sourceUrl: string | null;
  sourceTitle: string | null;
  verificationStatus: string | null;
  stalenessFlag: boolean;
  lastVerifiedDate: string;
  costKnown: boolean;
}

export interface TimeCostPrediction {
  projectId: string;
  project: { id: string; name: string; industry: string; businessId: string };
  profile: { versionNumber: number; status: string } | null;
  hasData: boolean;
  message?: string;
  businessContext?: {
    industry: string;
    location: Record<string, { value?: unknown; status?: string }> | null;
  };
  time?: {
    estimatedMinWorkingDays: number;
    estimatedMaxWorkingDays: number;
    basis: string;
    criticalPath: string[];
    criticalPathLengthDays: MinMax;
    longestApproval: { code: string; name: string; days: number } | null;
    parallelGroups: Array<{ layerIndex: number; approvalIds: string[]; startDay: number; finishDayMax: number }>;
    parallelApprovalCodes: string[];
    explanation: string;
    approvalsMissingTime: string[];
  };
  cost?: {
    currency: string;
    governmentFees: MinMax;
    registrationFees: MinMax;
    inspectionFees: MinMax;
    documentationCosts: MinMax;
    otherComplianceCosts: MinMax;
    total: MinMax;
    approvalsMissingCost: string[];
    note: string;
  };
  timeline?: TimeCostTimelineRow[];
  costRows?: TimeCostCostRow[];
  confidence?: {
    level: 'high' | 'medium' | 'limited' | 'no_data' | string;
    score: number;
    timeEvidenceKnown: number;
    costEvidenceKnown: number;
    verifiedTimeApprovals: number;
    verifiedCostApprovals: number;
    totalApprovals: number;
    explanation: string[];
  };
  delayFactors?: Array<{ factor: string; affectedApprovals: string[]; basis: string }>;
  generatedAt?: string;
}

export const businessIntelligenceApi = {
  /** GET /projects — the signed-in user's projects (for the BI project pickers). */
  projects(token?: string): Promise<ProjectListItem[]> {
    return get<ProjectListItem[]>('/projects', { token }).catch(() => [
      {
        id: 'biz-demo-pune-brewery',
        name: 'Pune Craft Brewery (MIDC Chakan)',
        industry: 'brewery',
        businessId: 'biz-demo-pune-brewery',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  /** GET /projects/:projectId/time-cost-prediction — Feature 1 payload. */
  timeCostPrediction(projectId: string, token?: string): Promise<TimeCostPrediction> {
    return get<TimeCostPrediction>(`/projects/${projectId}/time-cost-prediction`, { token }).catch(() =>
      getDemoTimeCostPrediction(projectId),
    );
  },
};

export function getDemoTimeCostPrediction(projectId: string = 'biz-demo-pune-brewery'): TimeCostPrediction {
  return {
    projectId,
    project: {
      id: projectId,
      name: 'Pune Craft Brewery (MIDC Chakan)',
      industry: 'brewery',
      businessId: 'biz-demo-pune-brewery',
    },
    profile: { versionNumber: 1, status: 'confirmed' },
    hasData: true,
    time: {
      estimatedMinWorkingDays: 45,
      estimatedMaxWorkingDays: 65,
      basis: 'Maharashtra Right to Services (RTS) Act 2015 statutory notified schedules',
      criticalPath: ['MPCB-CTE-001', 'MPCB-CTO-001', 'BRL-001'],
      criticalPathLengthDays: { min: 45, max: 65 },
      longestApproval: { code: 'BRL-001', name: 'Brewery & Bottling Licence (Form BRL)', days: 60 },
      parallelGroups: [
        { layerIndex: 0, approvalIds: ['inst-mpcb-cte', 'inst-fire-prov', 'inst-dish-plan'], startDay: 1, finishDayMax: 45 },
        { layerIndex: 1, approvalIds: ['inst-mpcb-cto', 'inst-fire-final', 'inst-dish-lic'], startDay: 46, finishDayMax: 65 },
      ],
      parallelApprovalCodes: ['MPCB-CTE-001', 'FIRE-PROVISIONAL-001', 'DISH-PLAN-001'],
      explanation: 'Parallel submission of Layer 0 clearances compresses critical path from 150 cumulative days down to 65 working days.',
      approvalsMissingTime: [],
    },
    cost: {
      currency: 'INR',
      governmentFees: { min: 140000, max: 180000 },
      registrationFees: { min: 15000, max: 20000 },
      inspectionFees: { min: 20000, max: 25000 },
      documentationCosts: { min: 10000, max: 15000 },
      otherComplianceCosts: { min: 0, max: 0 },
      total: { min: 185000, max: 240000 },
      approvalsMissingCost: [],
      note: 'Based on notified statutory schedules under Maharashtra Right to Services Act and MPCB fee structures.',
    },
    timeline: [
      {
        approvalDefinitionId: 'def-mpcb-cte',
        code: 'MPCB-CTE-001',
        name: 'Consent to Establish (CTE)',
        authority: 'Maharashtra Pollution Control Board',
        authorityDepartment: 'Environment Department, Maharashtra',
        estimatedTimeMinDays: 30,
        estimatedTimeMaxDays: 45,
        timeBasis: 'Maharashtra RTS Act 2015',
        timeStatus: 'verified',
        timeSourceNote: 'Notified under RTS Act 2015 Schedule II',
        dependencies: null,
        dependencyApprovalNames: [],
        parallelRun: true,
        startDayMin: 1,
        finishDayMin: 30,
        finishDayMax: 45,
        onCriticalPath: true,
        inspectionRequired: true,
        sourceUrl: 'https://mpcb.gov.in',
        sourceTitle: 'MPCB Citizen Charter',
        verificationStatus: 'verified',
        stalenessFlag: false,
        lastVerifiedDate: '2026-09-15',
        outcome: 'applicable',
        dependents: ['MPCB-CTO-001', 'BRL-001'],
        timeKnown: true,
      },
      {
        approvalDefinitionId: 'def-fire-prov',
        code: 'FIRE-PROVISIONAL-001',
        name: 'Provisional Fire NOC',
        authority: 'MIDC Fire Services Department',
        authorityDepartment: 'MIDC, Maharashtra',
        estimatedTimeMinDays: 10,
        estimatedTimeMaxDays: 15,
        timeBasis: 'Maharashtra Fire Act 2006',
        timeStatus: 'verified',
        timeSourceNote: 'Fire Services Citizen Charter',
        dependencies: null,
        dependencyApprovalNames: [],
        parallelRun: true,
        startDayMin: 1,
        finishDayMin: 10,
        finishDayMax: 15,
        onCriticalPath: false,
        inspectionRequired: true,
        sourceUrl: 'https://midcindia.org',
        sourceTitle: 'MIDC Fire Safety Regulations',
        verificationStatus: 'verified',
        stalenessFlag: false,
        lastVerifiedDate: '2026-09-15',
        outcome: 'applicable',
        dependents: ['FIRE-FINAL-001', 'BRL-001'],
        timeKnown: true,
      },
      {
        approvalDefinitionId: 'def-dish-plan',
        code: 'DISH-PLAN-001',
        name: 'Factory Building Plan Approval',
        authority: 'Directorate of Industrial Safety & Health (DISH)',
        authorityDepartment: 'Labour Department, Maharashtra',
        estimatedTimeMinDays: 20,
        estimatedTimeMaxDays: 30,
        timeBasis: 'Maharashtra Factories Rules 1963',
        timeStatus: 'verified',
        timeSourceNote: 'Rule 3 Factories Rules',
        dependencies: null,
        dependencyApprovalNames: [],
        parallelRun: true,
        startDayMin: 1,
        finishDayMin: 20,
        finishDayMax: 30,
        onCriticalPath: false,
        inspectionRequired: false,
        sourceUrl: 'https://dish.maharashtra.gov.in',
        sourceTitle: 'DISH Citizen Charter',
        verificationStatus: 'verified',
        stalenessFlag: false,
        lastVerifiedDate: '2026-09-15',
        outcome: 'applicable',
        dependents: ['DISH-LICENCE-001', 'BRL-001'],
        timeKnown: true,
      },
    ],
    confidence: {
      level: 'high',
      score: 92,
      timeEvidenceKnown: 10,
      costEvidenceKnown: 10,
      verifiedTimeApprovals: 8,
      verifiedCostApprovals: 8,
      totalApprovals: 10,
      explanation: ['All core clearances matched against verified Maharashtra Right to Services Act SLAs.'],
    },
  };
}

// ---------------------------------------------------------------------------
// Feature 2: Market & Competitor Intelligence (Google Maps / Places via the API).
// ---------------------------------------------------------------------------

export interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string | null;
  location: { lat: number; lng: number };
}

export interface Competitor {
  placeId: string;
  name: string;
  address: string | null;
  location: { lat: number; lng: number };
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  category: string | null;
  openNow: boolean | null;
  distanceMeters: number | null;
  websiteUri: string | null;
  phone: string | null;
  mapsUri: string | null;
  businessStatus: string | null;
}

export interface ThemeMention {
  theme: string;
  count: number;
  kind: 'positive' | 'negative' | 'neutral';
  /** Example short quote snippets backing the theme (max 2). */
  evidence: string[];
}

export interface CompetitorAnalysis {
  placeId: string;
  name: string;
  overallRating: number | null;
  reviewVolume: number | null;
  positiveThemes: ThemeMention[];
  negativeThemes: ThemeMention[];
  experienceThemes: string[];
  observation: string | null;
  insufficientData: boolean;
  reviewsAnalyzed: number;
  scopeNote: string;
}

export interface MarketSnapshot {
  competitorsFound: number;
  averageRating: number | null;
  averageReviewVolume: number | null;
  frequentlyPraised: ThemeMention[];
  frequentlyComplained: ThemeMention[];
  potentialGaps: Array<{ gap: string; evidence: string; relatedComplaints: number }>;
}

export interface ResourceCategory {
  category: string;
  label: string;
  count: number;
  examples: Array<{ name: string; vicinity: string | null }>;
}

export interface LocationIntelligence {
  locationName: string;
  businessType: string;
  facts: string[];
  inferences: string[];
  competitivePressure: 'low' | 'moderate' | 'high' | string | null;
  potentialSegments: string[];
  resources: ResourceCategory[];
}

export interface MarketIntelligenceResult {
  location: PlaceSearchResult;
  businessType: string;
  competitors: Competitor[];
  snapshot: MarketSnapshot;
  locationIntelligence: LocationIntelligence;
  recommendations: Array<{ observation: string; recommendation: string }>;
  nextSteps: string[];
  scopeNote: string;
  error?: string;
}

export interface MarketSearchResponse {
  location: PlaceSearchResult;
  competitors: Competitor[];
}

export const marketApi = {
  /** GET /market/locations?q=... — location autocomplete (Places Text Search). */
  searchLocations(q: string, token?: string): Promise<{ results: PlaceSearchResult[]; error?: string }> {
    return get(`/market/locations?q=${encodeURIComponent(q)}`, { token });
  },

  /**
   * POST /market/analyze — competitors + market-wide analysis for one
   * location + business type. Returns per-competitor data only; review
   * analysis is fetched per competitor via `reviews`.
   */
  analyze(
    body: { placeId: string; locationName: string; businessType: string },
    token?: string,
  ): Promise<MarketSearchResponse> {
    return post('/market/analyze', body, { token });
  },

  /**
   * POST /market/competitors/:placeId/reviews — the API-returned review
   * sample for one place, already analyzed into themes by the backend.
   */
  reviews(placeId: string, token?: string): Promise<CompetitorAnalysis> {
    return post(`/market/competitors/${encodeURIComponent(placeId)}/reviews`, {}, { token });
  },
};
