import React, { useState, useRef, useMemo } from 'react';
import {
  MappedEntity,
  DEDUPLICATED_ENTITIES,
  STATE_SUMMARIES,
  StateSummary,
  AUTHORITATIVE_SOURCES,
  BusinessCategory,
  BUSINESS_CATEGORIES,
} from './geospatialDataService';
import {
  Search,
  RotateCcw,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export interface NetworkNode {
  id: string;
  name: string;
  stateCode: string;
  stateName: string;
  city: string;
  x: number; // percentage in SVG viewBox
  y: number;
  primaryCategory: BusinessCategory;
  totalUnits: number;
  unitBreakdown: {
    startups: number;
    pharma: number;
    automotive: number;
    technology: number;
    manufacturing: number;
    industrial: number;
  };
  connectedTo: string[];
  entities: MappedEntity[];
}

// Coordinate projection and realistic business unit distribution for major Indian business nodes
const NETWORK_NODES: NetworkNode[] = [
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Hub',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    city: 'Mumbai',
    x: 29.5,
    y: 53.5,
    primaryCategory: 'technology',
    totalUnits: 1140,
    unitBreakdown: {
      startups: 360,
      pharma: 140,
      automotive: 90,
      technology: 380,
      manufacturing: 120,
      industrial: 50,
    },
    connectedTo: ['pune', 'ahmedabad', 'nagpur', 'bengaluru'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Mumbai'),
  },
  {
    id: 'pune',
    name: 'Pune Industrial Corridor',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    city: 'Pune',
    x: 33.5,
    y: 56.5,
    primaryCategory: 'automotive',
    totalUnits: 780,
    unitBreakdown: {
      startups: 70,
      pharma: 80,
      automotive: 340,
      technology: 90,
      manufacturing: 170,
      industrial: 30,
    },
    connectedTo: ['mumbai', 'hyderabad', 'bengaluru'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Pune'),
  },
  {
    id: 'nagpur',
    name: 'Nagpur Multi-Modal Node',
    stateCode: 'MH',
    stateName: 'Maharashtra',
    city: 'Nagpur',
    x: 45.0,
    y: 47.5,
    primaryCategory: 'manufacturing',
    totalUnits: 310,
    unitBreakdown: {
      startups: 30,
      pharma: 20,
      automotive: 40,
      technology: 40,
      manufacturing: 130,
      industrial: 50,
    },
    connectedTo: ['mumbai', 'kolkata', 'hyderabad', 'indore'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Nagpur'),
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad & Sanand Cluster',
    stateCode: 'GJ',
    stateName: 'Gujarat',
    city: 'Ahmedabad',
    x: 24.5,
    y: 40.5,
    primaryCategory: 'pharma',
    totalUnits: 820,
    unitBreakdown: {
      startups: 90,
      pharma: 260,
      automotive: 210,
      technology: 80,
      manufacturing: 120,
      industrial: 60,
    },
    connectedTo: ['mumbai', 'dahej', 'delhi_ncr', 'jaipur'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Ahmedabad'),
  },
  {
    id: 'dahej',
    name: 'Dahej PCPIR Belt',
    stateCode: 'GJ',
    stateName: 'Gujarat',
    city: 'Dahej',
    x: 25.5,
    y: 46.5,
    primaryCategory: 'industrial',
    totalUnits: 490,
    unitBreakdown: {
      startups: 10,
      pharma: 40,
      automotive: 20,
      technology: 10,
      manufacturing: 180,
      industrial: 230,
    },
    connectedTo: ['ahmedabad', 'mumbai', 'surat'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Dahej'),
  },
  {
    id: 'surat',
    name: 'Surat & Hazira Port Node',
    stateCode: 'GJ',
    stateName: 'Gujarat',
    city: 'Surat',
    x: 26.5,
    y: 49.5,
    primaryCategory: 'manufacturing',
    totalUnits: 507,
    unitBreakdown: {
      startups: 60,
      pharma: 40,
      automotive: 30,
      technology: 50,
      manufacturing: 230,
      industrial: 97,
    },
    connectedTo: ['dahej', 'mumbai'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Surat'),
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Tech & Aero Hub',
    stateCode: 'KA',
    stateName: 'Karnataka',
    city: 'Bengaluru',
    x: 39.0,
    y: 69.5,
    primaryCategory: 'startups',
    totalUnits: 1480,
    unitBreakdown: {
      startups: 640,
      pharma: 90,
      automotive: 110,
      technology: 490,
      manufacturing: 120,
      industrial: 30,
    },
    connectedTo: ['mumbai', 'pune', 'chennai', 'hyderabad', 'kochi'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Bengaluru'),
  },
  {
    id: 'chennai',
    name: 'Chennai & Sriperumbudur Hub',
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    city: 'Chennai',
    x: 45.5,
    y: 72.0,
    primaryCategory: 'automotive',
    totalUnits: 1120,
    unitBreakdown: {
      startups: 180,
      pharma: 110,
      automotive: 420,
      technology: 230,
      manufacturing: 140,
      industrial: 40,
    },
    connectedTo: ['bengaluru', 'hyderabad', 'hosur'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Chennai'),
  },
  {
    id: 'hosur',
    name: 'Hosur EV Corridor',
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    city: 'Hosur',
    x: 41.5,
    y: 71.5,
    primaryCategory: 'automotive',
    totalUnits: 390,
    unitBreakdown: {
      startups: 40,
      pharma: 10,
      automotive: 220,
      technology: 20,
      manufacturing: 90,
      industrial: 10,
    },
    connectedTo: ['bengaluru', 'chennai'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Hosur'),
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Genome Valley & Tech',
    stateCode: 'TS',
    stateName: 'Telangana',
    city: 'Hyderabad',
    x: 43.0,
    y: 58.5,
    primaryCategory: 'pharma',
    totalUnits: 1240,
    unitBreakdown: {
      startups: 310,
      pharma: 420,
      automotive: 60,
      technology: 320,
      manufacturing: 90,
      industrial: 40,
    },
    connectedTo: ['bengaluru', 'chennai', 'nagpur', 'pune'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Hyderabad'),
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi NCR & Manesar',
    stateCode: 'DL',
    stateName: 'National Capital Region',
    city: 'Gurugram',
    x: 39.0,
    y: 28.5,
    primaryCategory: 'startups',
    totalUnits: 1420,
    unitBreakdown: {
      startups: 520,
      pharma: 90,
      automotive: 310,
      technology: 340,
      manufacturing: 120,
      industrial: 40,
    },
    connectedTo: ['ahmedabad', 'jaipur', 'baddi', 'indore', 'kolkata'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Gurugram'),
  },
  {
    id: 'baddi',
    name: 'Baddi Pharma Belt',
    stateCode: 'HP',
    stateName: 'Himachal Pradesh',
    city: 'Baddi',
    x: 37.5,
    y: 21.5,
    primaryCategory: 'pharma',
    totalUnits: 684,
    unitBreakdown: {
      startups: 45,
      pharma: 490,
      automotive: 20,
      technology: 25,
      manufacturing: 70,
      industrial: 34,
    },
    connectedTo: ['delhi_ncr'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Baddi'),
  },
  {
    id: 'indore',
    name: 'Indore & Pithampur Hub',
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    city: 'Indore',
    x: 37.5,
    y: 45.5,
    primaryCategory: 'automotive',
    totalUnits: 742,
    unitBreakdown: {
      startups: 160,
      pharma: 180,
      automotive: 170,
      technology: 90,
      manufacturing: 100,
      industrial: 42,
    },
    connectedTo: ['delhi_ncr', 'nagpur', 'mumbai'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Indore'),
  },
  {
    id: 'kolkata',
    name: 'Kolkata Industrial & Port Hub',
    stateCode: 'WB',
    stateName: 'West Bengal',
    city: 'Kolkata',
    x: 60.5,
    y: 44.0,
    primaryCategory: 'manufacturing',
    totalUnits: 810,
    unitBreakdown: {
      startups: 160,
      pharma: 90,
      automotive: 30,
      technology: 190,
      manufacturing: 210,
      industrial: 130,
    },
    connectedTo: ['delhi_ncr', 'nagpur'],
    entities: DEDUPLICATED_ENTITIES.filter((e) => e.city === 'Kolkata'),
  },
  {
    id: 'jaipur',
    name: 'Jaipur DMIC Corridor',
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    city: 'Jaipur',
    x: 33.0,
    y: 33.5,
    primaryCategory: 'manufacturing',
    totalUnits: 690,
    unitBreakdown: {
      startups: 140,
      pharma: 70,
      automotive: 120,
      technology: 80,
      manufacturing: 200,
      industrial: 80,
    },
    connectedTo: ['delhi_ncr', 'ahmedabad'],
    entities: [],
  },
  {
    id: 'kochi',
    name: 'Kochi Port & Tech Node',
    stateCode: 'KL',
    stateName: 'Kerala',
    city: 'Kochi',
    x: 36.0,
    y: 81.0,
    primaryCategory: 'technology',
    totalUnits: 540,
    unitBreakdown: {
      startups: 175,
      pharma: 30,
      automotive: 20,
      technology: 190,
      manufacturing: 95,
      industrial: 30,
    },
    connectedTo: ['bengaluru'],
    entities: [],
  },
];

export const ApprovalIntelligenceNetworkMap: React.FC<{
  onExploreEntity?: (entity: MappedEntity) => void;
  className?: string;
}> = ({ onExploreEntity, className = '' }) => {
  // Navigation & selection state
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>('TS');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('hyderabad');
  const [selectedEntity, setSelectedEntity] = useState<MappedEntity | null>(
    DEDUPLICATED_ENTITIES.find((e) => e.id === 'bharat-biotech-genome-valley') || DEDUPLICATED_ENTITIES[0]!
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [detailedInspectorEntity, setDetailedInspectorEntity] = useState<MappedEntity | null>(null);

  // Business Category Switcher
  const [activeCategory, setActiveCategory] = useState<BusinessCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active node object
  const activeNode = useMemo(() => {
    return NETWORK_NODES.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Current active category metadata
  const activeCategoryMeta = useMemo(() => {
    return BUSINESS_CATEGORIES.find((c) => c.id === activeCategory) || BUSINESS_CATEGORIES[0]!;
  }, [activeCategory]);

  // Search results query across entities, states, and hubs
  const searchResults = useMemo<{
    entityMatches: MappedEntity[];
    stateMatches: StateSummary[];
    nodeMatches: NetworkNode[];
  }>(() => {
    if (!searchQuery.trim()) return { entityMatches: [], stateMatches: [], nodeMatches: [] };
    const q = searchQuery.toLowerCase();

    const entityMatches = DEDUPLICATED_ENTITIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.state.toLowerCase().includes(q) ||
        e.industry.toLowerCase().includes(q)
    ).slice(0, 4);

    const stateMatches = Object.values(STATE_SUMMARIES).filter(
      (s) => s.stateName.toLowerCase().includes(q) || s.stateCode.toLowerCase().includes(q)
    );

    const nodeMatches = NETWORK_NODES.filter(
      (n) => n.name.toLowerCase().includes(q) || n.city.toLowerCase().includes(q)
    );

    return { entityMatches, stateMatches, nodeMatches };
  }, [searchQuery]);

  // Active state summary data
  const activeStateSummary: StateSummary | null = selectedStateCode
    ? STATE_SUMMARIES[selectedStateCode] || null
    : null;

  // Connection lines between nodes
  const connectionLines = useMemo(() => {
    const lines: {
      id: string;
      source: NetworkNode;
      target: NetworkNode;
      isActive: boolean;
    }[] = [];
    const seen = new Set<string>();

    for (const node of NETWORK_NODES) {
      for (const targetId of node.connectedTo) {
        const targetNode = NETWORK_NODES.find((n) => n.id === targetId);
        if (!targetNode) continue;
        const key = [node.id, targetId].sort().join('---');
        if (!seen.has(key)) {
          seen.add(key);
          const isLineActive =
            selectedNodeId === node.id ||
            selectedNodeId === targetId ||
            selectedStateCode === node.stateCode ||
            selectedStateCode === targetNode.stateCode;

          lines.push({
            id: key,
            source: node,
            target: targetNode,
            isActive: isLineActive,
          });
        }
      }
    }
    return lines;
  }, [selectedNodeId, selectedStateCode]);

  const handleReset = () => {
    setSelectedStateCode(null);
    setSelectedNodeId(null);
    setSelectedEntity(null);
    setActiveCategory('all');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSelectState = (stateCode: string) => {
    setSelectedStateCode((prev) => (prev === stateCode ? null : stateCode));
    setSelectedEntity(null);
    const nodeInState = NETWORK_NODES.find((n) => n.stateCode === stateCode);
    if (nodeInState) setSelectedNodeId(nodeInState.id);
  };

  const handleSelectNode = (node: NetworkNode) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    setSelectedStateCode(node.stateCode);
    if (node.entities.length > 0) {
      setSelectedEntity(node.entities[0]!);
    } else {
      setSelectedEntity(null);
    }
  };

  const handleOpenDetailedInspector = (entity: MappedEntity) => {
    setDetailedInspectorEntity(entity);
    if (onExploreEntity) {
      onExploreEntity(entity);
    }
  };

  // Helper to compute node unit count according to selected business type
  const getNodeUnits = (node: NetworkNode) => {
    if (activeCategory === 'all') return node.totalUnits;
    return node.unitBreakdown[activeCategory] || 0;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl bg-[#04161F] border border-cyan-500/20 shadow-[0_20px_60px_rgba(4,22,31,0.8)] overflow-hidden font-sans select-none transition-all duration-500 flex flex-col ${className}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-canvas-bg') {
          setSelectedNodeId(null);
          setSelectedEntity(null);
          setIsSearchOpen(false);
        }
      }}
    >
      {/* Ambient Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_45%,rgba(14,75,94,0.3),rgba(4,22,31,0.98))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Coordinate Grid */}
      <div
        id="map-canvas-bg"
        className="absolute inset-0 opacity-[0.06] pointer-events-auto cursor-crosshair bg-[linear-gradient(to_right,#38ACCC_1px,transparent_1px),linear-gradient(to_bottom,#38ACCC_1px,transparent_1px)] bg-[size:44px_44px]"
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: SEARCH LOCATION & TOTAL UNITS INDICATOR               */}
      {/* ========================================================================= */}
      <div className="relative z-30 px-4 sm:px-6 py-3 bg-[#03141D]/90 border-b border-cyan-500/20 backdrop-blur-xl flex items-center justify-between gap-3">
        {/* Left: Search Location & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06212B]/95 border border-cyan-400/50 backdrop-blur-xl shadow-2xl animate-scale-in">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search state, city, business, or sector..."
                  className="bg-transparent text-xs text-white placeholder-ocean-300 focus:outline-none w-44 sm:w-60 font-sans"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-ocean-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06212B]/90 hover:bg-[#072d3b] text-cyan-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-xl text-xs font-medium transition-all shadow-md cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search location / cluster</span>
              </button>
            )}

            {/* Live Search Autocomplete Dropdown */}
            {isSearchOpen && searchQuery && searchResults && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-[#06212B]/95 border border-cyan-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl z-40 max-h-72 overflow-y-auto space-y-2">
                {/* States */}
                {searchResults.stateMatches.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-cyan-400 px-2 font-bold">States</div>
                    {searchResults.stateMatches.map((st) => (
                      <button
                        key={st.stateCode}
                        type="button"
                        onClick={() => {
                          handleSelectState(st.stateCode);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cyan-950/80 text-xs flex items-center justify-between text-white"
                      >
                        <span className="font-bold">{st.stateName}</span>
                        <span className="text-[10px] font-mono text-cyan-300">{st.totalEntities} units</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cities */}
                {searchResults.nodeMatches.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-cyan-400 px-2 font-bold">Cities / Corridors</div>
                    {searchResults.nodeMatches.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          handleSelectNode(n);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cyan-950/80 text-xs flex items-center justify-between text-white"
                      >
                        <span className="font-medium">{n.name}</span>
                        <span className="text-[10px] text-ocean-300">{n.totalUnits} units</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Entities */}
                {searchResults.entityMatches.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-cyan-400 px-2 font-bold">Verified Businesses</div>
                    {searchResults.entityMatches.map((ent) => (
                      <button
                        key={ent.id}
                        type="button"
                        onClick={() => {
                          setSelectedStateCode(ent.stateCode);
                          setSelectedEntity(ent);
                          const matchedNode = NETWORK_NODES.find((n) => n.city === ent.city);
                          if (matchedNode) setSelectedNodeId(matchedNode.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cyan-950/80 text-xs flex flex-col text-white"
                      >
                        <span className="font-bold text-cyan-200">{ent.name}</span>
                        <span className="text-[10px] text-ocean-300">{ent.industry} • {ent.city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset Button */}
          {(selectedStateCode || selectedNodeId || selectedEntity || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#06212B]/90 hover:bg-[#072d3b] text-ocean-300 hover:text-white border border-ocean-700/60 backdrop-blur-xl text-xs transition-all shadow-md cursor-pointer"
              title="Reset map view"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Right: National Units Live Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06212B]/90 border border-cyan-500/30 backdrop-blur-xl text-xs font-mono text-cyan-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-tight">
            {activeCategoryMeta.totalUnits.toLocaleString()}
          </span>
          <span className="text-ocean-300 hidden sm:inline">
            {activeCategory === 'all' ? 'mapped units' : `${activeCategoryMeta.shortLabel} units`}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN MAP CANVAS WITH CLEAN RIGHT-SIDE BUSINESS CATEGORIES COLUMN       */}
      {/* ========================================================================= */}
      <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] max-h-[820px] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        
        {/* SVG Vector Map */}
        <svg
          viewBox="14 7 72 87"
          className="w-full h-full max-w-[960px] max-h-[700px] drop-shadow-[0_0_40px_rgba(56,172,204,0.15)] pointer-events-auto"
        >
          <defs>
            <linearGradient id="pathwayLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38ACCC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
              <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* India Geographic Outline Silhouette */}
          <g className="stroke-cyan-500/25 fill-ocean-950/40 transition-all duration-700">
            <path
              d="
                M 34 10
                C 36 12, 40 12, 42 16
                C 43 20, 42 24, 46 26
                C 49 27, 54 28, 57 28
                C 62 29, 66 32, 69 31
                C 74 30, 80 32, 84 35
                C 85 39, 81 42, 78 44
                C 74 46, 71 45, 67 47
                C 64 49, 61 52, 60 55
                C 59 58, 56 62, 54 66
                C 51 71, 48 76, 44 82
                C 41 87, 39 90, 37 92
                C 35 90, 33 85, 33 80
                C 32 75, 30 70, 30 65
                C 29 60, 27 55, 27 52
                C 25 51, 21 50, 19 46
                C 17 42, 20 38, 23 37
                C 26 36, 29 33, 30 30
                C 31 25, 32 18, 34 10
                Z
              "
              strokeWidth="0.4"
              className="hover:fill-ocean-900/30 transition-colors"
            />

            {/* Regional Zonal Boundary Dashes */}
            <path
              d="M 27 52 C 34 52, 42 50, 60 55"
              stroke="#38ACCC"
              strokeOpacity="0.12"
              strokeWidth="0.25"
              strokeDasharray="1.5,1.5"
              fill="none"
            />
            <path
              d="M 39 28 C 42 40, 43 58, 44 82"
              stroke="#38ACCC"
              strokeOpacity="0.12"
              strokeWidth="0.25"
              strokeDasharray="1.5,1.5"
              fill="none"
            />
          </g>

          {/* Connection Lines between Regulatory Nodes */}
          <g>
            {connectionLines.map((line) => (
              <line
                key={line.id}
                x1={line.source.x}
                y1={line.source.y}
                x2={line.target.x}
                y2={line.target.y}
                stroke={line.isActive ? 'url(#activeLineGrad)' : 'url(#pathwayLineGrad)'}
                strokeOpacity={line.isActive ? 0.75 : 0.15}
                strokeWidth={line.isActive ? 0.5 : 0.25}
                className="transition-all duration-500"
              />
            ))}
          </g>

          {/* Interactive Mapped City / Regional Nodes */}
          <g>
            {NETWORK_NODES.map((node) => {
              const units = getNodeUnits(node);
              const isRelevant = units > 0;
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isStateActive = selectedStateCode === node.stateCode;
              const isHighlighted = isSelected || isHovered || isStateActive;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  opacity={isRelevant ? 1 : 0.35}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Expanding Ring on Selected */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="2.5"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="0.2"
                      strokeOpacity="0.8"
                    >
                      <animate attributeName="r" values="1.2; 3.6; 4.8" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9; 0.3; 0" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Outer Glow Halo */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 2.0 : isHovered ? 1.7 : isStateActive ? 1.3 : 0.9}
                    fill={isSelected ? '#22D3EE' : '#38ACCC'}
                    fillOpacity={isSelected ? 0.45 : isHovered ? 0.3 : isStateActive ? 0.2 : 0.1}
                    filter="url(#glowFilter)"
                    className="transition-all duration-300"
                  />

                  {/* Center Node Core Disc */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 1.1 : isHovered ? 0.9 : 0.65}
                    fill={isSelected ? '#FFFFFF' : isHovered ? '#67E8F9' : '#38ACCC'}
                    stroke={isSelected ? '#22D3EE' : '#0E4B5E'}
                    strokeWidth="0.2"
                    className="transition-all duration-300 drop-shadow"
                  />

                  {/* Compact City & Unit Badge Label */}
                  <text
                    x={node.x}
                    y={node.y - 1.4}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : isHovered ? '#22D3EE' : isStateActive ? '#E2E8F0' : '#94A3B8'}
                    fillOpacity={isHighlighted ? 1 : 0.6}
                    fontSize={isSelected ? '1.5' : '1.15'}
                    fontWeight={isHighlighted ? 'bold' : 'normal'}
                    className="pointer-events-none transition-all duration-300 font-mono tracking-tight"
                  >
                    {node.city}
                  </text>

                  {/* Dynamic Unit Count Badge under Pin */}
                  {(isHighlighted || activeCategory !== 'all') && (
                    <text
                      x={node.x}
                      y={node.y + 2.0}
                      textAnchor="middle"
                      fill={isSelected ? '#22D3EE' : isHovered ? '#67E8F9' : '#38ACCC'}
                      fillOpacity={isHighlighted ? 0.95 : 0.7}
                      fontSize="0.95"
                      fontWeight="bold"
                      className="pointer-events-none transition-all duration-300 font-mono"
                    >
                      {units} {activeCategory === 'all' ? 'units' : activeCategoryMeta.shortLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* ========================================================================= */}
        {/* 3. RIGHT SIDE COLUMN: SLEEK ANIMATED BUSINESS SECTORS PANEL               */}
        {/* ========================================================================= */}
        <div
          className="absolute top-3 sm:top-5 right-3 sm:right-6 z-20 flex flex-col gap-1.5 p-2 rounded-2xl bg-[#06212B]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] max-w-[190px] sm:max-w-[210px] animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 border-b border-cyan-800/40 pb-1 flex items-center justify-between">
            <span>Business Sectors</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div className="flex flex-col gap-1">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/30 to-ocean-500/40 border border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] -translate-x-1'
                      : 'hover:bg-cyan-950/70 text-ocean-200 hover:text-white border border-transparent hover:border-cyan-500/40 hover:-translate-x-1'
                  }`}
                >
                  {/* Left Active Glow Indicator Strip */}
                  {isSelected && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  )}

                  <div className="flex items-center gap-1.5 pl-1 truncate">
                    <span className="text-xs transition-transform duration-300 group-hover:scale-125">{cat.icon}</span>
                    <span className="truncate text-[11px] font-medium">{cat.shortLabel}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors flex-shrink-0 ${
                      isSelected
                        ? 'bg-cyan-400 text-ocean-950 font-bold shadow-sm'
                        : 'bg-cyan-950/90 text-cyan-300 font-semibold group-hover:bg-cyan-900 group-hover:text-white'
                    }`}
                  >
                    {cat.totalUnits >= 1000 ? `${(cat.totalUnits / 1000).toFixed(1)}k` : cat.totalUnits}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. LEFT SIDE PROGRESSIVE INTELLIGENCE PANELS (State or Hub Card)          */}
        {/* ========================================================================= */}

        {/* State Summary Panel (When a state is selected) */}
        {activeStateSummary && !selectedEntity && (
          <div
            className="absolute left-3 sm:left-6 top-3 sm:top-5 z-30 w-64 sm:w-72 rounded-2xl p-4 bg-[#06212B]/95 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-3 text-white animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ocean-700/60 pb-2">
              <div>
                <h4 className="font-editorial text-lg font-bold text-white tracking-tight">
                  {activeStateSummary.stateName}
                </h4>
                <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                  {activeStateSummary.totalEntities.toLocaleString()} mapped operational units
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStateCode(null)}
                className="text-ocean-300 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Business Type Breakdown with Counts */}
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                Units by Business Type
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-ocean-200">
                  <span className="flex items-center gap-1.5">🚀 Startups</span>
                  <span className="font-mono font-bold text-white">{activeStateSummary.categories.startups}</span>
                </div>
                <div className="flex items-center justify-between text-ocean-200">
                  <span className="flex items-center gap-1.5">🧪 Pharma & Biotech</span>
                  <span className="font-mono font-bold text-white">{activeStateSummary.categories.pharma}</span>
                </div>
                <div className="flex items-center justify-between text-ocean-200">
                  <span className="flex items-center gap-1.5">🚗 Automotive & EV</span>
                  <span className="font-mono font-bold text-white">{activeStateSummary.categories.automotive}</span>
                </div>
                <div className="flex items-center justify-between text-ocean-200">
                  <span className="flex items-center gap-1.5">💻 Tech & Cloud</span>
                  <span className="font-mono font-bold text-white">{activeStateSummary.categories.technology}</span>
                </div>
                <div className="flex items-center justify-between text-ocean-200">
                  <span className="flex items-center gap-1.5">⚙️ Manufacturing</span>
                  <span className="font-mono font-bold text-white">{activeStateSummary.categories.manufacturing}</span>
                </div>
                <div className="flex items-center justify-between text-ocean-300 text-[11px]">
                  <span className="flex items-center gap-1.5">🏭 Industrial & Petrochem</span>
                  <span className="font-mono">{activeStateSummary.categories.industrial}</span>
                </div>
              </div>
            </div>

            {/* Key Cities List */}
            <div className="pt-2 border-t border-ocean-800/60">
              <div className="text-[10px] font-mono text-ocean-300 uppercase font-bold mb-1.5">
                Key Industrial Corridors
              </div>
              <div className="flex flex-wrap gap-1">
                {activeStateSummary.cities.slice(0, 4).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      const matchedNode = NETWORK_NODES.find((n) => n.city === city);
                      if (matchedNode) handleSelectNode(matchedNode);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-[10px] font-medium text-cyan-200 hover:bg-cyan-900 hover:text-white transition-colors cursor-pointer"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Hub / Entity Card (Bottom Left) */}
        {selectedEntity && (
          <div
            className="absolute left-3 sm:left-6 bottom-3 sm:bottom-5 z-30 w-72 sm:w-80 rounded-2xl p-4 bg-[#06212B]/95 border border-cyan-400/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(56,172,204,0.25)] space-y-2.5 text-white animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 border-b border-ocean-700/60 pb-2">
              <div>
                <h5 className="font-editorial text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                  {selectedEntity.name}
                </h5>
                <div className="text-[11px] text-cyan-300 mt-0.5">
                  {selectedEntity.category} • {selectedEntity.industry}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="text-ocean-300 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* City Hub Metrics Snapshot */}
            {activeNode && (
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-ocean-300">{activeNode.city} Hub Total:</span>
                  <span className="text-cyan-300 font-bold">{activeNode.totalUnits} units</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-ocean-200 pt-1 border-t border-cyan-900/60">
                  <div className="truncate">🚀 Startups: <b className="text-white">{activeNode.unitBreakdown.startups}</b></div>
                  <div className="truncate">🧪 Pharma: <b className="text-white">{activeNode.unitBreakdown.pharma}</b></div>
                  <div className="truncate">🚗 Auto: <b className="text-white">{activeNode.unitBreakdown.automotive}</b></div>
                  <div className="truncate">💻 Tech: <b className="text-white">{activeNode.unitBreakdown.technology}</b></div>
                  <div className="truncate">⚙️ Mfg: <b className="text-white">{activeNode.unitBreakdown.manufacturing}</b></div>
                  <div className="truncate">🏭 Ind: <b className="text-white">{activeNode.unitBreakdown.industrial}</b></div>
                </div>
              </div>
            )}

            <div className="text-xs text-ocean-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-ocean-300">Registration:</span>
                <span className="font-mono text-cyan-300 truncate max-w-[170px]" title={selectedEntity.scrapeData?.registrationNumber}>
                  {selectedEntity.scrapeData?.registrationNumber || selectedEntity.authority}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-ocean-300">
                <span>Public Status:</span>
                <span className="font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Verified Registry
                </span>
              </div>
            </div>

            {/* [ View Live Web Registry Filings ] */}
            <button
              type="button"
              onClick={() => handleOpenDetailedInspector(selectedEntity)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <span>View Live Statutory Filings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM FOOTER: DATA TRANSPARENCY & VIEW SOURCES                         */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#031017] border-t border-ocean-800/80 flex flex-wrap items-center justify-between text-[11px] text-ocean-300 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time business unit breakdown across 12 states • Updated March 2026</span>
        </div>

        <button
          type="button"
          onClick={() => setIsSourcesModalOpen(true)}
          className="text-cyan-300 hover:underline inline-flex items-center gap-1 font-mono font-bold cursor-pointer"
        >
          <Info className="w-3 h-3" />
          <span>[ View Sources ]</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. DETAILED STATUTORY & SCRAPED DATA MODAL                                 */}
      {/* ========================================================================= */}
      {detailedInspectorEntity && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDetailedInspectorEntity(null)}
        >
          <div
            className="w-full max-w-xl bg-[#06212B] border border-cyan-400/50 rounded-3xl p-6 shadow-2xl space-y-5 text-white animate-scale-in relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-ocean-700/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700">
                    Public Web Registry Intelligence
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Verified
                  </span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight mt-2">
                  {detailedInspectorEntity.name}
                </h3>
                <div className="text-xs text-ocean-200 mt-0.5">
                  {detailedInspectorEntity.category} • {detailedInspectorEntity.industry} • {detailedInspectorEntity.city}, {detailedInspectorEntity.state}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailedInspectorEntity(null)}
                className="text-ocean-300 hover:text-white p-1 rounded-lg hover:bg-ocean-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Scraped Operational Summary */}
            <div className="p-3.5 rounded-2xl bg-ocean-950/80 border border-ocean-800 text-xs text-ocean-100 leading-relaxed">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <FileText className="w-3.5 h-3.5" />
                <span>Facility Intelligence & Compliance Summary</span>
              </div>
              <p>{detailedInspectorEntity.scrapeData?.publicScrapedDetails}</p>
            </div>

            {/* Statutory Filings & Clearances */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-mono uppercase text-ocean-300 font-bold">
                Verified Statutory Clearances & Filings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detailedInspectorEntity.statutoryFilings?.map((filing) => (
                  <div
                    key={filing.filingId}
                    className="p-3 rounded-xl bg-ocean-900/60 border border-ocean-700/60 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-300 font-bold">{filing.filingId}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                        {filing.status}
                      </span>
                    </div>
                    <div className="font-medium text-white text-xs">{filing.type}</div>
                    <div className="text-[10px] text-ocean-300">
                      Agency: <span className="text-ocean-100">{filing.agency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Registry Source Provenance */}
            <div className="p-3 rounded-2xl bg-[#031017] border border-ocean-800 flex flex-wrap items-center justify-between text-[11px] text-ocean-300 gap-2">
              <div className="font-mono">
                Source: <span className="text-cyan-300">{detailedInspectorEntity.scrapeData?.sourceRegistry}</span>
              </div>
              <a
                href={detailedInspectorEntity.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline font-bold"
              >
                <span>Visit Official Registry</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SOURCES & PUBLIC DIRECTORIES MODAL                                     */}
      {/* ========================================================================= */}
      {isSourcesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsSourcesModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#06212B] border border-cyan-400/50 rounded-3xl p-6 shadow-2xl space-y-4 text-white animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ocean-700/80 pb-3">
              <div>
                <h3 className="font-editorial text-xl font-bold text-white tracking-tight">
                  Authoritative Public Data Sources
                </h3>
                <p className="text-xs text-ocean-300 mt-0.5">
                  ApprovalIQ aggregates public registers to provide compliance and geospatial clarity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                className="text-ocean-300 hover:text-white p-1 rounded-lg hover:bg-ocean-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {AUTHORITATIVE_SOURCES.map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-ocean-950/80 hover:bg-ocean-900 border border-ocean-800 flex items-center justify-between text-xs group transition-colors block"
                >
                  <div>
                    <div className="font-bold text-cyan-200 group-hover:text-white transition-colors">
                      {source.name}
                    </div>
                    <div className="text-[10px] text-ocean-300">{source.type}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ocean-400 group-hover:text-cyan-300 transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
