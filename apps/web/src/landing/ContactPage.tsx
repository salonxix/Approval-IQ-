import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgressBar } from './ScrollProgressBar';
import { DemoModal } from './DemoModal';
import { useLanguage } from '../i18n';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'founder' | 'authority'>('authority');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Brewery & Distilleries',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const isFounder = activeMode === 'founder';
  const isScrolledPastHero = scrollY > 220;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden transition-all duration-700 ease-out select-none"
      style={{
        background: isFounder
          ? 'linear-gradient(135deg, #06212B 0%, #0E4B5E 45%, #15808B 80%, #22D3EE 100%)'
          : 'linear-gradient(135deg, #0A2F3D 0%, #0E6B7A 40%, #B45309 85%, #F59E0B 100%)',
      }}
    >
      <ScrollProgressBar />

      {/* Floating Persistent Mode Switcher Pill (Matching Homepage) */}
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
            top: '2%',
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
            top: '35%',
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
            top: '70%',
            background: isFounder
              ? 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(14, 139, 178, 0.2) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 75%)',
            transform: `translate(${mousePos.x * 0.9}px, ${mousePos.y * 0.9}px)`,
          }}
        />
      </div>

      <main className="flex-1 pt-24 sm:pt-28 pb-20 space-y-12 sm:space-y-16 relative z-10">
        
        {/* ========================================================================= */}
        {/* HEADER                                                                    */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
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

          <h1
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-md animate-slide-up pt-2"
            style={{ animationDelay: '100ms' }}
          >
            {t('contact_page.title_1', "Let's Discuss Your")}{' '}
            <span
              className={`text-transparent bg-clip-text ${
                isFounder
                  ? 'bg-gradient-to-r from-cyan-300 via-teal-100 to-white'
                  : 'bg-gradient-to-r from-amber-300 via-yellow-100 to-white'
              }`}
            >
              {t('contact_page.title_2', 'Regulatory Strategy.')}
            </span>
          </h1>

        </section>

        {/* ========================================================================= */}
        {/* CONTACT FORM CONTAINER (Centered Showcase)                                */}
        {/* ========================================================================= */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-6 sm:p-10 border border-white/30 backdrop-blur-2xl animate-slide-up transition-all duration-300 hover:border-white/50"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              animationDelay: '200ms',
            }}
          >
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight drop-shadow">
              {t('contact_page.form_title', 'Send Us an Inquiry')}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mb-8 font-sans">
              {t('contact_page.form_subtitle', 'Fill in your project details and our statutory advisory team will schedule a tailored walkthrough.')}
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-white/20 border border-white/40 text-center space-y-4 animate-fade-in backdrop-blur-xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
                  {t('contact_page.success_title', 'Inquiry Received Successfully!')}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto leading-relaxed font-sans">
                  {t('contact_page.success_desc', 'Thank you. An ApprovalIQ regulatory solutions advisor will reach out within 4 business hours.')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', company: '', industry: 'Brewery & Distilleries', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-white hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  {t('contact_page.send_another', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                      {t('contact_page.full_name', 'Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-4 py-3 rounded-xl border border-white/25 bg-black/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:bg-black/30 transition-all font-sans backdrop-blur-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                      {t('contact_page.work_email', 'Work Email *')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@enterprise.in"
                      className="w-full px-4 py-3 rounded-xl border border-white/25 bg-black/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:bg-black/30 transition-all font-sans backdrop-blur-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                      {t('contact_page.phone', 'Phone Number')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-white/25 bg-black/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:bg-black/30 transition-all font-sans backdrop-blur-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                      {t('contact_page.company', 'Company / Organization')}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Singhania Bio-Foods Ltd."
                      className="w-full px-4 py-3 rounded-xl border border-white/25 bg-black/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:bg-black/30 transition-all font-sans backdrop-blur-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                    {t('contact_page.industry_sector', 'Target Industry Sector')}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-white/25 bg-[#06212B] text-sm text-white focus:outline-none focus:border-cyan-300 transition-all font-sans"
                  >
                    <option value="Brewery & Distilleries">Brewery &amp; Distilleries</option>
                    <option value="Food Processing">Food Processing &amp; FMCG</option>
                    <option value="Chemical Manufacturing">Chemical &amp; Hazardous Materials</option>
                    <option value="Pharmaceuticals & Biotech">Pharmaceuticals &amp; Life Sciences</option>
                    <option value="Logistics & Warehousing">Logistics, Cold Storage &amp; Warehousing</option>
                    <option value="Clean Energy & Solar">Renewable Energy &amp; Solar Parks</option>
                    <option value="Imports & Trading">Imports, Exports &amp; Customs (ICEGATE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/90 uppercase tracking-wider mb-1.5">
                    {t('contact_page.query', 'Project Overview / Query *')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project location, proposed capacity, or any specific compliance queries..."
                    className="w-full px-4 py-3 rounded-xl border border-white/25 bg-black/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:bg-black/30 transition-all font-sans backdrop-blur-md"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-white hover:to-cyan-200 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t('contact_page.submit_btn', 'Submit Advisory Request')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Reusable Enterprise Footer */}
      <Footer onOpenDemo={() => setIsDemoOpen(true)} />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

    </div>
  );
};
