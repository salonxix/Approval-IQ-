import React, { useState, useEffect } from 'react';
import { ScrollProgressBar } from './ScrollProgressBar';
import { Navbar } from './Navbar';
import { DemoModal } from './DemoModal';
import { CommandPaletteModal } from './CommandPaletteModal';
import { ApprovalIntelligenceNetworkMap } from './ApprovalIntelligenceNetworkMap';
import { MappedEntity } from './geospatialDataService';
import { ShieldCheck, CheckCircle2, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessMapPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'founder' | 'authority'>('authority');
  const [scrollY, setScrollY] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [inspectedEntity, setInspectedEntity] = useState<MappedEntity | null>(null);

  const isFounder = activeMode === 'founder';
  const isScrolledPastHero = scrollY > 150;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden transition-all duration-700 ease-out"
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

      {/* Transparent Glass Navigation Bar Matching Home Page */}
      <Navbar
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      {/* Main Geospatial Intelligence Centerpiece */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full gap-6 pt-24 sm:pt-28">
        
        {/* Top Content: Clean Minimal Heading Only */}
        <div className="text-center max-w-2xl mx-auto pt-2 sm:pt-4 animate-fade-in">
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
            See the approval landscape.
          </h1>
        </div>

        {/* Primary Visual Centerpiece: The Intelligent Network Map */}
        <div className="w-full flex-1 flex flex-col items-center justify-center max-w-[1260px]">
          <ApprovalIntelligenceNetworkMap
            onExploreEntity={(entity) => setInspectedEntity(entity)}
            className="w-full backdrop-blur-2xl bg-black/40 border border-white/20"
          />
        </div>

      </main>

      {/* Slide-over Verified Entity Deep Dive Drawer */}
      {inspectedEntity && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-end p-4 sm:p-6 animate-fade-in"
          onClick={() => setInspectedEntity(null)}
        >
          <div
            className="w-full max-w-md bg-[#06212B]/95 border border-cyan-400/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white animate-slide-left relative overflow-hidden backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {inspectedEntity.state} • {inspectedEntity.category}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight mt-1">
                  {inspectedEntity.name}
                </h3>
                <div className="text-xs text-ocean-200 mt-0.5">{inspectedEntity.industry}</div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedEntity(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-ocean-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/15 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Nodal Authority</span>
                <span className="font-bold text-white text-sm truncate" title={inspectedEntity.authority}>
                  {inspectedEntity.authority}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/15 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Approval Pathways</span>
                <span className="font-bold text-cyan-300 text-sm font-mono">{inspectedEntity.pathwaysCount} active lines</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/15 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Dependencies</span>
                <span className="font-bold text-amber-300 text-sm font-mono">{inspectedEntity.dependenciesCount} prerequisites</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/15 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Status</span>
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {inspectedEntity.status}
                </span>
              </div>
            </div>

            {/* Primary Prerequisite Clearances */}
            <div className="relative z-10 space-y-2 text-xs">
              <span className="text-[11px] font-mono text-ocean-300 uppercase tracking-wider font-bold">
                Primary Statutory Clearance
              </span>
              <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-100 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="font-medium text-xs leading-snug">{inspectedEntity.topClearance}</span>
              </div>
            </div>

            {/* Source Provenance Citation */}
            <div className="relative z-10 space-y-1.5 text-xs p-3.5 rounded-2xl bg-white/[0.06] border border-white/15">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ocean-300 font-mono">Public Source Register:</span>
                <span className="font-mono text-ocean-400">Verified {inspectedEntity.lastVerified}</span>
              </div>
              <div className="font-semibold text-cyan-300 truncate">{inspectedEntity.source}</div>
              <a
                href={inspectedEntity.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-ocean-300 hover:text-cyan-300 inline-flex items-center gap-1 font-mono pt-1"
              >
                <span>{inspectedEntity.sourceUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Action CTA */}
            <div className="relative z-10 pt-2">
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
              >
                <span>Initiate Statutory Docket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

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
