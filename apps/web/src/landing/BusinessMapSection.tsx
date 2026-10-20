import React, { useState } from 'react';
import { ApprovalIntelligenceNetworkMap } from './ApprovalIntelligenceNetworkMap';
import { MappedEntity } from './geospatialDataService';
import { ShieldCheck, CheckCircle2, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessMapSection: React.FC = () => {
  const [inspectedEntity, setInspectedEntity] = useState<MappedEntity | null>(null);

  return (
    <section id="business-map" className="py-14 sm:py-20 bg-[#04161F] text-white relative overflow-hidden border-t border-cyan-500/20">
      {/* Background ambient radial glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Content: Clean Minimal Heading Only */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            See the approval landscape.
          </h2>
        </div>

        {/* Primary Visual Centerpiece: The Intelligent Network Map (Centered, 60-70% visual weight) */}
        <div className="w-full flex justify-center max-w-[1040px] mx-auto">
          <ApprovalIntelligenceNetworkMap
            onExploreEntity={(entity) => setInspectedEntity(entity)}
            className="w-full"
          />
        </div>

      </div>

      {/* Slide-over Verified Entity Deep Dive Drawer */}
      {inspectedEntity && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-end p-4 sm:p-6 animate-fade-in"
          onClick={() => setInspectedEntity(null)}
        >
          <div
            className="w-full max-w-md bg-[#06212B] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white animate-slide-left relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-ocean-700/80 pb-4">
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
                className="p-1.5 rounded-full hover:bg-ocean-800 text-ocean-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-ocean-950/80 border border-ocean-700/60 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Nodal Authority</span>
                <span className="font-bold text-white text-sm truncate" title={inspectedEntity.authority}>
                  {inspectedEntity.authority}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ocean-950/80 border border-ocean-700/60 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Approval Pathways</span>
                <span className="font-bold text-cyan-300 text-sm font-mono">{inspectedEntity.pathwaysCount} active lines</span>
              </div>

              <div className="p-3 rounded-2xl bg-ocean-950/80 border border-ocean-700/60 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Dependencies</span>
                <span className="font-bold text-amber-300 text-sm font-mono">{inspectedEntity.dependenciesCount} prerequisites</span>
              </div>

              <div className="p-3 rounded-2xl bg-ocean-950/80 border border-ocean-700/60 flex flex-col gap-1">
                <span className="text-[11px] text-ocean-300">Status</span>
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {inspectedEntity.status}
                </span>
              </div>
            </div>

            {/* Primary Prerequisite Clearances */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-mono text-ocean-300 uppercase tracking-wider font-bold">
                Primary Statutory Clearance
              </span>
              <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-100 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="font-medium text-xs leading-snug">{inspectedEntity.topClearance}</span>
              </div>
            </div>

            {/* Source Provenance Citation */}
            <div className="space-y-1.5 text-xs p-3.5 rounded-2xl bg-ocean-950/70 border border-ocean-800">
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
            <div className="pt-2">
              <Link
                to={`/register?state=${inspectedEntity.stateCode}&city=${encodeURIComponent(inspectedEntity.city)}&industry=${encodeURIComponent(inspectedEntity.industry)}`}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
              >
                <span>Initiate Statutory Docket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
