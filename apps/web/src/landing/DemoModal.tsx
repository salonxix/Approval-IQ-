import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
} from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimulationPreset {
  id: string;
  name: string;
  location: string;
  category: string;
  statutes: string[];
  clearances: number;
  verifiedDocs: string;
  timeline: string;
  logs: { text: string; color: string }[];
}

const PRESETS: SimulationPreset[] = [
  {
    id: 'brewery',
    name: 'Craft Microbrewery',
    location: 'Bengaluru, Karnataka',
    category: 'Orange Category (35.2 PI)',
    statutes: ['FSSAI Act 2006', 'Water Act 1974', 'Air Act 1981', 'Karnataka Excise Rules 1967'],
    clearances: 8,
    verifiedDocs: '100% Pre-Audited',
    timeline: '~35 Days',
    logs: [
      { text: '> Initializing regulatory graph for: Craft Microbrewery (Bengaluru, Karnataka)', color: 'text-cyan-300' },
      { text: '> Querying central statutes: FSSAI Act 2006, Water Act 1974, Air Act 1981...', color: 'text-slate-300' },
      { text: '> Querying state statutes: Karnataka Excise (Brewery) Rules 1967...', color: 'text-slate-300' },
      { text: '> [OK] Identified 8 mandatory clearances, 4 pre-audit checklists, 2 fast-track exemptions.', color: 'text-emerald-400' },
      { text: '> Generated unified single-window submission pipeline in 1.2s.', color: 'text-amber-300' },
    ],
  },
  {
    id: 'pharma',
    name: 'Pharma Formulation Unit',
    location: 'Hyderabad, Telangana',
    category: 'Red Category (62.8 PI)',
    statutes: ['Drugs & Cosmetics Act 1940', 'Factories Act 1948', 'TSPCB CTE Guidelines'],
    clearances: 14,
    verifiedDocs: '100% Pre-Audited',
    timeline: '~48 Days',
    logs: [
      { text: '> Initializing regulatory graph for: Pharma Formulation Unit (Hyderabad, Telangana)', color: 'text-cyan-300' },
      { text: '> Querying central statutes: Drugs & Cosmetics Act 1940, Factories Act 1948...', color: 'text-slate-300' },
      { text: '> Querying state statutes: Telangana SPCB Effluent Standards 2021...', color: 'text-slate-300' },
      { text: '> [OK] Resolved 14 clearances across DISHD, TSPCB, CFO Fire NOC, and Drug Control.', color: 'text-emerald-400' },
      { text: '> Parallel execution graph constructed. Zero circular prerequisite deadlocks.', color: 'text-amber-300' },
    ],
  },
  {
    id: 'solar',
    name: 'Grid Solar Power (25MW)',
    location: 'Jodhpur, Rajasthan',
    category: 'White Category (Exempt CTE)',
    statutes: ['Electricity Act 2003', 'Rajasthan Solar Policy', 'Revenue Land Conversion'],
    clearances: 5,
    verifiedDocs: '100% Pre-Audited',
    timeline: '~18 Days',
    logs: [
      { text: '> Initializing regulatory graph for: 25MW Grid Solar Plant (Jodhpur, Rajasthan)', color: 'text-cyan-300' },
      { text: '> Evaluating environmental categorization: White Category (P.I. < 20).', color: 'text-slate-300' },
      { text: '> Fast-track waiver triggered: SPCB CTE exempt under Green Energy Corridor.', color: 'text-emerald-400' },
      { text: '> [OK] Dispatched DISHD, CEIG Electrical Inspection, and Discom PPA clearance.', color: 'text-cyan-300' },
      { text: '> Automated deemed approval countdown timer initialized (18 calendar days).', color: 'text-amber-300' },
    ],
  },
];

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('brewery');

  if (!isOpen) return null;

  const currentPreset: SimulationPreset = PRESETS.find((p) => p.id === selectedPresetId) ?? PRESETS[0]!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      {/* Dark Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-[#041B26] border border-cyan-500/30 rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.15)] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#02131C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
              ▲
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-editorial tracking-tight">
                ApprovalIQ Interactive Product Preview
              </h3>
              <p className="text-[11px] text-cyan-200/70 font-sans">
                Live Simulation of the Regulatory Intelligence Engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Preset Selector Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Select Sample Project:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESETS.map((preset) => {
                const isActive = preset.id === currentPreset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terminal Console Simulation */}
          <div className="rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-[#020D14] p-4 sm:p-5 font-mono text-xs space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-sans text-xs">ApprovalIQ Engine Simulation v2.4</span>
              </div>
              <span className="text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {currentPreset.category}
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px] leading-relaxed">
              {currentPreset.logs.map((log, index) => (
                <div key={index} className={log.color}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center justify-center space-y-0.5">
              <div className="flex items-center gap-1.5 text-cyan-300 text-lg sm:text-xl font-bold font-sans">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span>{currentPreset.clearances} Clearances</span>
              </div>
              <div className="text-[11px] font-mono text-white/50">Auto-Mapped Directives</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-300 text-lg sm:text-xl font-bold font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{currentPreset.verifiedDocs}</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-200/60">Statutory Formats</div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center flex flex-col items-center justify-center space-y-0.5">
              <div className="flex items-center gap-1.5 text-cyan-200 text-lg sm:text-xl font-bold font-sans">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{currentPreset.timeline}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-200/60">Autonomous Delivery</div>
            </div>

          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#02131C] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/60 text-center sm:text-left font-sans">
            Ready to explore the live dashboard with your own company profile?
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
            >
              Close
            </button>
            <Link
              to="/register"
              onClick={onClose}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-white hover:to-cyan-200 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
