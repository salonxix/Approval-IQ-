import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Share2,
  Check,
} from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  shortLabel: string;
  pos: { x: number; y: number }; // percentage coordinates in desktop container
  answer: string;
  tags: string[];
  relatedId?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-approvaliq',
    question: 'What exactly is ApprovalIQ?',
    shortLabel: 'Overview',
    pos: { x: 22, y: 22 },
    answer:
      'ApprovalIQ is an autonomous statutory compliance engine that automates multi-agency clearance lifecycles. It connects industrial enterprises with State Pollution Control Boards (SPCB), Fire Safety (CFO), and Factory Inspectorates (DISHD) through deterministic routing.',
    tags: ['Statutory Engine', 'Multi-Agency', 'Deterministic'],
    relatedId: 'what-does-it-automate',
  },
  {
    id: 'how-verification-works',
    question: 'How does verification work?',
    shortLabel: 'Verification',
    pos: { x: 50, y: 15 },
    answer:
      'Incoming applications undergo automated statutory cross-verification against state master circulars, zoning laws, and pollution threshold criteria before officer submission, preventing upfront document rejections.',
    tags: ['Pre-Submission Check', 'Zoning Validation', 'Zero-Rejection'],
    relatedId: 'how-decisions-verified',
  },
  {
    id: 'can-handle-complex',
    question: 'Can it handle complex approval workflows?',
    shortLabel: 'Complex DAGs',
    pos: { x: 78, y: 22 },
    answer:
      'Yes. ApprovalIQ translates complex multi-stage approvals into Directed Acyclic Graphs (DAGs) that resolve prerequisite dependencies and release independent department clearances concurrently.',
    tags: ['Dependency DAGs', 'Parallel Dispatch', 'Multi-Stage'],
    relatedId: 'how-deterministic-routing',
  },
  {
    id: 'what-does-it-automate',
    question: 'What does ApprovalIQ automate?',
    shortLabel: 'Automation Scope',
    pos: { x: 18, y: 50 },
    answer:
      'It automates over 42 statutory clearances including Consent to Establish (CTE), Fire NOCs, Factory Plan Approvals, mass-balance computations, and deemed approval countdown clocks under Right to Services Acts.',
    tags: ['42+ Clearances', 'Mass Balance', 'Deemed Approval'],
    relatedId: 'how-audit-trail-works',
  },
  {
    id: 'can-existing-workflows',
    question: 'Can existing workflows be integrated?',
    shortLabel: 'Integrations',
    pos: { x: 82, y: 50 },
    answer:
      'ApprovalIQ integrates directly with existing state Single Window Systems, ERPs (SAP, Oracle), document repositories, and legacy applicant portals via secure REST and Webhook APIs.',
    tags: ['Single Window', 'ERP Connector', 'REST APIs'],
    relatedId: 'what-is-approvaliq',
  },
  {
    id: 'how-deterministic-routing',
    question: 'How does deterministic routing work?',
    shortLabel: 'Deterministic Routing',
    pos: { x: 22, y: 78 },
    answer:
      'Deterministic routing calculates strict legal dependency paths so applications progress automatically as milestones clear, eliminating administrative deadlocks and manual routing discretion.',
    tags: ['No Circular Deadlocks', 'Rule-Based', 'Auto-Progression'],
    relatedId: 'can-handle-complex',
  },
  {
    id: 'how-audit-trail-works',
    question: 'How does the audit trail work?',
    shortLabel: 'Audit Trail',
    pos: { x: 50, y: 85 },
    answer:
      'Every submission, verification check, officer query, and timestamped decision is cryptographically anchored with SHA-256 state hashes to generate an immutable, tamper-evident statutory audit log.',
    tags: ['SHA-256 Anchored', 'Immutable Logs', 'Compliance Ready'],
    relatedId: 'how-decisions-verified',
  },
  {
    id: 'how-decisions-verified',
    question: 'How are decisions verified?',
    shortLabel: 'Decision Proof',
    pos: { x: 78, y: 78 },
    answer:
      'Decisions are verified using reproducible statutory policy rules. Every clearance certificate produces a machine-verifiable proof chain detailing the exact regulatory clauses satisfied.',
    tags: ['Rule Explainability', 'Proof Chains', 'Statutory Clauses'],
    relatedId: 'how-verification-works',
  },
];

interface Props {
  onOpenDemo?: () => void;
}

export const ApprovalIntelligenceMapSection: React.FC<Props> = ({ onOpenDemo }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedItem = FAQ_ITEMS.find((item) => item.id === selectedId) || null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section
      id="faq"
      className="relative py-16 lg:py-22 bg-transparent text-white select-none overflow-hidden"
    >
      {/* Subtle Ambient Radial Highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[28rem] rounded-full blur-[140px] pointer-events-none -z-10 opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(13, 148, 136, 0.15) 60%, transparent 80%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-9 space-y-2">
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Questions Before Approval?
          </h2>
          <p className="text-sm sm:text-base text-cyan-100/80 font-sans max-w-xl mx-auto">
            Explore how ApprovalIQ verifies, routes, and audits every decision across the statutory lifecycle.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP INTERACTIVE COMPACT MAP (Height ~400px)                          */}
        {/* ========================================================================= */}
        <div className="hidden md:block relative w-full h-[400px] rounded-3xl border border-white/10 bg-[#03131B]/75 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
          
          {selectedItem ? (
            /* ======================================================================= */
            /* EXPANDED ANSWER PANEL (Inside same container)                           */
            /* ======================================================================= */
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-[#051E2B]/95 to-[#020F16]/95 backdrop-blur-2xl animate-fade-in z-30">
              
              {/* Top Navigation & Status */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center gap-2 text-sm font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>← Back to questions</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED ANSWER</span>
                </div>
              </div>

              {/* Core Content */}
              <div className="space-y-3.5 my-auto max-w-3xl">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {selectedItem.question}
                </h3>
                <p className="text-sm sm:text-base text-cyan-100/90 leading-relaxed font-sans font-normal">
                  {selectedItem.answer}
                </p>

                {/* Keyword Tags */}
                <div className="flex items-center gap-2 flex-wrap pt-1.5">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Next Step */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
                {selectedItem.relatedId ? (
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-white/50">Next:</span>
                    {(() => {
                      const related = FAQ_ITEMS.find((i) => i.id === selectedItem.relatedId);
                      if (!related) return null;
                      return (
                        <button
                          type="button"
                          onClick={() => setSelectedId(related.id)}
                          className="text-xs sm:text-sm font-mono text-cyan-300 hover:text-cyan-100 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{related.question}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      );
                    })()}
                  </div>
                ) : <div />}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedItem.id, `${selectedItem.question}\n\n${selectedItem.answer}`)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Copy Answer"
                  >
                    {copiedId === selectedItem.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                  {onOpenDemo && (
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-cyan-300 hover:bg-white transition-colors cursor-pointer"
                    >
                      Ask in Demo
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* ======================================================================= */
            /* ORGANIC CONNECTED GRAPH VIEW                                            */
            /* ======================================================================= */
            <>
              {/* Subtle SVG Connection Lines from Center Hub to Cards */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {FAQ_ITEMS.map((item) => {
                  const isHovered = hoveredId === item.id;
                  return (
                    <line
                      key={`line-${item.id}`}
                      x1="50%"
                      y1="50%"
                      x2={`${item.pos.x}%`}
                      y2={`${item.pos.y}%`}
                      stroke={isHovered ? 'rgba(34, 211, 238, 0.75)' : 'rgba(255, 255, 255, 0.09)'}
                      strokeWidth={isHovered ? 2 : 1}
                      strokeDasharray={isHovered ? 'none' : '3 3'}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Central ApprovalIQ Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
                <div className="relative px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#062433] to-[#02141D] border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-editorial text-sm sm:text-base font-bold text-white tracking-tight">
                      ApprovalIQ
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-wider mt-0.5 font-semibold">
                    Ask the system
                  </span>
                </div>
              </div>

              {/* Surrounding 8 Question Cards */}
              {FAQ_ITEMS.map((item, idx) => {
                const isHovered = hoveredId === item.id;
                const isDimmed = hoveredId !== null && !isHovered;

                // Alternate gentle vertical drift offset
                const driftClass = idx % 2 === 0 ? 'animate-subtle-float-1' : 'animate-subtle-float-2';

                return (
                  <div
                    key={item.id}
                    style={{
                      left: `${item.pos.x}%`,
                      top: `${item.pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(item.id)}
                    className={`absolute z-20 cursor-pointer transition-all duration-200 ${
                      isDimmed ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    <div
                      className={`group px-3.5 py-2 rounded-2xl border backdrop-blur-md transition-all duration-200 shadow-sm max-w-[215px] flex items-center gap-2.5 ${driftClass} ${
                        isHovered
                          ? 'bg-[#062837] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-[1.04]'
                          : 'bg-slate-900/75 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isHovered ? 'bg-cyan-300' : 'bg-cyan-500/60'}`} />
                      <span className="text-xs sm:text-sm font-medium text-slate-200 leading-snug group-hover:text-white line-clamp-2">
                        {item.question}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET: COMPACT VERTICAL CONNECTED LIST                         */}
        {/* ========================================================================= */}
        <div className="block md:hidden rounded-3xl border border-white/10 bg-[#03131B]/85 backdrop-blur-xl p-5 space-y-4">
          
          {/* Mobile Top Node */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#041B26] border border-cyan-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-bold text-white font-editorial">ApprovalIQ</span>
            <span className="text-[10px] font-mono text-cyan-300/80 ml-auto uppercase font-semibold">Decision Graph</span>
          </div>

          {/* Connected Question Items */}
          <div className="relative pl-5 space-y-2.5 border-l-2 border-white/10 ml-2.5 pt-1">
            {FAQ_ITEMS.map((item) => {
              const isOpen = selectedId === item.id;
              return (
                <div key={`m-${item.id}`} className="relative">
                  {/* Small Left Node Point */}
                  <div className={`absolute -left-[27px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-[#03131B] transition-colors ${
                    isOpen ? 'bg-cyan-400' : 'bg-cyan-700/70'
                  }`} />

                  <div
                    onClick={() => setSelectedId(isOpen ? null : item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-[#05202E] border-cyan-400/70 shadow-md'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="text-sm font-medium text-slate-200 leading-snug">
                        {item.question}
                      </span>
                      <span className="text-cyan-400 text-xs font-mono shrink-0">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 text-left animate-fade-in">
                        <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-sans">
                          {item.answer}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-mono text-cyan-300 bg-white/5 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
