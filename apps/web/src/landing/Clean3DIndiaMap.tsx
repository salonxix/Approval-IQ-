import React, { useState } from 'react';
import { CityMarkerData } from './RealIndiaLeafletMap';
import { MapPin, Sparkles, Building2, ShieldCheck, Clock } from 'lucide-react';

interface Clean3DIndiaMapProps {
  cities: CityMarkerData[];
  selectedCityId: string | null;
  selectedStateCode: string | null;
  onSelectCity: (city: CityMarkerData) => void;
  domainName: string;
}

// Normalized coordinate map for the 3D Isometric extruded India projection (percentages: x%, y%)
const ISOMETRIC_CITY_COORDS: Record<string, { x: number; y: number; labelPos?: 'top' | 'bottom' | 'left' | 'right' }> = {
  // Northern India
  baddi: { x: 38.5, y: 22.5, labelPos: 'top' },
  ludhiana: { x: 36.0, y: 24.5, labelPos: 'left' },
  delhi_ncr: { x: 39.5, y: 29.5, labelPos: 'right' },
  noida: { x: 41.5, y: 31.0, labelPos: 'right' },
  jaipur: { x: 33.5, y: 34.5, labelPos: 'left' },

  // Western India (Gujarat)
  ahmedabad: { x: 24.0, y: 41.5, labelPos: 'left' },
  vadodara: { x: 27.5, y: 44.5, labelPos: 'right' },
  bharuch: { x: 25.0, y: 47.5, labelPos: 'left' },
  surat: { x: 26.5, y: 50.5, labelPos: 'left' },

  // Central India
  indore: { x: 38.0, y: 46.5, labelPos: 'top' },
  nagpur: { x: 45.0, y: 48.5, labelPos: 'right' },

  // Western India (Maharashtra)
  nashik: { x: 31.5, y: 51.5, labelPos: 'left' },
  aurangabad: { x: 36.5, y: 52.5, labelPos: 'right' },
  mumbai: { x: 28.5, y: 54.5, labelPos: 'left' },
  pune: { x: 32.5, y: 57.5, labelPos: 'left' },

  // Eastern India
  kolkata: { x: 60.5, y: 45.0, labelPos: 'right' },
  kalinganagar: { x: 55.5, y: 51.5, labelPos: 'right' },

  // Southern India
  visakhapatnam: { x: 52.5, y: 58.0, labelPos: 'right' },
  hyderabad: { x: 42.5, y: 59.5, labelPos: 'right' },
  goa: { x: 31.0, y: 65.5, labelPos: 'left' },
  sricity: { x: 45.5, y: 68.5, labelPos: 'right' },
  bengaluru: { x: 38.5, y: 70.5, labelPos: 'left' },
  hosur: { x: 40.5, y: 72.5, labelPos: 'right' },
  mysuru: { x: 35.5, y: 73.5, labelPos: 'left' },
  chennai: { x: 45.0, y: 73.0, labelPos: 'right' },
  coimbatore: { x: 37.0, y: 77.5, labelPos: 'left' },
  tirupur: { x: 39.0, y: 78.5, labelPos: 'right' },
  kochi: { x: 35.5, y: 81.5, labelPos: 'left' },
};

export const Clean3DIndiaMap: React.FC<Clean3DIndiaMapProps> = ({
  cities,
  selectedCityId,
  selectedStateCode,
  onSelectCity,
  domainName,
}) => {
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high_volume' | 'express_sla'>('all');

  // Filter cities based on quick filter toggle
  const visibleCities = cities.filter((city) => {
    if (activeFilter === 'high_volume') return city.count > 120;
    if (activeFilter === 'express_sla') return city.avgClearanceDays <= 28;
    return true;
  });

  const selectedCity =
    cities.find((c) => c.id === selectedCityId) ||
    cities[0] || {
      id: 'national',
      name: 'National Industrial Overview',
      stateCode: 'IN',
      stateName: 'India',
      lat: 20.5937,
      lng: 78.9629,
      description: 'National Industrial Corridor',
      stateAuthority: 'Invest India',
      environmentalZoning: 'Various',
      powerGrid: 'National Grid',
      connectivity: 'Multi-Modal Logistics',
      incentiveScheme: 'PLI Schemes',
      industrialParks: ['National Corridors'],
      avgClearanceDays: 30,
      topClearances: ['Central CTE', 'State Clearances'],
      count: 0,
    };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#051C26] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl">
      {/* Top Floating Glassmorphism Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Badge: Reference UI Aesthetic matching user's spec */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#072430]/90 border border-cyan-500/50 backdrop-blur-md shadow-lg shadow-cyan-950/40">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
              [3D Clean Map View]
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#04161F]/90 border border-cyan-700/50 text-[11px] font-mono text-cyan-200">
            <span>⌘K</span>
            <span className="text-ocean-300">Quick Select</span>
          </div>
        </div>

        {/* Right Badge: Filters */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#072430]/90 p-1 rounded-xl border border-cyan-500/40 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold shadow'
                : 'text-ocean-200 hover:text-white'
            }`}
          >
            All Clusters ({cities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('high_volume')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'high_volume'
                ? 'bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold shadow'
                : 'text-ocean-200 hover:text-white'
            }`}
          >
            🔥 High Volume
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('express_sla')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'express_sla'
                ? 'bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold shadow'
                : 'text-ocean-200 hover:text-white'
            }`}
          >
            ⚡ Fast RTS SLA (≤28d)
          </button>
        </div>
      </div>

      {/* Main 3D Studio Canvas Area */}
      <div className="relative flex-1 w-full min-h-[580px] flex items-center justify-center p-3 sm:p-6 select-none bg-gradient-to-b from-[#06212B] via-[#041822] to-[#031017]">
        {/* Soft Background Radial Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-ocean-900/10 to-transparent pointer-events-none" />

        {/* Clean Studio Map Card (Matching the Reference Photo with Rounded Corners and Pure Aesthetic) */}
        <div className="relative w-full max-w-[760px] aspect-[1/1.08] sm:aspect-[1/1.02] flex items-center justify-center rounded-[2.5rem] p-2 sm:p-4 bg-gradient-to-b from-white/95 via-[#f6fbfe] to-[#e8f4fa] shadow-[0_25px_60px_-15px_rgba(4,22,31,0.7),0_0_0_1px_rgba(255,255,255,0.8)] overflow-hidden transition-transform duration-500">
          
          {/* Subtle Studio Corner Lighting */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

          {/* Luxury Crown Tag in top left (matching reference) */}
          <div className="absolute top-4 left-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/80 text-amber-400 shadow-md backdrop-blur-sm">
            <span className="text-sm">👑</span>
          </div>

          {/* Sector Badge Top Right */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/90 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold shadow-md">
            <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
            <span>{domainName}</span>
          </div>

          {/* 3D Extruded Clean Map Image */}
          <img
            src="/images/india-3d-clean-card.jpg"
            alt="Clean 3D Isometric Map of India"
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* Interactive City Nodes Overlay */}
          <div className="absolute inset-0 z-10">
            {visibleCities.map((city) => {
              const coords = ISOMETRIC_CITY_COORDS[city.id];
              if (!coords) return null;

              const isSelected = selectedCityId === city.id;
              const isHovered = hoveredCityId === city.id;
              const isStateMatched = selectedStateCode === city.stateCode;

              return (
                <div
                  key={city.id}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => onSelectCity(city)}
                  onMouseEnter={() => setHoveredCityId(city.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                >
                  {/* Ping Animation Ring on Selected / Hovered */}
                  {(isSelected || isHovered || isStateMatched) && (
                    <span className="absolute -inset-2 rounded-full bg-cyan-500/40 animate-ping" />
                  )}

                  {/* Node Pin Marker */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'w-7 h-7 bg-gradient-to-tr from-cyan-600 to-cyan-300 text-ocean-950 ring-4 ring-cyan-400 shadow-[0_0_20px_#38ACCC] scale-125 z-30'
                        : isHovered
                        ? 'w-6 h-6 bg-cyan-400 text-ocean-950 ring-2 ring-white shadow-lg scale-110 z-20'
                        : 'w-4 h-4 bg-ocean-800 text-white ring-2 ring-cyan-400/80 shadow-md hover:scale-110 z-10'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  </div>

                  {/* Floating Tooltip Pill */}
                  <div
                    className={`absolute pointer-events-none transition-all duration-200 whitespace-nowrap z-30 ${
                      coords.labelPos === 'left'
                        ? 'right-full mr-2 top-1/2 -translate-y-1/2'
                        : coords.labelPos === 'top'
                        ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                        : coords.labelPos === 'bottom'
                        ? 'top-full mt-2 left-1/2 -translate-x-1/2'
                        : 'left-full ml-2 top-1/2 -translate-y-1/2'
                    } ${
                      isSelected || isHovered
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 text-white border border-cyan-400/60 shadow-2xl backdrop-blur-md flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{city.name}</span>
                        <span className="text-[10px] text-ocean-300">({city.stateCode})</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[10px] text-ocean-200">
                        <span className="text-emerald-400 font-semibold">{city.count} Mapped Units</span>
                        <span className="text-amber-300 font-mono">{city.avgClearanceDays}d SLA</span>
                      </div>
                    </div>
                  </div>

                  {/* Static compact label for high-importance hubs when not hovered */}
                  {!isSelected && !isHovered && ['mumbai', 'pune', 'bengaluru', 'ahmedabad', 'delhi_ncr', 'hyderabad', 'chennai', 'kolkata'].includes(city.id) && (
                    <div
                      className={`absolute pointer-events-none text-[9px] font-bold tracking-tight text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow-sm border border-slate-200/80 ${
                        coords.labelPos === 'left'
                          ? 'right-full mr-1.5 top-1/2 -translate-y-1/2'
                          : 'left-full ml-1.5 top-1/2 -translate-y-1/2'
                      }`}
                    >
                      {city.name.split(' ')[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Cluster Quick Strip */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-cyan-400 font-bold">Selected Cluster:</span>
              <span className="font-extrabold text-white">{selectedCity.name}</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-700">
                {selectedCity.stateName}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{selectedCity.count} Active Units</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedCity.avgClearanceDays} Days SLA</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Information Footer Bar */}
      <div className="px-6 py-3 bg-[#04161F] border-t border-ocean-700/80 flex flex-wrap items-center justify-between text-xs text-ocean-300 gap-3">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Statutory Data synced with State Single-Window Portals (Maitri, IFP, Guidance, KIADB)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-ocean-400 text-[11px]">Click any pin or toggle to GIS mode anytime</span>
        </div>
      </div>
    </div>
  );
};
