import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Layers,
  ShieldCheck,
  Zap,
  GitBranch,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgressBar } from './ScrollProgressBar';
import { DemoModal } from './DemoModal';
import { useLanguage } from '../i18n';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  summary: string;
  tag: string;
  linkedinUrl: string;
  rotation: number; // natural card dealing rotation in degrees
  accentColor: string;
  borderColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'saloni',
    name: 'Saloni',
    role: 'Core Engineering & Experience',
    summary: 'Building seamless, deterministic interaction flows and real-time state interfaces.',
    tag: 'Interface Engine',
    linkedinUrl: 'https://www.linkedin.com/in/saloni-kumari-82b03a2a9/?isSelfProfile=true',
    rotation: -4,
    accentColor: 'from-cyan-400 to-teal-300',
    borderColor: 'border-cyan-300/60',
  },
  {
    id: 'shreya',
    name: 'Shreya Sherikar',
    role: 'System Architecture & Routing',
    summary: 'Designing execution graphs, DAG dependencies, and multi-agency coordination models.',
    tag: 'DAG Architect',
    linkedinUrl: 'https://www.linkedin.com/in/shreya-sherikar/',
    rotation: 3,
    accentColor: 'from-teal-400 to-emerald-300',
    borderColor: 'border-teal-300/60',
  },
  {
    id: 'avila',
    name: 'Avila Princy M.',
    role: 'Verification & Governance',
    summary: 'Shaping automated statutory compliance rules and validation engines.',
    tag: 'Statutory Proofs',
    linkedinUrl: 'https://www.linkedin.com/in/avila-princy-m-633820307/',
    rotation: -2,
    accentColor: 'from-sky-400 to-cyan-300',
    borderColor: 'border-sky-300/60',
  },
  {
    id: 'chirag',
    name: 'Chirag S.',
    role: 'Platform Infrastructure & Security',
    summary: 'Engineering high-integrity audit proof chains, state hashing, and enterprise infrastructure.',
    tag: 'Audit Systems',
    linkedinUrl: 'http://linkedin.com/in/chirag-s-38b915295/',
    rotation: 4,
    accentColor: 'from-blue-400 to-cyan-300',
    borderColor: 'border-blue-300/60',
  },
];

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'founder' | 'authority'>('authority');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [isDeckDealt, setIsDeckDealt] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const BELIEFS = [
    {
      number: '01',
      statement: t('about_page.b1_statement', 'Complexity should be organized.'),
      detail: t('about_page.b1_detail', 'Regulatory codes are intricate, but an approval system should never feel chaotic. We convert tangled legal circulars into structured, deterministic execution graphs.'),
      tag: t('about_page.b1_tag', 'Structure'),
      accentColor: 'from-cyan-400 to-teal-300',
    },
    {
      number: '02',
      statement: t('about_page.b2_statement', 'Every decision should be traceable.'),
      detail: t('about_page.b2_detail', 'Opacity breeds delays and disputes. Every verification check, agency dispatch, and approval stamp must carry an immutable, explainable proof chain.'),
      tag: t('about_page.b2_tag', 'Traceability'),
      accentColor: 'from-amber-400 to-yellow-300',
    },
    {
      number: '03',
      statement: t('about_page.b3_statement', 'Automation should strengthen human judgment, not hide it.'),
      detail: t('about_page.b3_detail', 'We automate administrative repetition, calculations, and cross-checks so reviewing officers and enterprise applicants can focus on high-judgment decisions.'),
      tag: t('about_page.b3_tag', 'Intelligence'),
      accentColor: 'from-teal-300 to-cyan-200',
    },
  ];

  const WORKFLOW_STEPS = [
    { title: 'Request', desc: 'Single-window intake & mass-balance calculation' },
    { title: 'Verification', desc: 'Pre-audit against 42+ statutory directives' },
    { title: 'Routing', desc: 'Deterministic DAG multi-agency parallel dispatch' },
    { title: 'Decision', desc: 'Conforming statutory assessment & clearance' },
    { title: 'Audit', desc: 'SHA-256 state-anchored compliance record' },
  ];

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const workflowSectionRef = useRef<HTMLDivElement>(null);
  const beliefsSectionRef = useRef<HTMLDivElement>(null);

  const [beliefsProgress, setBeliefsProgress] = useState(0);
  const [isBeliefsVisible, setIsBeliefsVisible] = useState(false);

  const isFounder = activeMode === 'founder';
  const isScrolledPastHero = scrollY > 220;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Scroll detection to automatically trigger the card-dealing physics & track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (teamSectionRef.current) {
        const rect = teamSectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsDeckDealt(true);
        }
      }

      if (workflowSectionRef.current) {
        const rect = workflowSectionRef.current.getBoundingClientRect();
        const progress = Math.min(
          WORKFLOW_STEPS.length - 1,
          Math.max(0, Math.floor(((window.innerHeight * 0.7 - rect.top) / (rect.height || 1)) * WORKFLOW_STEPS.length))
        );
        setActiveStep(progress);
      }

      if (beliefsSectionRef.current) {
        const rect = beliefsSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top <= windowHeight && rect.bottom >= 0) {
          const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight * 0.85)));
          setBeliefsProgress(progress);
          if (progress > 0.05) {
            setIsBeliefsVisible(true);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for expanded card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={pageContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden transition-all duration-700 ease-out"
      style={{
        background: isFounder
          ? 'linear-gradient(135deg, #06212B 0%, #0E4B5E 45%, #15808B 80%, #22D3EE 100%)'
          : 'linear-gradient(135deg, #0A2F3D 0%, #0E6B7A 40%, #B45309 85%, #F59E0B 100%)',
      }}
    >
      {/* Top Scroll Reading Progress Line */}
      <ScrollProgressBar />

      {/* Floating Persistent Mode Switcher Pill (Hovers at bottom HUD like Homepage) */}
      <div
        className={`fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 pointer-events-auto ${
          isScrolledPastHero
            ? 'opacity-100 translate-y-0 scale-100 shadow-2xl'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-2xl border border-white/25 px-4 py-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <button
            type="button"
            className={`text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              isFounder ? 'text-cyan-300 font-extrabold' : 'text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveMode('founder')}
          >
            {t('lens.founder', 'Founder')}
          </button>
          <button
            type="button"
            onClick={() => setActiveMode(isFounder ? 'authority' : 'founder')}
            className="w-11 h-6 rounded-full bg-white/20 relative p-0.5 transition-colors cursor-pointer border border-white/30 flex items-center"
            aria-label="Toggle Lens Mode"
          >
            <div
              className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                !isFounder ? 'translate-x-5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'translate-x-0 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
              }`}
            />
          </button>
          <button
            type="button"
            className={`text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
              !isFounder ? 'text-amber-300 font-extrabold' : 'text-white/60 hover:text-white'
            }`}
            onClick={() => setActiveMode('authority')}
          >
            {t('lens.authority', 'Authority')}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <Navbar onOpenDemo={() => setIsDemoOpen(true)} />

      {/* ========================================================================= */}
      {/* FULL-SCREEN ANIMATED RADIANT GLOWING COLOR SPHERES (Mouse Parallax & Drift) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-Left Ambient Dynamic Sphere */}
        <div
          className="absolute w-[45rem] sm:w-[65rem] h-[45rem] sm:h-[65rem] rounded-full blur-[130px] transition-all duration-700 ease-out animate-ambient-1"
          style={{
            left: isFounder ? '10%' : '50%',
            top: '4%',
            background: isFounder
              ? 'radial-gradient(circle, rgba(56, 172, 204, 0.55) 0%, rgba(14, 139, 178, 0.25) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.58) 0%, rgba(217, 119, 6, 0.28) 50%, transparent 75%)',
            transform: `translate(${mousePos.x * 1.3}px, ${mousePos.y * 1.3}px)`,
          }}
        />

        {/* Right Mid-Screen Ambient Dynamic Sphere */}
        <div
          className="absolute w-[50rem] sm:w-[70rem] h-[50rem] sm:h-[70rem] rounded-full blur-[150px] transition-all duration-700 ease-out animate-ambient-2"
          style={{
            right: isFounder ? '5%' : '45%',
            top: '32%',
            background: isFounder
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(6, 182, 212, 0.22) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(14, 139, 178, 0.25) 50%, transparent 75%)',
            transform: `translate(${mousePos.x * -1.1}px, ${mousePos.y * -1.1}px)`,
          }}
        />

        {/* Lower Left Deep Ambient Glowing Sphere */}
        <div
          className="absolute w-[45rem] sm:w-[60rem] h-[45rem] sm:h-[60rem] rounded-full blur-[140px] transition-all duration-700 ease-out animate-ambient-3"
          style={{
            left: isFounder ? '5%' : '35%',
            top: '65%',
            background: isFounder
              ? 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(14, 139, 178, 0.2) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 75%)',
            transform: `translate(${mousePos.x * 0.9}px, ${mousePos.y * 0.9}px)`,
          }}
        />
      </div>

      <main className="flex-1 pt-24 sm:pt-28 pb-16 space-y-24 sm:space-y-32 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION 1 — HERO                                                          */}
        {/* ========================================================================= */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Top Bar: Lens Mode Switcher */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-0">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
              <button
                type="button"
                className={`text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                  isFounder ? 'text-cyan-300 font-extrabold' : 'text-white/60 hover:text-white'
                }`}
                onClick={() => setActiveMode('founder')}
              >
                {t('lens.founder', 'Founder')}
              </button>
              <button
                type="button"
                onClick={() => setActiveMode(isFounder ? 'authority' : 'founder')}
                className="w-11 h-6 rounded-full bg-white/20 relative p-0.5 transition-colors cursor-pointer border border-white/30 flex items-center"
                aria-label="Toggle Lens Mode"
              >
                <div
                  className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    !isFounder ? 'translate-x-5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'translate-x-0 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                  }`}
                />
              </button>
              <button
                type="button"
                className={`text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                  !isFounder ? 'text-amber-300 font-extrabold' : 'text-white/60 hover:text-white'
                }`}
                onClick={() => setActiveMode('authority')}
              >
                {t('lens.authority', 'Authority')}
              </button>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-md pt-2">
            {t('about_page.hero_title_1', 'Making Every Approval')} <br />
            <span
              className={`text-transparent bg-clip-text ${
                isFounder
                  ? 'bg-gradient-to-r from-cyan-300 via-teal-100 to-white'
                  : 'bg-gradient-to-r from-amber-300 via-yellow-100 to-white'
              }`}
            >
              {t('about_page.hero_title_2', 'More Intelligent.')}
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-white/90 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {t('about_page.hero_desc', 'ApprovalIQ is built to bring structure, verification, and traceability to complex approval workflows.')}
          </p>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 — WHY APPROVALIQ EXISTS                                         */}
        {/* ========================================================================= */}
        <section
          ref={workflowSectionRef}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Story Text (Left) */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold drop-shadow">
                {t('about_page.problem_tag', 'The Problem & Purpose')}
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
                {t('about_page.problem_heading', 'Approvals shouldn’t feel like a black box.')}
              </h2>
              
              <div className="space-y-4 text-sm sm:text-base text-white/90 font-sans leading-relaxed">
                <p>
                  {t('about_page.problem_p1', 'Complex statutory approval processes often involve multiple overlapping agencies, hundreds of technical documents, cross-department handoffs, and manual verification queues.')}
                </p>
                <p>
                  {t('about_page.problem_p2', 'When prerequisites are opaque, applicants face weeks of avoidable procedural delays, circular departmental deadlocks, and unpredictable timelines.')}
                </p>
                <p className="text-cyan-200 font-semibold">
                  {t('about_page.problem_p3', 'ApprovalIQ exists to make that entire lifecycle structured, connected, and completely traceable from first application to final gazetted certificate.')}
                </p>
              </div>
            </div>

            {/* Luminous Animated Workflow Card (Right) */}
            <div
              className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border border-white/30 backdrop-blur-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="text-xs font-mono text-cyan-200 font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>{t('about_page.pipeline_title', 'Deterministic Clearance Pipeline')}</span>
              </div>

              <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-cyan-300/40 ml-2">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const isActive = idx === activeStep;
                  const isPassed = idx < activeStep;

                  return (
                    <div key={step.title} className="relative group transition-all duration-300">
                      
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-all duration-300 ${
                          isActive
                            ? 'bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)] scale-125'
                            : isPassed
                            ? 'bg-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.6)]'
                            : 'bg-white/40'
                        }`}
                      />

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm sm:text-base font-bold font-editorial ${isActive ? 'text-cyan-200 font-extrabold' : 'text-white'}`}>
                            {step.title}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] font-mono text-cyan-200 bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 animate-pulse font-bold">
                              {t('about_page.active_stage', 'Active Stage')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 font-sans">
                          {step.desc}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 — WHAT WE BELIEVE (Evident Left-to-Right Kinetic Slide)          */}
        {/* ========================================================================= */}
        <section
          ref={beliefsSectionRef}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 overflow-hidden"
        >
          {/* Section Header */}
          <div className="text-center space-y-2">
            <span className={`text-xs font-mono uppercase tracking-wider font-bold drop-shadow ${isFounder ? 'text-cyan-300' : 'text-amber-300'}`}>
              {t('about_page.beliefs_tag', 'Core Principles')}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              {t('about_page.beliefs_title', 'What We Believe')}
            </h2>
          </div>

          {/* Staggered Dramatic Left-to-Right Sliding Cards */}
          <div className="space-y-6 relative">
            {BELIEFS.map((belief, idx) => {
              // Prominent, highly evident left-to-right slide translation
              const isVisible = isBeliefsVisible;
              const initialOffset = -180 - idx * 100; // Starts noticeably shifted to the left
              const scrollShift = (beliefsProgress - 0.3) * 60;
              const finalTranslateX = isVisible ? Math.max(-20, Math.min(30, scrollShift)) : initialOffset;

              return (
                <div
                  key={belief.number}
                  style={{
                    transform: `translateX(${finalTranslateX}px)`,
                    opacity: isVisible ? 1 : 0,
                    transition: `transform 850ms cubic-bezier(0.2, 1, 0.3, 1) ${idx * 150}ms, opacity 750ms ease ${idx * 150}ms, box-shadow 300ms ease, border-color 300ms ease`,
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                  }}
                  className="group relative rounded-3xl p-6 sm:p-8 border border-white/25 hover:border-white/50 backdrop-blur-2xl transition-all duration-300 overflow-hidden hover:scale-[1.01]"
                >
                  {/* Left Edge Radiant Indicator Beam */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${belief.accentColor} shadow-[0_0_15px_rgba(34,211,238,0.8)]`} />

                  {/* Subtle Sheen Sweep on hover */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:animate-sheen-sweep opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pl-2">
                    
                    {/* Left: Number + Statement Heading Only */}
                    <div className="flex items-center gap-4 sm:gap-5 flex-1">
                      {/* Glowing Number Badge */}
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${belief.accentColor} text-slate-950 flex items-center justify-center font-mono font-bold text-sm shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                        {belief.number}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors drop-shadow">
                          “{belief.statement}”
                        </h3>
                      </div>
                    </div>

                    {/* Right: Modern Tag Chip */}
                    <div className="shrink-0 pl-15 sm:pl-0">
                      <span className="text-[11px] font-mono uppercase font-bold text-white/90 bg-white/20 border border-white/30 px-3.5 py-1 rounded-full shadow-sm">
                        {belief.tag}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 — THE TEAM (52-Card Deck Physics & Dealing Experience)           */}
        {/* ========================================================================= */}
        <section
          ref={teamSectionRef}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
        >
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold drop-shadow">
              {t('about_page.team_tag', 'Leadership & Engineering')}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              {t('about_page.team_title', 'Meet the people behind ApprovalIQ.')}
            </h2>
            <p className="text-sm sm:text-base text-white/90 font-sans">
              {t('about_page.team_subtitle', 'Four people. One system. A shared obsession with building better approval workflows.')}
            </p>

            {/* Interactive Toggle for Deck Physics */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDeckDealt(!isDeckDealt)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-200 bg-white/[0.14] backdrop-blur-2xl hover:bg-white/[0.24] border border-white/30 hover:border-white/50 transition-colors cursor-pointer shadow-lg"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-300" />
                <span>{isDeckDealt ? t('about_page.stack_deck', 'Stack deck back') : t('about_page.deal_cards', 'Deal identity cards')}</span>
              </button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 52-CARD DECK CONTAINER (Desktop & Tablet)                               */}
          {/* ======================================================================= */}
          <div className="relative min-h-[360px] sm:min-h-[400px] flex items-center justify-center pt-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
              {TEAM_MEMBERS.map((member, index) => {
                const isHovered = hoveredMemberId === member.id;
                const isDimmed = hoveredMemberId !== null && !isHovered;

                const cardRotation = isDeckDealt ? (isHovered ? 0 : member.rotation) : (index - 1.5) * 4;
                const cardTranslateY = isDeckDealt ? (isHovered ? -8 : 0) : index * 4;

                return (
                  <div
                    key={member.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`View profile for ${member.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedMember(member);
                      }
                    }}
                    onMouseEnter={() => setHoveredMemberId(member.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                    onClick={() => setSelectedMember(member)}
                    style={{
                      transform: `rotate(${cardRotation}deg) translateY(${cardTranslateY}px)`,
                      transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease, border-color 200ms ease, box-shadow 300ms ease',
                      background: 'rgba(255, 255, 255, 0.16)',
                      boxShadow: isHovered
                        ? '0 25px 60px rgba(34,211,238,0.5), inset 0 1px 2px rgba(255,255,255,0.5)'
                        : '0 20px 45px -10px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                    }}
                    className={`relative rounded-3xl p-6 sm:p-7 border backdrop-blur-2xl cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                      isHovered
                        ? 'border-cyan-300 z-30 scale-105'
                        : isDimmed
                        ? 'border-white/10 opacity-50 z-10'
                        : `${member.borderColor} z-20`
                    }`}
                  >
                    
                    {/* Top Identity Header */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/15">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${member.accentColor} text-slate-950 flex items-center justify-center font-bold text-xs shadow-md`}>
                          ▲
                        </div>
                        <span className="font-editorial text-xs font-bold text-white tracking-tight">
                          ApprovalIQ
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-200 uppercase font-semibold bg-white/20 px-2 py-0.5 rounded-full border border-white/25">
                        {member.tag}
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="pt-6 space-y-1.5">
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-cyan-200 font-semibold">
                        {member.role}
                      </p>
                    </div>

                    {/* Short Contribution Sentence */}
                    <p className="pt-4 text-xs sm:text-sm text-white/90 font-sans leading-relaxed">
                      "{member.summary}"
                    </p>

                    {/* Bottom Tap Indicator & LinkedIn */}
                    <div className="pt-5 flex items-center justify-between text-xs font-mono text-white border-t border-white/15 mt-4">
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${member.name} on LinkedIn`}
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-cyan-400 hover:text-slate-950 text-white border border-white/25 hover:border-cyan-300 transition-colors flex items-center gap-1.5 font-bold"
                      >
                        <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        <span className="text-[10px] font-mono font-bold">LinkedIn</span>
                      </a>
                      <span className="text-cyan-200 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                        <span>{t('about_page.details_btn', 'Details')}</span>
                        <span>→</span>
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* ======================================================================= */}
          {/* EXPANDED MEMBER MODAL (When any card is clicked)                         */}
          {/* ======================================================================= */}
          {selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none">
              
              {/* Dark Ambient Backdrop */}
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                onClick={() => setSelectedMember(null)}
                aria-hidden="true"
              />

              {/* Modal Card */}
              <div
                className="relative border border-cyan-300/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(34,211,238,0.3)] z-10 space-y-6 backdrop-blur-2xl"
                style={{
                  background: 'rgba(6, 33, 43, 0.95)',
                }}
              >
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedMember.accentColor} text-slate-950 flex items-center justify-center font-bold text-sm shadow-md`}>
                    ▲
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-white tracking-tight">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-300 font-semibold">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    {t('about_page.contribution_focus', 'Contribution Focus')}
                  </div>
                  <p className="text-sm text-cyan-100 font-sans leading-relaxed p-4 rounded-2xl bg-black/50 border border-white/10">
                    "{selectedMember.summary}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-bold text-xs font-mono hover:from-white hover:to-cyan-200 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>{t('about_page.connect_linkedin', 'Connect on LinkedIn')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('about_page.close_card', 'Close Card')}
                  </button>
                </div>

              </div>
            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* SECTION 5 — HOW WE BUILD                                                  */}
        {/* ========================================================================= */}
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold drop-shadow">
              {t('about_page.foundation_tag', 'Engineering Foundation')}
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-md">
              {t('about_page.foundation_title', 'Built around one principle.')}
            </h2>
            <p className="text-base sm:text-lg text-white/90 font-sans max-w-2xl mx-auto leading-relaxed">
              {t('about_page.foundation_subtitle', 'Make complex approvals easier to understand, easier to execute, and easier to defend.')}
            </p>
          </div>

          {/* 3 Sequential Animated Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { label: 'STRUCTURE', desc: t('about_page.pillar_structure_desc', 'Deterministic dependency graphs replacing ad-hoc queues.'), icon: Layers },
              { label: 'VERIFICATION', desc: t('about_page.pillar_verification_desc', 'Pre-submission statutory audits ensuring zero-rejections.'), icon: ShieldCheck },
              { label: 'TRACEABILITY', desc: t('about_page.pillar_traceability_desc', 'Cryptographic SHA-256 state roots for immutable audit logs.'), icon: Zap },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  className="p-6 rounded-3xl border border-white/25 backdrop-blur-2xl shadow-xl text-center space-y-2 hover:border-white/50 transition-all hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.14)',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/40 text-cyan-200 mx-auto flex items-center justify-center shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-cyan-200 tracking-wider uppercase">
                    {pillar.label}
                  </h4>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Reusable Enterprise Footer */}
      <Footer onOpenDemo={() => setIsDemoOpen(true)} />

      {/* Interactive Demo Simulation Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

    </div>
  );
};
