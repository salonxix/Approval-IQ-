import type {
  RoadmapResponse,
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

import {
  type ProjectHistoryItem,
  type AiProjectDataset,
  STORAGE_PROJECTS_KEY,
  AI_DATASET_PREFIX,
  DEFAULT_DEMO_PROJECT,
  DEMO_PROJECT_ID,
  getStoredProjects,
  saveStoredProject,
  getStoredProjectById,
  generateAiProjectDataset,
  getAiProjectDataset,
  regenerateAiProjectDataset,
  getStateJurisdiction,
} from './ai-generator';

export {
  type ProjectHistoryItem,
  type AiProjectDataset,
  STORAGE_PROJECTS_KEY,
  AI_DATASET_PREFIX,
  DEFAULT_DEMO_PROJECT,
  DEMO_PROJECT_ID,
  getStoredProjects,
  saveStoredProject,
  getStoredProjectById,
  generateAiProjectDataset,
  getAiProjectDataset,
  regenerateAiProjectDataset,
  getStateJurisdiction,
};

// Dynamic in-memory status override map to let applicants interactively test status transitions
const demoStatusOverrides = new Map<string, ApprovalInstanceStatus>();

export function updateDemoInstanceStatus(
  instanceId: string,
  status: Exclude<ApprovalInstanceStatus, 'blocked'>,
  projectId: string = DEMO_PROJECT_ID,
): UpdateStatusResponse {
  demoStatusOverrides.set(instanceId, status);
  const roadmap = getDemoRoadmap(projectId);
  const node = roadmap.nodes.find((n) => n.id === instanceId) ?? roadmap.nodes[0]!;

  const unlockedDependentIds: string[] = [];
  if (status === 'done') {
    // Unblock dependent nodes based on roadmap edges
    const outgoing = roadmap.edges.filter((e) => e.fromInstanceId === instanceId && e.gates);
    for (const edge of outgoing) {
      if (edge.toInstanceId) {
        demoStatusOverrides.set(edge.toInstanceId, 'available');
        unlockedDependentIds.push(edge.toInstanceId);
      }
    }
  }

  return {
    ...node,
    status,
    unlockedDependentIds,
  };
}

export function getDemoRoadmap(projectId: string = DEMO_PROJECT_ID): RoadmapResponse {
  const dataset = getAiProjectDataset(projectId);
  const nodes = dataset.roadmap.nodes.map((n) => {
    const override = demoStatusOverrides.get(n.id);
    return override ? { ...n, status: override } : n;
  });

  return {
    ...dataset.roadmap,
    nodes,
  };
}

export function getDemoQuickOverview(projectId: string = DEMO_PROJECT_ID): QuickOverviewResponse {
  const dataset = getAiProjectDataset(projectId);
  return dataset.quickOverview;
}

export function getDemoAiSchemeAnalysis(projectId: string = DEMO_PROJECT_ID): AiSchemeAnalysisResponse {
  const dataset = getAiProjectDataset(projectId);
  return dataset.schemeAnalysis;
}

export function getDemoDocuments(projectId: string = DEMO_PROJECT_ID): Document[] {
  const dataset = getAiProjectDataset(projectId);
  return dataset.documents;
}

export function getDemoInspectionsCandidates(projectId: string = DEMO_PROJECT_ID): InspectionCandidatesResponse {
  const dataset = getAiProjectDataset(projectId);
  return dataset.inspectionCandidates;
}

export function getDemoJointInspections(projectId: string = DEMO_PROJECT_ID): JointInspectionView[] {
  const dataset = getAiProjectDataset(projectId);
  return dataset.jointInspections;
}

export function getDemoClarifications(projectId: string = DEMO_PROJECT_ID): ClarificationsInbox {
  return {
    projectId,
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

export function getDemoAiSchemeAdvisorAnswer(query: string, projectId: string = DEMO_PROJECT_ID): AiSchemeChatResponse {
  const dataset = getAiProjectDataset(projectId);
  const project = dataset.project;
  const q = query.toLowerCase();

  // 1. CGTMSE Collateral-Free Credit Guarantee
  if (/cgtmse|collateral|credit guarantee|loan|bank loan|debt|sidbi|term loan|financing/.test(q)) {
    return {
      query,
      answer: `Under the **Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)**, your **${project.name}** facility (${project.district}, ${project.state}) qualifies for up to **₹5.00 Crore** in collateral-free credit facilities. The trust provides an **85% sovereign guarantee cover** for MSME manufacturing units, allowing you to secure term loans for plant equipment and working capital limits without pledging personal residential property or third-party collateral.`,
      relevantSchemes: ['MSME-CGTMSE-001', 'MSME-UDYAM-001'],
      actionableSteps: [
        'Obtain Udyam MSME Registration Certificate for Manufacturing Enterprise classification',
        'Prepare Detailed Project Report (DPR) with 7-year DSCR financial projections (target DSCR >= 1.5)',
        `Submit loan dossier through nationalized partner banks (SBI, Bank of Baroda, HDFC, or SIDBI) under CGTMSE cover in ${project.district}`,
      ],
      confidenceScore: 0.98,
      sourceAttribution: 'Ministry of MSME & SIDBI CGTMSE Operational Guidelines 2026',
      timestamp: new Date().toISOString(),
    };
  }

  // 2. EPCG 0% Customs Duty Machinery Import
  if (/epcg|customs|import|duty|machinery|kettle|fermenter|brewhouse|bottling line|equipment/.test(q)) {
    return {
      query,
      answer: `The **EPCG (Export Promotion Capital Goods)** scheme allows **${project.name}** to import high-precision automated manufacturing equipment and processing plant components at **0% basic customs duty** (normally 27.5% combined tariff). In return, you commit to an export obligation equivalent to **6 times the customs duty saved** over a block of 6 years.`,
      relevantSchemes: ['DGFT-EPCG-001'],
      actionableSteps: [
        'Obtain Importer-Exporter Code (IEC) from DGFT portal',
        'Acquire Chartered Engineer Certificate certifying technical specifications of imported plant',
        'Submit online EPCG authorization application prior to equipment bill of lading',
      ],
      confidenceScore: 0.96,
      sourceAttribution: 'Directorate General of Foreign Trade (DGFT) Foreign Trade Policy',
      timestamp: new Date().toISOString(),
    };
  }

  // 3. State Industrial Policy & Subsidies
  if (/psi|maharashtra|negative list|subsidy|sgst|state grant|capital subsidy|incentive|aatmanirbhar|policy/.test(q)) {
    const isAlcohol = (project.industryKey || '').includes('brewery') || (project.industry || '').toLowerCase().includes('brewery');
    const isMaha = project.state.toLowerCase().includes('maharashtra');

    if (isAlcohol && isMaha) {
      return {
        query,
        answer: `Under the **Maharashtra Package Scheme of Incentives (PSI 2019)**, potable alcohol, beer brewing, and distillery units are categorized under the **Annexure II Negative List** (Item 4). Consequently, your unit is **excluded from direct state SGST cash reimbursement and capital cash grants**. However, **${project.name}** remains **100% eligible** for Central CGTMSE ₹5.00 Cr credit guarantees, EPCG 0% customs duty waivers, Section 80-IAC 3-year tax holidays, and state electricity duty exemptions.`,
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

    return {
      query,
      answer: `Under the **${project.state} Industrial Policy**, your **${project.name}** facility in **${project.district}** (${project.investmentFormatted || '₹25.00 Cr'} CapEx) qualifies as an eligible manufacturing enterprise. You are eligible for **100% net SGST reimbursement**, **statutory electricity duty exemptions for 5 to 7 years**, and stamp duty concessions on industrial land leases.`,
      relevantSchemes: [`STATE-IND-POLICY-${dataset.roadmap.nodes[0]?.authority?.code || 'SPCB'}`, 'MSME-CGTMSE-001'],
      actionableSteps: [
        `Register project on ${dataset.quickOverview.businessContext.location} single window portal`,
        'Obtain Udyam MSME Registration Certificate to claim power tariff concessions',
        'Submit Eligibility Certificate (EC) application with the District Industries Centre (DIC)',
      ],
      confidenceScore: 0.96,
      sourceAttribution: `${project.state} Industries Department Industrial Policy Guidelines`,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Section 80-IAC 3-Year Corporate Tax Holiday
  if (/80-iac|80iac|tax holiday|income tax|corporate tax|tax exemption|dpiit|startup/.test(q)) {
    return {
      query,
      answer: `Under **Section 80-IAC of the Income Tax Act**, eligible DPIIT-recognized startups can claim a **100% deduction of profits and gains for 3 consecutive financial years** out of the first 10 years of incorporation. For **${project.name}**, this allows you to shelter retained earnings from corporate income tax and reinvest operating cash flows directly into plant expansion and working capital.`,
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
      answer: `The **MSME ZED (Zero Defect Zero Effect)** certification scheme provides up to an **80% financial subsidy** on environmental audits, water conservation assessments, cleaner technology adoption, and quality certification costs. Achieving ZED Silver or Gold certification also unlocks an **additional 0.5% interest rate discount** on bank credit facilities.`,
      relevantSchemes: ['MSME-ZED-001', 'MSME-CGTMSE-001'],
      actionableSteps: [
        'Enrol on the MSME ZED portal using your Udyam registration number',
        'Conduct the initial online self-assessment for environmental and quality benchmarks',
        'Schedule accredited desktop and physical site verification during plant commissioning',
      ],
      confidenceScore: 0.94,
      sourceAttribution: 'Ministry of MSME ZED Sustainable Certification Guidelines',
      timestamp: new Date().toISOString(),
    };
  }

  // Dynamic Project-Aware Synthesizer for any other query
  return {
    query,
    answer: `For **${project.name}** (${project.investmentFormatted || '₹25.00 Cr'} CapEx in **${project.district}, ${project.state}**), your statutory financial optimization strategy leverages central credit guarantees and state industrial incentives: **₹5.00 Crore CGTMSE** collateral-free financing (85% sovereign guarantee), **0% EPCG customs duty** on capital goods, **Section 80-IAC** 3-year corporate income tax holidays, and **electricity duty exemptions** under ${project.state} Industrial Policy. These combined programs unlock over **₹75 Lakhs to ₹1.5 Crore in capital, power, and tax savings**.`,
    relevantSchemes: ['MSME-CGTMSE-001', 'DGFT-EPCG-001', 'STARTUP-80IAC-001', 'MSME-ZED-001', 'MSME-UDYAM-001'],
    actionableSteps: [
      'Maintain active Udyam Manufacturing Enterprise certification for bank credit and utility concessions',
      'Apply for EPCG 0% duty authorization prior to foreign equipment shipments',
      'Submit CGTMSE collateral-free loan dossier with audited 7-year DSCR financial model',
    ],
    confidenceScore: 0.95,
    sourceAttribution: 'ApprovalIQ Statutory Regulatory Knowledge Base & MSME Policy Framework',
    timestamp: new Date().toISOString(),
  };
}

async function tryLiveLlmAnswer(
  query: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  projectId: string = DEMO_PROJECT_ID,
): Promise<AssistantChatResponse | null> {
  if (typeof window === 'undefined') return null;
  const apiKey =
    localStorage.getItem('approvaliq_ai_api_key') ||
    localStorage.getItem('openrouter_api_key') ||
    localStorage.getItem('openai_api_key') ||
    (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_AI_API_KEY) ||
    '';

  if (!apiKey) return null;

  const project = getStoredProjectById(projectId);
  const dataset = getAiProjectDataset(projectId);
  const systemPrompt = `You are "Approve", the dedicated intelligent Voice Assistant and Statutory Compliance Copilot for ApprovalIQ (India's industrial single-window clearance intelligence platform).
The active facility is "${project.name}":
- Location: ${project.district}, ${project.state} (${project.areaSqft || 25000} sq.ft. industrial facility).
- Capital Outlay: ${project.investmentFormatted || "₹25.00 Crore"}, ${project.workforceCount || 80} full-time personnel.
- Industry: ${project.industry} (${dataset.cpcbCategory} Category under ${dataset.roadmap.nodes[0]?.authority?.name || "State SPCB"}).
- Statutory Clearances: ${dataset.roadmap.nodes.length} Total with RTS SLA deemed-approval protection.
- Fiscal Schemes: Eligible for ₹5.00 Cr CGTMSE collateral-free guarantee, 0% customs duty under EPCG, Section 80-IAC 3-year tax holiday, MSME ZED green subsidy, and ${project.state} Industrial Policy concessions.

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
function synthesizeDynamicReasoning(message: string, projectId: string = DEMO_PROJECT_ID): AssistantChatResponse {
  const project = getStoredProjectById(projectId);
  const dataset = getAiProjectDataset(projectId);
  const jurisdiction = getStateJurisdiction(project.state);
  const cleanQ = message.trim();
  const lower = cleanQ.toLowerCase();

  // Extract core domain concepts
  const tokens = lower
    .replace(/[?.,!/\\;:'"()[\]{}]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|what|how|why|can|will|should|with|about|tell|give|please|there|this|that|your|from|into|onto|have|does|when|where|which|who)$/.test(w));

  const subjectPhrase = tokens.slice(0, 4).join(' ') || 'statutory compliance';
  const topClearances = dataset.roadmap.nodes.slice(0, 3);
  const authorityNames = Array.from(new Set(topClearances.map(n => n.authority?.name).filter(Boolean))).join(', ') || jurisdiction.spcbName;

  return {
    reply: [
      `### ⚖️ Statutory & Compliance Assessment: ${cleanQ}`,
      '',
      `For your **${project.name}** facility (${project.district}, ${project.state}, ${project.investmentFormatted || "₹25.00 Cr"} CapEx, ${project.workforceCount || 80} employees, **${dataset.cpcbCategory} Category** under CPCB standards):`,
      '',
      `1. **Statutory Stance & Sector Feasibility**:`,
      `   - Establishing and operating this **${project.industry}** facility requires mandatory synchronized clearances across environmental control (**${jurisdiction.spcbName}**), industrial workplace safety (**${jurisdiction.dishName}**), and district industrial authorities.`,
      `   - Any technical specifications, machinery deployment, or process parameters relating to **"${subjectPhrase}"** must strictly align with your approved layout drawings and statutory filings submitted on **${jurisdiction.singleWindowPortal}**.`,
      '',
      `2. **Regulatory Authority & Binding SLAs**:`,
      `   - **Competent Regulatory Bodies**: ${authorityNames}, and **${jurisdiction.fireDeptName}**.`,
      `   - Statutory applications processed through **${jurisdiction.singleWindowPortal}** are protected by the **${jurisdiction.rtsActName}** with binding statutory SLA timelines and legal deemed-approval safeguards.`,
      '',
      `3. **Immediate Recommended Action Steps**:`,
      `   - 📋 Ensure technical equipment ratings, P&ID flows, and certified building layouts are uploaded to your **Document Vault**.`,
      `   - 🔄 Track and file statutory prerequisites through **${jurisdiction.singleWindowPortal}** to advance your clearance critical path.`,
      `   - 💼 Maximize eligible fiscal benefits including **₹5.00 Cr CGTMSE** collateral-free credit guarantees, **EPCG 0% customs duty**, and ${jurisdiction.electricityDutyYears}-year electricity duty waivers under **${jurisdiction.industrialPolicyName}**.`,
    ].join('\n'),
    spokenText: `Regarding ${subjectPhrase} for your ${project.name} in ${project.district}, ${project.state}, this falls under statutory state and environmental compliance. All technical specifications must align with your single window filings on ${jurisdiction.singleWindowPortal}, protected by ${jurisdiction.rtsActName} SLAs.`,
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
  const project = getStoredProjectById(_projectId);
  const dataset = getAiProjectDataset(_projectId);
  const jurisdiction = getStateJurisdiction(project.state);
  const q = message.toLowerCase();

  // 0. Conversational Greeting & System Capabilities
  if (/^(hi|hello|hey|help|greetings|good (morning|afternoon|evening)|can you help|how can you help|who are you|what can you do)\b/i.test(q)) {
    return {
      reply: [
        `### 👋 Hello! I'm Approve, your Statutory Compliance Copilot.`,
        '',
        `For **${project.name}** in ${project.district}, ${project.state}, I provide live, grounded regulatory intelligence across your clearances, documents, and subsidies:`,
        '',
        `- 📜 **Clearances & Roadmaps**: Ask *"What approvals do I need?"* or *"What is the critical path?"* to list your statutory permits, dependencies, and RTS SLAs.`,
        `- 📁 **Document Vault**: Ask *"What documents do I need?"* or *"Which documents are missing?"* to audit verified and missing paperwork.`,
        `- ⏱️ **Timeline & Prediction**: Ask *"How long will it take?"* to inspect the parallel clearance critical path.`,
        `- 💰 **Fiscal Subsidies**: Ask *"What schemes am I eligible for?"* for ₹5.00 Cr CGTMSE guarantees, EPCG 0% customs duty, and tax holidays.`,
        `- 🚨 **Immediate Next Steps**: Ask *"What is pending on my dashboard?"* to unblock today's filings.`,
      ].join('\n'),
      spokenText: `Hello! I'm Approve, your statutory compliance copilot. For your ${project.name}, I can list your required approvals, review missing documents in your vault, explain government schemes, or guide your immediate filings. What would you like to explore?`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
        { type: 'navigate', target: 'vault', label: 'Check Vault' },
        { type: 'navigate', target: 'schemes', label: 'Explore Schemes' },
      ],
    };
  }

  // 1. Comprehensive Approvals & Clearances Listing (The Primary Listing Intent)
  if (/\b(what.*(approval|clearance|licen[sc]e|permit)|list.*(approval|clearance|licen[sc]e|permit)|all.*(approval|clearance|licen[sc]e|permit)|which.*(approval|clearance|licen[sc]e|permit)|how many.*(approval|clearance|licen[sc]e|permit)|my approvals|statutory approvals|required approvals|clearance list|show.*(approval|clearance|licen[sc]e|permit))\b/i.test(q)) {
    const readyNodes = dataset.roadmap.nodes.filter(n => n.status === 'available');
    const inReviewNodes = dataset.roadmap.nodes.filter(n => n.status === 'in_progress');
    const blockedNodes = dataset.roadmap.nodes.filter(n => n.status === 'blocked');

    return {
      reply: [
        `### 📜 Required Statutory Clearances for ${project.name}`,
        `**Facility Profile**: ${project.areaSqft || 25000} sq.ft. | ${project.district}, ${project.state} | ${dataset.cpcbCategory} Category | **Total Clearances**: ${dataset.roadmap.nodes.length}`,
        '',
        `#### 🟢 Ready for Immediate Submission (${readyNodes.length})`,
        ...(readyNodes.length > 0
          ? readyNodes.map((n, i) => `  ${i + 1}. **${n.approvalName}**\n     - **Authority**: ${n.authority?.name || jurisdiction.spcbName}\n     - **Binding RTS SLA**: ${n.slaDays || 30} working days\n     - **Action**: Immediate single-window filing on ${jurisdiction.singleWindowPortal}`)
          : ['  - No clearances currently in ready state.']),
        '',
        ...(inReviewNodes.length > 0 ? [
          `#### 🟡 Currently In Scrutiny & Review (${inReviewNodes.length})`,
          ...inReviewNodes.map((n, i) => `  ${i + 1}. **${n.approvalName}** (${n.authority?.name || 'Departmental Desk'}, under official verification)`),
          '',
        ] : []),
        `#### 🔴 Gated & Blocked by Prerequisites (${blockedNodes.length})`,
        ...(blockedNodes.length > 0
          ? blockedNodes.map((n, i) => `  ${i + 1}. **${n.approvalName}** (${n.authority?.name || 'Regulator'})\n     - *Prerequisite*: Blocked by preceding approvals and physical site completion milestones.`)
          : ['  - No downstream clearances blocked.']),
        '',
        `💡 *Statutory SLA Protection*: All applications filed through **${jurisdiction.singleWindowPortal}** are legally enforceable under the **${jurisdiction.rtsActName}** with automatic deemed approval if unreviewed within the statutory SLA.`,
      ].join('\n'),
      spokenText: `Your ${project.name} requires ${dataset.roadmap.nodes.length} statutory clearances. Right now, ${readyNodes.length} are ready for immediate submission on ${jurisdiction.singleWindowPortal}, including MPCB Consent to Establish, DISH Plan Approval, and Provisional Fire NOC. ${blockedNodes.length} operational permits are currently gated waiting for plant construction.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' },
        { type: 'navigate', target: 'profile', label: 'View Profile' },
      ],
    };
  }

  // 2. Comprehensive Required & Missing Documents Listing
  if (/\b(what.*document|list.*document|which.*document|missing.*document|required.*document|document.*checklist|documents.*vault|paperwork|missing paperwork|show.*document)\b/i.test(q)) {
    const verifiedDocs = dataset.documents.filter(d => d.currentVersion?.state === 'verified');
    const pendingDocs = dataset.documents.filter(d => d.currentVersion?.state !== 'verified');
    const getDocLabel = (d: Document) => d.currentVersion?.originalFilename || d.documentDefinitionCode || `Statutory Filing Doc #${d.id.slice(0, 6)}`;
    const missingItems = dataset.quickOverview?.documents?.missingList?.length
      ? dataset.quickOverview.documents.missingList
      : [
          'Chartered Structural Stability Certificate (Form 1A)',
          'CA Gross Plant & Machinery Valuation Certificate',
          'Water Balance & Effluent Disposal Flow Plan',
        ];

    return {
      reply: [
        `### 📁 Statutory Document Checklist & Vault Status`,
        `**Project Docket**: ${project.name} (${project.district}, ${project.state})`,
        '',
        `#### ✅ Verified & Accepted in Vault (${verifiedDocs.length})`,
        ...(verifiedDocs.length > 0
          ? verifiedDocs.map((d, i) => `  ${i + 1}. **${getDocLabel(d)}** (Verified on file)`)
          : ['  - Initial documents undergoing verification.']),
        '',
        `#### ⚠️ Pending Upload or Missing Documents (${missingItems.length})`,
        ...missingItems.map((m, i) => `  ${i + 1}. **${m}** (Required for single-window verification)`),
        ...(pendingDocs.length > 0 ? pendingDocs.map((d) => `  - **${getDocLabel(d)}** (Upload in progress)`) : []),
        '',
        '#### 📋 General Mandatory Statutory Document Checklist for Single Window:',
        '  1. **Registered Lease Deed / MIDC Allotment Letter** (Plot boundaries & tenure)',
        '  2. **Chartered Architect Factory Layout & Machine Layout Drawing** (DISH Rule 3)',
        '  3. **Detailed Project Report (DPR)** with process flow diagram and raw material mass balance',
        '  4. **Effluent Treatment Plant (ETP) P&ID Drawing** and hydraulic sizing calculations',
        '  5. **Chartered Structural Engineer Stability Certificate** (Form 1A)',
        '  6. **Water & Power Computation Dossier** for MSEDCL / MIDC connections',
        '  7. **CA Capital Investment Certificate** for gross plant & machinery valuation',
        '  8. **Company Incorporation, MOA/AOA, and Authorized Signatory KYC (PAN/Aadhaar)**',
      ].join('\n'),
      spokenText: `You need eight primary statutory documents for your clearances. In your Document Vault, ${verifiedDocs.length} documents are already verified, including your registered lease deed and factory layouts. You still need to submit ${pendingDocs.length} items, including your structural stability certificate and CA capital investment certificate.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'vault', label: 'Open Document Vault' },
        { type: 'navigate', target: 'roadmap', label: 'View Prerequisite Docs' },
      ],
    };
  }

  // 3. Clearance Timeline & Completion Duration
  if (/\b(how long|timeline|duration|how many days|when can i (start|launch|produce|open|operate)|completion time|time to approve|time required|lead time)\b/i.test(q)) {
    return {
      reply: [
        `### ⏱️ Statutory Clearance Timeline & Legal Duration`,
        '',
        `- **ApprovalIQ Parallel DAG Trajectory**: **85 to 110 working days** from initial single-window submission to full statutory clearance.`,
        `- **Traditional Sequential Process**: **240+ working days** (ApprovalIQ eliminates ~130 days by executing independent tracks concurrently).`,
        '',
        `#### 📊 Phased Milestone Schedule:`,
        `1. **Phase 1: Pre-Construction Clearances (Days 1–45)**:`,
        `   - Provisional Fire NOC (15 Days SLA)`,
        `   - DISH Factory Building Plan Approval (30 Days SLA)`,
        `   - MPCB Consent to Establish — CTE (45 Days SLA)`,
        `   - Industrial Power & Water Connection Sanctions (15 Days SLA)`,
        `2. **Phase 2: Plant Erection & ETP Civil Works (Days 45–80)**:`,
        `   - Construction, machinery placement, and biological ETP erection.`,
        `3. **Phase 3: Pre-Commissioning Inspections & Operating Licenses (Days 80–110)**:`,
        `   - Joint MPCB & Fire Site Inspection (7 Days)`,
        `   - Final Fire NOC (15 Days SLA)`,
        `   - MPCB Consent to Operate — CTO (30 Days SLA)`,
        `   - DISH Operational Factory License (30 Days SLA)`,
        `   - State Excise Commercial Brewery Licence BRL-001 (60 Days SLA)`,
        `   - FSSAI Central Alcohol License (30 Days SLA)`,
        '',
        `⚖️ *RTS Legal Guarantee*: Under the **${jurisdiction.rtsActName}**, every clearance has a binding statutory SLA. Applications exceeding the SLA trigger Section 9 Deemed Approval.`,
      ].join('\n'),
      spokenText: `With ApprovalIQ's parallel critical path, your regulatory clearance timeline is projected at 85 to 110 working days, compared to over 240 days with traditional sequential filings. All clearances are protected by binding Maharashtra Right to Services SLAs.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'time-cost', label: 'Open Time & Cost Forecast' },
        { type: 'navigate', target: 'roadmap', label: 'Inspect Critical Path' },
      ],
    };
  }

  // 4. Critical Path & Bottlenecks
  if (/\b(critical path|longest path|gating sequence|bottleneck sequence|primary bottleneck)\b/i.test(q)) {
    return {
      reply: [
        `### 🔗 Statutory Critical Path Analysis for ${project.name}`,
        '',
        `The **Critical Path** represents the longest unbroken sequence of dependent regulatory clearances that dictates your overall launch date:`,
        '',
        `1. **Plot Lease Execution & Possession** (Day 0) — *Hard prerequisite for all filings*`,
        `   ↓`,
        `2. **Provisional Fire NOC + DISH Plan Approval** (Days 1–30) — *Required for MPCB CTE*`,
        `   ↓`,
        `3. **MPCB Consent to Establish (CTE)** (Days 1–45) — *Required to begin physical construction*`,
        `   ↓`,
        `4. **Physical Plant Erection & ETP Commissioning** (Days 45–80) — *Site milestone*`,
        `   ↓`,
        `5. **Final Fire NOC + MPCB Consent to Operate (CTO)** (Days 80–110) — *Mandatory for Excise*`,
        `   ↓`,
        `6. **State Excise Brewery Licence (BRL-001) & FSSAI Central License** (Days 80–110)`,
        `   ↓`,
        `🏁 **Commercial Batch Production Authorized**`,
        '',
        `💡 *Optimization Strategy*: By running MPCB CTE, DISH Plan, and Fire NOC concurrently in Phase 1, you unblock physical construction 75 days faster.`,
      ].join('\n'),
      spokenText: `Your critical path runs from Plot Lease, to Provisional Fire NOC and MPCB Consent to Establish, then factory construction and ETP erection, and finally your Consent to Operate and State Excise Brewery Licence.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'View DAG Roadmap' },
        { type: 'navigate', target: 'time-cost', label: 'View Timeline Forecast' },
      ],
    };
  }

  // 5. All Eligible Fiscal Schemes & Subsidies
  if (/\b(what.*scheme|eligible.*scheme|which.*scheme|what.*subsid|list.*scheme|government subsid|all schemes|financial incentive|fiscal benefit|financial support|show.*scheme)\b/i.test(q)) {
    return {
      reply: [
        `### 💰 Eligible Government Schemes & Fiscal Incentives for ${project.name}`,
        `**Facility CapEx**: ${project.investmentFormatted || '₹4.00 Crore'} | **Location**: ${project.district}, ${project.state} (MIDC Chakan)`,
        '',
        `#### 1. Central CGTMSE Collateral-Free Credit Guarantee (MSME / SIDBI)`,
        `- **Maximum Guarantee**: Up to **₹5.00 Crore** term loan and working capital.`,
        `- **Sovereign Cover**: **85% guarantee** provided to your lending bank without mortgaging personal residential property.`,
        `- **Interest Benefit**: 1.0% to 1.5% interest rate discount under Priority Sector Lending.`,
        '',
        `#### 2. EPCG 0% Customs Duty Machinery Import (DGFT)`,
        `- **Customs Benefit**: Import high-precision automated brewing kettles, fermenters, and canning lines at **0% basic customs duty** (saving 27.5% tariff).`,
        `- **Export Obligation**: Commit to export 6x duty saved over a 6-year period.`,
        '',
        `#### 3. Section 80-IAC 3-Year 100% Corporate Income Tax Holiday (DPIIT)`,
        `- **Tax Relief**: **100% tax deduction** on corporate profits for 3 consecutive financial years.`,
        `- **Eligibility**: Available to DPIIT-recognized startups under 10 years old with turnover < ₹100 Cr.`,
        '',
        `#### 4. MSME ZED (Zero Defect Zero Effect) Green Manufacturing Subsidy`,
        `- **Financial Relief**: Up to **80% subsidy** on environmental audits, water conservation assessments, and cleaner technology certification.`,
        `- **Banking Bonus**: Additional 0.5% interest rate rebate on bank credit lines.`,
        '',
        `#### 5. Maharashtra Industrial Policy Power Concessions`,
        `- **Tariff Benefit**: Electricity duty exemption for 5 to 7 years on registered MSME manufacturing load.`,
        '',
        `⚠️ **State SGST Cash Grants Notice**: Under **Maharashtra PSI 2019 (Annexure II Negative List)**, potable alcohol and brewery units are excluded from direct SGST cash refunds and state capital grants. However, all Central guarantees, customs waivers, and corporate tax holidays remain 100% active.`,
      ].join('\n'),
      spokenText: `For your Pune Craft Brewery, you are eligible for up to ₹5.00 Crore in collateral-free bank loans under CGTMSE, zero percent customs duty on imported machinery under EPCG, a three-year corporate income tax holiday under Section 80-IAC, and state electricity duty exemptions.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'schemes', label: 'Open Schemes Desk' },
        { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
      ],
    };
  }

  // 6. Regulatory Authorities & Governing Bodies
  if (/\b(regulatory authorit|which department|government bodies|competent authorit|who approve|who issue|who governs)\b/i.test(q)) {
    return {
      reply: [
        `### 🏛️ Competent Regulatory Authorities for ${project.name}`,
        '',
        `1. **Maharashtra Pollution Control Board (MPCB)**: Issues Consent to Establish (CTE) and Consent to Operate (CTO) for industrial environmental compliance (Orange Category).`,
        `2. **Directorate of Industrial Safety & Health (DISH)**: Approves Factory Building Plans (Rule 3) and issues the Operational Factory License (Sections 6 & 7).`,
        `3. **Maharashtra State Fire Services (MIDC Fire Department)**: Grants Provisional Fire NOC for construction and Final Fire NOC after physical on-site fire system verification.`,
        `4. **State Excise Department, Maharashtra**: Authorizes brewery establishment, issues Form BRL-001 Commercial Brewery Licence, and registers brands and holograms.`,
        `5. **Maharashtra State Electricity Distribution Co. (MSEDCL)**: Grants industrial HT/LT power load sanctions and meter installation.`,
        `6. **Maharashtra Industrial Development Corporation (MIDC)**: Governs industrial plot lease execution and piped water supply connections.`,
        `7. **Food Safety & Standards Authority of India (FSSAI)**: Issues Central FSSAI License for alcoholic beverage manufacturing and labeling compliance.`,
        `8. **Department of Legal Metrology**: Registers packaged commodities (LMPC Rule 27) for retail bottle/can volume declarations.`,
        '',
        `🌐 *Single Window Integration*: All applications are unified under **MAITRI single-window portal** protected by the **Maharashtra Right to Services (RTS) Act 2015**.`,
      ].join('\n'),
      spokenText: `Your approvals are governed by MPCB for environmental clearance, DISH for factory safety, MIDC Fire Services, the State Excise Department for brewery licensing, MSEDCL for power, MIDC for water, and FSSAI for food safety. All applications are synchronized through the MAITRI portal.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'Open Clearance Graph' },
      ],
    };
  }

  // 7. Navigation Commands
  if (/take me to|open|go to|navigate to/.test(q)) {
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
    const readyNodes = dataset.roadmap.nodes.filter(n => n.status === 'available');
    const inReviewNodes = dataset.roadmap.nodes.filter(n => n.status === 'in_progress');
    const blockedNodes = dataset.roadmap.nodes.filter(n => n.status === 'blocked');
    return {
      reply: [
        `### 🏭 ${project.name} (${project.district}, ${project.state})`,
        '',
        `- **Facility Scope**: ${project.areaSqft || 25000} sq.ft. industrial facility in ${project.district}, ${project.state}.`,
        `- **Project Outlay & Team**: ${project.investmentFormatted || '₹25.00 Crore'} capital investment, ${project.workforceCount || 80} full-time personnel.`,
        `- **Industrial Classification**: ${dataset.cpcbCategory} Category (${project.industry}) under ${jurisdiction.spcbName} norms.`,
        `- **Statutory Clearances (${dataset.roadmap.nodes.length} Total)**:`,
        `  - 🟢 **Ready for Immediate Submission (${readyNodes.length})**: ${readyNodes.slice(0, 3).map(n => n.shortName || n.approvalName).join(', ') || 'Initial single-window filings'}.`,
        `  - 🟡 **In Review (${inReviewNodes.length})**: ${inReviewNodes.map(n => n.shortName || n.approvalName).join(', ') || 'No approvals currently in review'}.`,
        `  - 🔴 **Blocked by Prerequisites (${blockedNodes.length})**: ${blockedNodes.slice(0, 3).map(n => n.shortName || n.approvalName).join(', ') || 'None'}.`,
        `- **Statutory Timelines**: Governed by **${jurisdiction.rtsActName}** binding SLAs via ${jurisdiction.singleWindowPortal}.`,
        `- **Government Fee Outlay**: Scaled statutory fees with transparent single-window challan receipts.`,
      ].join('\n'),
      spokenText: `Your project ${project.name} is a ${project.areaSqft || 25000} square foot ${project.industry} facility in ${project.district}, ${project.state}. It requires ${dataset.roadmap.nodes.length} statutory clearances, with ${readyNodes.length} ready for immediate filing and ${blockedNodes.length} blocked by prerequisites. Clearances are protected by ${jurisdiction.rtsActName} SLAs.`,
      mode: 'offline',
      actions: [
        { type: 'navigate', target: 'roadmap', label: 'View Roadmap' },
        { type: 'navigate', target: 'profile', label: 'View Profile' },
      ],
    };
  }

  // 3. Blocked Clearances & Prerequisites / Bottlenecks
  if (/blocked|prerequisite|why.*block|stuck|bottleneck|waiting for|dependency|dependencies/.test(q)) {
    const blockedNodes = dataset.roadmap.nodes.filter(n => n.status === 'blocked');
    const readyNodes = dataset.roadmap.nodes.filter(n => n.status === 'available');
    return {
      reply: [
        '### 🛑 Blocked Clearances & Prerequisite Dependencies',
        '',
        ...(blockedNodes.length > 0
          ? blockedNodes.map((n, i) => `${i + 1}. **${n.approvalName}**: Gated by mandatory prerequisite filings and physical site milestones.`)
          : ['No clearances are currently blocked. You can proceed with all available filings in parallel.']),
        '',
        `Filing your ${readyNodes.length} available clearance applications unblocks the critical path on ${jurisdiction.singleWindowPortal}.`,
      ].join('\n'),
      spokenText: `You currently have ${blockedNodes.length} blocked clearances for ${project.name}. Filing your available clearances will systematically unblock downstream permits under ${jurisdiction.rtsActName} SLAs.`,
      mode: 'offline',
      actions: [{ type: 'navigate', target: 'roadmap', label: 'Open Approval Roadmap' }],
    };
  }

  // 4. Immediate Priority Actions / What To Do Next
  if (/pending|next|what to do|available|status|action|priority|todo|where to start|first step/.test(q)) {
    const readyNodes = dataset.roadmap.nodes.filter(n => n.status === 'available');
    return {
      reply: [
        '### 📋 Immediate Priority Action Plan',
        '',
        '1. **Submit Available Clearances in Parallel**:',
        ...(readyNodes.slice(0, 3).map(n => `   - **${n.approvalName}**: ${n.authority?.name || jurisdiction.spcbName} (${n.slaDays || 30}-day ${jurisdiction.rtsActName} SLA).`)),
        '2. **Complete Document Vault**:',
        `   - Upload your registered land/lease deed and technical engineering drawings to the Document Vault.`,
        '3. **Secure Financial Guarantee & Incentives**:',
        `   - Leverage central CGTMSE ₹5.00 Cr credit cover and state incentives under ${jurisdiction.industrialPolicyName}.`,
      ].join('\n'),
      spokenText: `Your immediate next steps for ${project.name} are to submit your ${readyNodes.length} available clearances on ${jurisdiction.singleWindowPortal}, upload mandatory layout documents to your Document Vault, and apply for eligible state subsidies.`,
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
  const liveResult = await tryLiveLlmAnswer(message, history, _projectId);
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

