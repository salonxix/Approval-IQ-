import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import { Check, Clock, FileText, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const FloatingApprovalCards: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through the 4 steps with smooth transition
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const STAGES = [
    {
      id: 0,
      title: t('hero.card_profile', 'Business Profile'),
      subtitle: t('hero.card_profile_sub', 'Brewery & Distillery · Pune'),
      icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
      iconBg: 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300',
      badgeText: 'RECORDED',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
      statusMsg: 'Statutory parameters recorded',
    },
    {
      id: 1,
      title: t('hero.card_norms', 'Statutory NOCs'),
      subtitle: t('hero.card_norms_sub', 'MPCB CTE, Fire CFO, DISH'),
      icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
      iconBg: 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300',
      badgeText: 'GATED',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/60',
      statusMsg: 'Predecessor conditions locked',
    },
    {
      id: 2,
      title: t('hero.card_docs', 'Evidence Vault'),
      subtitle: t('hero.card_docs_sub', 'OCR Verified & De-duplicated'),
      icon: <FileText className="w-3.5 h-3.5 text-teal-300" />,
      iconBg: 'bg-teal-950/70 border border-teal-500/40 text-teal-200',
      badgeText: 'VERIFIED',
      badgeClass: 'bg-teal-950/80 text-teal-300 border-teal-600/60',
      statusMsg: 'Multi-desk cross-reuse active',
    },
    {
      id: 3,
      title: t('hero.card_review', 'RTS SLA Mandate'),
      subtitle: t('hero.card_review_sub', 'Statutory Decision Tracking'),
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      iconBg: 'bg-amber-950/70 border border-amber-500/40 text-amber-300',
      badgeText: 'TRACKING',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-600/60',
      statusMsg: 'Statutory countdown running',
    },
  ];

  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[92%] max-w-[380px] sm:max-w-[420px] transition-transform duration-500 ease-out"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-[#05232C]/90 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-cyan-400/30 space-y-3.5 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-cyan-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-100">
              {t('hero.card_engine', 'Clearance Engine')}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-300 inline mr-0.5 animate-pulse" />
            {t('hero.card_single_window', 'Single Window')}
          </span>
        </div>

        {/* Dynamic Progress Bar Tracer */}
        <div className="grid grid-cols-4 gap-1.5 py-0.5">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                s.id === activeStep
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-y-125'
                  : s.id < activeStep
                  ? 'bg-emerald-500'
                  : 'bg-cyan-950/80 hover:bg-cyan-900'
              }`}
              title={`Stage ${s.id + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Step Rows */}
        <div className="space-y-2">
          {STAGES.map((s) => {
            const isHighlighted = s.id === activeStep;
            return (
              <div
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isHighlighted
                    ? 'bg-[#0A333F]/90 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-[1.02] translate-x-1'
                    : 'bg-[#062833]/60 border-cyan-900/40 hover:bg-[#08303C]/80 hover:border-cyan-700/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${isHighlighted ? 'scale-110 shadow-sm' : ''}`}>
                    {s.icon}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      <span>{s.title}</span>
                      {isHighlighted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-200/70 truncate">
                      {isHighlighted ? s.statusMsg : s.subtitle}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 transition-all ${s.badgeClass} ${isHighlighted ? 'shadow-sm' : 'opacity-80'}`}>
                  {s.badgeText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Info with Dynamic Active Milestone */}
        <div className="pt-2.5 border-t border-cyan-900/60 flex items-center justify-between text-[11px] font-mono text-cyan-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold">{STAGES[activeStep]!.title}</span>
          </div>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span>Deterministic</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </span>
        </div>

      </div>
    </div>
  );
};
