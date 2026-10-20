import React, { useState, useEffect } from 'react';
import { ScrollProgressBar } from './ScrollProgressBar';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FloatingFeatureCardsSection } from './FloatingFeatureCardsSection';
import { WorkflowAnimationSection } from './WorkflowAnimationSection';
import { ApprovalIntelligenceMapSection } from './ApprovalIntelligenceMapSection';
import { Footer } from './Footer';
import { DemoModal } from './DemoModal';
import { CommandPaletteModal } from './CommandPaletteModal';

export const LandingPage: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'founder' | 'authority'>('authority');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isFounder = activeMode === 'founder';
  const isScrolledPastHero = scrollY > 220;

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden transition-all duration-700 ease-out"
      style={{
        background: isFounder
          ? 'linear-gradient(135deg, #06212B 0%, #0E4B5E 45%, #15808B 80%, #22D3EE 100%)'
          : 'linear-gradient(135deg, #0A2F3D 0%, #0E6B7A 40%, #B45309 85%, #F59E0B 100%)',
      }}
    >
      {/* Top Scroll Reading Progress Line */}
      <ScrollProgressBar />

      {/* Floating Persistent Mode Switcher Pill (Hovers at bottom HUD when scrolled down) */}
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
            Founder
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
            Authority
          </button>
        </div>
      </div>

      {/* Transparent Integrated Glassmorphism Navigation Bar */}
      <Navbar
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      {/* Main Full-Screen Landing Page Experience */}
      <main className="flex-1 w-full h-full bg-transparent">
        <HeroSection
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          onOpenDemo={() => setIsDemoOpen(true)}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
        />

        {/* Staggered Floating Feature Cards Mosaic Section */}
        <FloatingFeatureCardsSection />

        {/* Autonomous Clearance Workflow Pipeline Section */}
        <WorkflowAnimationSection />

        {/* Approval Intelligence Map (Interactive Decision & Knowledge Graph FAQ) */}
        <ApprovalIntelligenceMapSection onOpenDemo={() => setIsDemoOpen(true)} />

        {/* Enterprise SaaS Footer */}
        <Footer onOpenDemo={() => setIsDemoOpen(true)} />
      </main>

      {/* Interactive Demo Preview Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Command Palette (⌘K) Modal */}
      <CommandPaletteModal
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenDemo={() => setIsDemoOpen(true)}
      />
    </div>
  );
};
