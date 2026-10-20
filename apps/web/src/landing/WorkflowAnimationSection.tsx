import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Cpu,
  FileText,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Flame,
  Zap,
  Building2,
  Compass,
  TreePine,
  Factory,
  HardHat,
  Mountain,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface AuthorityTile {
  name: string;
  icon: React.ElementType;
  dept: string;
  activeInStep: number;
}

const AUTHORITIES: AuthorityTile[] = [
  { name: 'SPCB', icon: Droplets, dept: 'Pollution Board', activeInStep: 1 },
  { name: 'Fire CFO', icon: Flame, dept: 'Fire Safety NOC', activeInStep: 2 },
  { name: 'DISHD', icon: HardHat, dept: 'Industrial Health', activeInStep: 2 },
  { name: 'CGWA', icon: Droplets, dept: 'Water Abstraction', activeInStep: 1 },
  { name: 'Boiler', icon: Factory, dept: 'Steam & Pressure', activeInStep: 2 },
  { name: 'Planning', icon: Compass, dept: 'Urban Zoning', activeInStep: 1 },
  { name: 'SEB Power', icon: Zap, dept: 'High-Tension Load', activeInStep: 2 },
  { name: 'Forest', icon: TreePine, dept: 'Eco Buffer NOC', activeInStep: 1 },
  { name: 'Revenue', icon: FileText, dept: 'Land Title / NA', activeInStep: 1 },
  { name: 'Labor', icon: Building2, dept: 'Contract Labor', activeInStep: 2 },
  { name: 'Mining', icon: Mountain, dept: 'Quarry & Material', activeInStep: 2 },
  { name: 'Licensing', icon: FileCheck, dept: 'Factory Consent', activeInStep: 3 },
];

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Statutory Dossier Ingestion',
    icon: FileText,
    badge: 'STAGE 1',
  },
  {
    step: 2,
    title: 'Multi-Agency Concurrency Engine',
    icon: GitBranch,
    badge: 'STAGE 2',
  },
  {
    step: 3,
    title: 'Cryptographic Audit & SLA Issuance',
    icon: ShieldCheck,
    badge: 'STAGE 3',
  },
];

export const WorkflowAnimationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Auto-progress through the 3 workflow steps smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far into view the section is (from 0 to 1)
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight * 0.75)));
        setScrollProgress(progress);
        if (progress > 0.1) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Compute soft upward translation: starts at 90px down and glides smoothly up to 0px
  const dynamicTranslateY = isVisible ? Math.max(0, (1 - scrollProgress) * 70) : 90;

  return (
    <section 
      ref={sectionRef}
      id="workflow"
      className="relative py-20 lg:py-28 bg-transparent text-white select-none overflow-hidden"
    >
      
      {/* Background Soft Glow Fields */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[55rem] h-[30rem] rounded-full blur-[160px] pointer-events-none -z-10 opacity-35 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)',
          opacity: isVisible ? 0.45 : 0.1,
        }}
      />

      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${dynamicTranslateY}px)`,
          opacity: isVisible ? 1 : 0.2,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        
        {/* Clean Header with Soft Upward Reveal */}
        <div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          style={{
            transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Autonomous Clearance Workflow
          </h2>
          <p className="text-sm sm:text-base text-cyan-100/75 font-sans max-w-xl mx-auto">
            From initial document intake to multi-agency statutory clearance in seconds
          </p>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKFLOW PIPELINE (Matching Reference Architecture)           */}
        {/* ========================================================================= */}
        <div 
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
        >
          
          {/* 1. LEFT NODE: The User / Industrialist (Stagger 1) */}
          <div 
            className="flex flex-col items-center gap-3 shrink-0"
            style={{
              transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center text-cyan-200 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <User className="w-6 h-6" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
              Your Applicant
            </span>
          </div>

          {/* CONNECTOR 1: Animated Pulse Dots */}
          <div 
            className="flex lg:flex-row flex-col items-center justify-center gap-1.5 shrink-0 px-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.25s',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <div className="w-12 lg:w-16 h-0.5 lg:h-0.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400/60 hidden lg:block" />
            <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400 via-teal-300 to-cyan-400/60 block lg:hidden" />
            <span className="w-2 h-2 rounded-full bg-teal-300" />
          </div>

          {/* 2. CENTER NODE: Intelligent Agent Core (Stagger 2) */}
          <div 
            className="flex flex-col items-center gap-3 shrink-0"
            style={{
              transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
            }}
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-cyan-300/30 via-teal-500/20 to-transparent border border-cyan-400/60 backdrop-blur-2xl flex items-center justify-center text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.4)]">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '14s' }} />
              <div className="w-14 h-14 rounded-full bg-[#041E28] border border-cyan-300/50 flex items-center justify-center text-cyan-300 shadow-inner">
                <Cpu className="w-7 h-7 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> ApprovalIQ Agent
            </span>
          </div>

          {/* CONNECTOR 2: Animated Pulse Dots */}
          <div 
            className="flex lg:flex-row flex-col items-center justify-center gap-1.5 shrink-0 px-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.35s',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="w-12 lg:w-16 h-0.5 lg:h-0.5 bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-400 hidden lg:block" />
            <div className="h-8 w-0.5 bg-gradient-to-b from-teal-300 via-emerald-400 to-cyan-400 block lg:hidden" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>

          {/* 3. RIGHT CONTAINER: The Main Handler Card (Stagger 3) */}
          <div 
            className="flex-1 w-full lg:max-w-xl relative rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{
              transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            }}
          >
            
            {/* Top Pill Badge (Merge Agent Handler style) */}
            <div className="absolute -top-4 left-6 sm:left-8 px-4 py-1.5 rounded-full bg-white text-slate-950 font-mono text-[11px] font-bold tracking-wider shadow-lg flex items-center gap-1.5 border border-white/40">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>APPROVALIQ Workflow Pipeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-3">
              
              {/* Left Column: 3 Sequential Step Pills */}
              <div className="md:col-span-6 space-y-3">
                {WORKFLOW_STEPS.map((stepItem) => {
                  const Icon = stepItem.icon;
                  const isActive = activeStep === stepItem.step;
                  const isPast = activeStep > stepItem.step;

                  return (
                    <button
                      key={stepItem.step}
                      type="button"
                      onClick={() => setActiveStep(stepItem.step)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/30 to-teal-500/20 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-[1.02]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isActive 
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300' 
                          : isPast
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                        {isPast ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {stepItem.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Regulatory Authorities Matrix Grid */}
              <div className="md:col-span-6 p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 px-1">
                  <span>Authorities Synchronized</span>
                  <span className="text-emerald-400 font-bold">12 / 12 Active</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {AUTHORITIES.map((auth, idx) => {
                    const AuthIcon = auth.icon;
                    const isHighlighted = auth.activeInStep === activeStep;

                    return (
                      <div
                        key={idx}
                        title={`${auth.name} - ${auth.dept}`}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105'
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80'
                        }`}
                      >
                        <AuthIcon className="w-4 h-4" />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center">
                          {auth.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
