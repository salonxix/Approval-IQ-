import React, { useState, useEffect, useRef } from 'react';
import {
  GitBranch,
  FileCheck2,
  CalendarCheck2,
  ShieldCheck,
  Fingerprint,
  ArrowRight,
  Sparkles,
  KeyRound,
  Cpu,
  Layers,
  Flame,
  Droplets,
  Zap,
  Building2,
  Lock,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardData {
  id: string;
  title: string;
  graphic: React.ReactNode;
  rotation: string;
}

export const FloatingFeatureCardsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight * 0.75)));
        setScrollProgress(progress);
        if (progress > 0.1) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dynamicTranslateY = isVisible ? Math.max(0, (1 - scrollProgress) * 60) : 80;
  const COLUMN_1: FeatureCardData[] = [
    {
      id: 'all-clearances',
      title: 'All Clearances in One Place',
      rotation: 'group-hover:rotate-0 -rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex items-center justify-center">
          {/* Hexagonal / Radial icon cluster */}
          <div className="relative w-36 h-32 flex items-center justify-center">
            {/* Center core */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-teal-400/20 border border-cyan-400/50 backdrop-blur-xl flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10">
              <Sparkles className="w-7 h-7 animate-pulse text-cyan-300" />
            </div>
            {/* Surrounding orbital icons */}
            <div className="absolute -top-1 left-3 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-teal-300 shadow-md">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="absolute -top-1 right-3 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-md">
              <Flame className="w-4 h-4" />
            </div>
            <div className="absolute top-11 -left-2 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-md">
              <Zap className="w-4 h-4" />
            </div>
            <div className="absolute top-11 -right-2 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-indigo-300 shadow-md">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-1 left-7 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300 shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-1 right-7 w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-sky-300 shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dossier-reuse',
      title: 'Single-Dossier Reuse',
      rotation: 'group-hover:rotate-0 rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-teal-400/25 via-emerald-500/15 to-transparent border border-teal-400/40 backdrop-blur-xl flex items-center justify-center text-teal-200 shadow-[0_10px_30px_rgba(20,184,166,0.25)]">
            <FileCheck2 className="w-10 h-10 text-teal-300" />
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-inner">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>0 Re-submissions</span>
          </div>
        </div>
      ),
    },
  ];

  const COLUMN_2: FeatureCardData[] = [
    {
      id: 'role-based',
      title: 'Role-Based Governance',
      rotation: 'group-hover:rotate-0 rotate-1.5',
      graphic: (
        <div className="relative w-full h-36 flex flex-col items-center justify-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-transparent border border-white/30 backdrop-blur-2xl flex items-center justify-center text-amber-300 shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.25)]">
            <KeyRound className="w-12 h-12 text-amber-300 transform -rotate-45" />
          </div>
          <div className="flex items-center -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-cyan-400 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">A</div>
            <div className="w-5 h-5 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">O</div>
            <div className="w-5 h-5 rounded-full bg-emerald-400 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">F</div>
          </div>
        </div>
      ),
    },
    {
      id: 'sla-tracking',
      title: 'Real-Time SLA Clocks',
      rotation: 'group-hover:rotate-0 -rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex items-center justify-center">
          {/* Visual SLA Bar Chart / Gauge */}
          <div className="w-full max-w-[170px] flex items-end justify-between gap-2 px-3 pt-2 pb-1 border-b border-white/20">
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-10 rounded-t-lg bg-cyan-500/40 border-t border-x border-cyan-400/50" />
              <span className="text-[9px] font-mono text-cyan-300">Intake</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-20 rounded-t-lg bg-teal-400/60 border-t border-x border-teal-300/60" />
              <span className="text-[9px] font-mono text-teal-300">SPCB</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-14 rounded-t-lg bg-emerald-400/70 border-t border-x border-emerald-300/70" />
              <span className="text-[9px] font-mono text-emerald-300">DISHD</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-8 rounded-t-lg bg-amber-400/50 border-t border-x border-amber-300/50" />
              <span className="text-[9px] font-mono text-amber-300">NOC</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const COLUMN_3: FeatureCardData[] = [
    {
      id: 'autonomous-verification',
      title: 'Autonomous Verification',
      rotation: 'group-hover:rotate-0 -rotate-1.5',
      graphic: (
        <div className="relative w-full h-36 flex items-center justify-center">
          {/* Floating Pill Bubbles cluster (Doraverse style) */}
          <div className="relative w-44 h-32 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-600/30 border border-cyan-400/50 backdrop-blur-xl flex items-center justify-center text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Cpu className="w-6 h-6 text-cyan-300" />
            </div>
            
            <div className="absolute top-1 left-0 px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-mono text-cyan-200 shadow-md">
              Parse
            </div>
            <div className="absolute top-1 right-0 px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-mono text-emerald-200 shadow-md">
              Verify
            </div>
            <div className="absolute bottom-1 left-2 px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-mono text-indigo-200 shadow-md">
              Reason
            </div>
            <div className="absolute bottom-1 right-2 px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-mono text-teal-200 shadow-md">
              Audit
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'joint-inspection',
      title: 'Unified Joint Inspection',
      rotation: 'group-hover:rotate-0 rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex items-center justify-center gap-3">
          {/* Dual Frosted Squircles (Doraverse style) */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/25 backdrop-blur-xl flex flex-col items-center justify-center text-amber-300 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
            <CalendarCheck2 className="w-8 h-8 text-amber-300" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/25 backdrop-blur-xl flex flex-col items-center justify-center text-cyan-300 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
            <Camera className="w-8 h-8 text-cyan-300" />
          </div>
        </div>
      ),
    },
  ];

  const COLUMN_4: FeatureCardData[] = [
    {
      id: 'deterministic-dag',
      title: 'Deterministic DAG Routing',
      rotation: 'group-hover:rotate-0 rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-emerald-400/25 via-teal-500/15 to-transparent border border-emerald-400/40 backdrop-blur-xl flex items-center justify-center text-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
            <GitBranch className="w-10 h-10 text-emerald-300" />
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-300/90">
            <span className="px-1.5 py-0.5 rounded bg-white/10">Inlet</span>
            <span>→</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-bold">Auto DAG</span>
          </div>
        </div>
      ),
    },
    {
      id: 'audit-trails',
      title: 'Cryptographic Audit Vault',
      rotation: 'group-hover:rotate-0 -rotate-1',
      graphic: (
        <div className="relative w-full h-36 flex flex-col items-center justify-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-transparent border border-white/30 backdrop-blur-2xl flex items-center justify-center text-teal-300 shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(45,212,191,0.25)]">
            <Fingerprint className="w-12 h-12 text-teal-300" />
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300/80 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>SHA-256 Verified</span>
          </div>
        </div>
      ),
    },
  ];

  const renderCard = (card: FeatureCardData) => {
    return (
      <div
        key={card.id}
        className={`group relative p-6 rounded-3xl bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-2xl border border-white/20 hover:border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-500 cursor-pointer select-none flex flex-col items-center justify-between min-h-[250px] transform ${card.rotation} hover:scale-[1.04] hover:-translate-y-1 mb-6`}
      >
        {/* Big Central Graphic / Icon Cluster */}
        <div className="w-full flex items-center justify-center my-auto">
          {card.graphic}
        </div>

        {/* Minimal Crisp Title */}
        <div className="pt-2 text-center">
          <h3 className="font-editorial text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
            {card.title}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="features"
      ref={sectionRef}
      className="relative pt-10 sm:pt-14 pb-16 lg:pt-16 lg:pb-24 bg-transparent text-white select-none overflow-hidden"
    >
      
      {/* Background Soft Atmospheric Ambient Glow Fields */}
      <div 
        className="absolute top-1/4 left-1/4 w-[45rem] h-[35rem] rounded-full blur-[160px] pointer-events-none -z-10 opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(14, 139, 178, 0.1) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[42rem] h-[35rem] rounded-full blur-[150px] pointer-events-none -z-10 opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 75%)',
        }}
      />

      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${dynamicTranslateY}px)`,
          opacity: isVisible ? 1 : 0.2,
          transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        
        {/* Section Header with Soft Upward Reveal */}
        <div 
          className="text-center max-w-3xl mx-auto mb-10 space-y-3"
          style={{
            transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Autonomous Regulatory Intelligence
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* STAGGERED CONTINUOUS FLOATING CARD MOSAIC (4 Columns, Dual-Direction)     */}
        {/* ========================================================================= */}
        <div 
          className={`relative h-[600px] sm:h-[660px] overflow-hidden rounded-3xl border border-white/20 bg-black/25 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 h-full">
            
            {/* Column 1: Float Up Fast */}
            <div className="floating-track floating-track-up-fast flex flex-col">
              {[...COLUMN_1, ...COLUMN_1, ...COLUMN_1].map((card, idx) => (
                <React.Fragment key={`c1-${idx}`}>
                  {renderCard(card)}
                </React.Fragment>
              ))}
            </div>

            {/* Column 2: Float Down Fast */}
            <div className="floating-track floating-track-down-fast flex flex-col">
              {[...COLUMN_2, ...COLUMN_2, ...COLUMN_2].map((card, idx) => (
                <React.Fragment key={`c2-${idx}`}>
                  {renderCard(card)}
                </React.Fragment>
              ))}
            </div>

            {/* Column 3: Float Up Slow (Hidden on Mobile) */}
            <div className="floating-track floating-track-up-slow hidden sm:flex flex-col">
              {[...COLUMN_3, ...COLUMN_3, ...COLUMN_3].map((card, idx) => (
                <React.Fragment key={`c3-${idx}`}>
                  {renderCard(card)}
                </React.Fragment>
              ))}
            </div>

            {/* Column 4: Float Down Slow (Hidden on Tablet/Mobile) */}
            <div className="floating-track floating-track-down-slow hidden lg:flex flex-col">
              {[...COLUMN_4, ...COLUMN_4, ...COLUMN_4].map((card, idx) => (
                <React.Fragment key={`c4-${idx}`}>
                  {renderCard(card)}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Fast Action Prompt */}
        <div 
          className={`mt-10 flex items-center justify-center transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            to="/register"
            className="tactile-btn px-7 py-3.5 text-sm font-bold rounded-full text-slate-950 bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 hover:from-white hover:to-cyan-200 border border-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2 group transition-all"
          >
            <span>Launch Clearance Roadmap</span>
            <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};
