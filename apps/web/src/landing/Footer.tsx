import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useLanguage } from '../i18n';

interface FooterProps {
  onOpenDemo?: () => void;
}

const FLOW_STEPS = [
  { id: 'request', label: 'Request' },
  { id: 'verify', label: 'Verify' },
  { id: 'route', label: 'Route' },
  { id: 'approve', label: 'Approve' },
  { id: 'audit', label: 'Audit' },
];

export const Footer: React.FC<FooterProps> = ({ onOpenDemo }) => {
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionScroll = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Subtle Approval Engine Step Pulse Cycle (Changes every 2.4s)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-transparent text-white border-t border-white/10 overflow-hidden select-none">
      
      {/* 1. Subtle Animated Cyan Light Sweep on Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[1px] opacity-75" />

      {/* Soft Ambient Radial Background Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60rem] h-[28rem] rounded-full blur-[140px] pointer-events-none -z-10 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(14, 116, 144, 0.1) 50%, transparent 80%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10 space-y-14">
        
        {/* ========================================================================= */}
        {/* COMPACT CTA STRIP                                                         */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl border border-white/15 bg-black/35 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-center md:text-left max-w-xl">
            <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {t('footer.cta_title', 'Ready to simplify your approval workflows?')}
            </h3>
          </div>

          <div className="flex items-center gap-3.5 shrink-0 flex-wrap justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-white hover:to-cyan-200 text-slate-950 text-sm sm:text-base font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t('footer.get_started', 'Get Started')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {onOpenDemo ? (
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-semibold border border-white/15 hover:border-cyan-400/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t('footer.book_demo', 'Book a Demo')}</span>
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-semibold border border-white/15 hover:border-cyan-400/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t('footer.book_demo', 'Book a Demo')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 MAIN FOOTER NAVIGATION COLUMNS                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-2">
          
          {/* 1. BRAND AREA (Span 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md">
                ▲
              </div>
              <span className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-tight">
                Approval<span className="text-cyan-400">IQ</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-sm">
              {t('footer.brand_desc', 'Intelligent approval workflows built for speed, verification, and complete traceability.')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="ApprovalIQ on LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="ApprovalIQ on X / Twitter"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com/shreysherikar/Approval-IQ"
                target="_blank"
                rel="noreferrer"
                aria-label="ApprovalIQ on GitHub"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@approvaliq.com"
                aria-label="Email ApprovalIQ"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* 2. PRODUCT COLUMN */}
          <div className="space-y-3.5">
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
              {t('footer.col_product', 'Product')}
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base font-sans">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleSectionScroll(e, 'hero')}
                  className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.overview', 'Overview')}</span>
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  onClick={(e) => handleSectionScroll(e, 'workflow')}
                  className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.workflow', 'Workflow')}</span>
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleSectionScroll(e, 'features')}
                  className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.features', 'Features')}</span>
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  onClick={(e) => handleSectionScroll(e, 'workflow')}
                  className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.how_it_works', 'How It Works')}</span>
                </a>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.security', 'Security')}</span>
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.integrations', 'Integrations')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. COMPANY COLUMN */}
          <div className="space-y-3.5">
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
              {t('footer.col_company', 'Company')}
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base font-sans">
              <li>
                <Link to="/about" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.about', 'About')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.contact', 'Contact')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.careers', 'Careers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                  <span>{t('footer.partners', 'Partners')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. RESOURCES & LEGAL COLUMN */}
          <div className="space-y-5">
            
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                {t('footer.col_resources', 'Resources')}
              </h4>
              <ul className="space-y-2.5 text-sm sm:text-base font-sans">
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => handleSectionScroll(e, 'faq')}
                    className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                    <span>{t('footer.faq', 'FAQ')}</span>
                  </a>
                </li>
                <li>
                  <Link to="/projects" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                    <span>{t('footer.docs', 'Documentation')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="group inline-flex items-center text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:translate-x-1">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 rounded-full mr-0 group-hover:mr-2 transition-all duration-200" />
                    <span>{t('footer.support', 'Support')}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-[11px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {t('footer.col_legal', 'Legal')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-sans">
                <li>
                  <Link to="/about" className="text-slate-300 hover:text-cyan-300 transition-colors">
                    {t('footer.privacy', 'Privacy Policy')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-300 hover:text-cyan-300 transition-colors">
                    {t('footer.terms', 'Terms of Service')}
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* SPECIAL APPROVALIQ DETAIL: CONTINUOUS FLOW INDICATOR TICKER               */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-200 font-semibold">{t('footer.engine_state', 'Engine State:')}</span>
            
            {/* Sequential Flow Indicator */}
            <div className="flex items-center gap-2 ml-1">
              {FLOW_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;
                return (
                  <React.Fragment key={step.id}>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-500 ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-105'
                          : isPassed
                          ? 'text-cyan-300 bg-white/5'
                          : 'text-slate-400 bg-white/[0.02]'
                      }`}
                    >
                      {step.label}
                    </span>
                    {idx < FLOW_STEPS.length - 1 && (
                      <span className="text-slate-500 text-xs">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM BAR: COPYRIGHT & POLICIES                                          */}
        {/* ========================================================================= */}
        <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono text-slate-400">
          <div>
            {t('footer.all_rights', '© 2026 ApprovalIQ. All rights reserved.')}
          </div>

          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-cyan-300 transition-colors">
              {t('footer.privacy', 'Privacy')}
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-cyan-300 transition-colors">
              {t('footer.terms', 'Terms')}
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-cyan-300 transition-colors">
              {t('footer.cookies', 'Cookies')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
