import React, { useRef } from 'react';
import { Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { aiSimulationApi } from '../api-client';
import { useLanguage } from '../i18n';

interface HeroSectionProps {
  activeMode: 'founder' | 'authority';
  setActiveMode: React.Dispatch<React.SetStateAction<'founder' | 'authority'>>;
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeMode,
  setActiveMode,
}) => {
  const { t } = useLanguage();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic AI synthesis for statutory lens / hero simulation
  const { data: lensAi } = useQuery({
    queryKey: ['ai-lens-analysis-hero', activeMode],
    queryFn: () => aiSimulationApi.analyzeLens({ mode: activeMode }),
    staleTime: 60_000,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const isFounder = activeMode === 'founder';

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col justify-center select-none bg-transparent pt-20 sm:pt-22 pb-10 sm:pb-14 px-4 sm:px-8 md:px-14 lg:px-20 space-y-5 sm:space-y-6"
    >
      {/* ========================================================================= */}
      {/* FULL-SCREEN ANIMATED RADIANT GLOWING COLOR SPHERES (Mouse Parallax)       */}
      {/* ========================================================================= */}
      <div
        className="absolute w-[45rem] sm:w-[60rem] h-[45rem] sm:h-[60rem] rounded-full blur-[130px] transition-all duration-700 ease-out pointer-events-none -z-0"
        style={{
          left: isFounder ? '15%' : '50%',
          top: '10%',
          background: isFounder
            ? 'radial-gradient(circle, rgba(56, 172, 204, 0.45) 0%, rgba(14, 139, 178, 0.2) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(217, 119, 6, 0.25) 50%, transparent 75%)',
          transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`,
        }}
      />
      <div
        className="absolute w-[50rem] sm:w-[65rem] h-[50rem] sm:h-[65rem] rounded-full blur-[150px] transition-all duration-700 ease-out pointer-events-none -z-0"
        style={{
          right: isFounder ? '10%' : '45%',
          bottom: '10%',
          background: isFounder
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.18) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(14, 139, 178, 0.2) 50%, transparent 75%)',
          transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)`,
        }}
      />

      {/* ============================================================ */}
      {/* 1. TOP BAR: Mode Switcher (FOUNDER <-> AUTHORITY)            */}
      {/* ============================================================ */}
      <div className="relative z-20 flex flex-col items-center justify-center space-y-3 pt-0">
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

      {/* ============================================================ */}
      {/* 2. CENTER FLOATING ULTRA-FROSTED GLASS CAPSULE              */}
      {/* ============================================================ */}
      <div className="relative z-20 flex items-center justify-center pt-8 sm:pt-12">
        <div
          onClick={() => setActiveMode(isFounder ? 'authority' : 'founder')}
          className="w-full max-w-3xl rounded-3xl border border-white/40 shadow-2xl backdrop-blur-2xl flex items-center p-6 sm:p-8 transition-transform duration-500 ease-out cursor-pointer hover:scale-[1.01]"
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          {/* Luminous Inner Glass Content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 text-white w-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/70 flex items-center justify-center text-white shadow-lg shrink-0">
              {isFounder ? (
                <ShieldCheck className="w-7 h-7 text-cyan-200 animate-pulse" />
              ) : (
                <Zap className="w-7 h-7 text-amber-300 animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {isFounder ? t('hero.nodal_gateway', 'Nodal Gateway') : 'ApprovalIQ'}
                </h2>
                {lensAi?.averageTimeReductionPercentage && (
                  <span className="text-[11px] font-mono font-bold bg-white/20 border border-white/40 px-2.5 py-0.5 rounded-full text-white">
                    -{lensAi.averageTimeReductionPercentage}% SLA
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-white/95 font-sans drop-shadow-sm leading-relaxed">
                {isFounder
                  ? t('hero.founder_sub', 'Deterministic graph routing automates 42 clearances with pre-verified single-dossier reuse.')
                  : t('hero.authority_sub', 'An autonomous verification layer where intelligent agents inspect, reason, coordinate, and audit in parallel.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CLASSY MINIMALIST FROSTED GLASS START NOW BUTTON          */}
      {/* ============================================================ */}
      <div className="relative z-20 flex items-center justify-center pt-10 sm:pt-14">
        <Link
          to="/login"
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-2xl border border-white/30 hover:border-white/60 text-white font-sans text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.03] overflow-hidden select-none"
        >
          {/* Elegant Animated Light Sheen Sweep across button */}
          <div
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-sheen-sweep"
          />

          {/* Small Living Indicator Pulse */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFounder ? 'bg-cyan-300' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isFounder ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
          </span>

          {/* Button Text */}
          <span className="relative text-white font-medium tracking-wide">
            {t('hero.start_now', 'Start Now')}
          </span>

          {/* Arrow Icon */}
          <ArrowRight className="relative w-4 h-4 text-white/90 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

    </section>
  );
};
