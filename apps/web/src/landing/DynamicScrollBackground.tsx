import React, { useState, useEffect } from 'react';

export const DynamicScrollBackground: React.FC = () => {
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const ratio = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollRatio(ratio);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute dynamic hue shifts based on scrollRatio:
  // Palette: #06212B (deep navy cyan), #0A3140 (marine), #085375 (oceanic), #0E8BB2 (vibrant cyan), #38ACCC (radiant aqua), #7ECBE0 (sky aqua)
  const orb1Y = 10 + scrollRatio * 60; // 10% -> 70%
  const orb1X = 15 + Math.sin(scrollRatio * Math.PI) * 25; // 15% -> 40%
  
  const orb2Y = 25 + scrollRatio * 50; // 25% -> 75%
  const orb2X = 80 - Math.sin(scrollRatio * Math.PI) * 20; // 80% -> 60%

  const orb3Y = 60 - scrollRatio * 35; // 60% -> 25%
  const orb3X = 40 + Math.cos(scrollRatio * Math.PI) * 30; // 40% -> 70%

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none transition-colors duration-500">
      {/* Dynamic Master Gradient Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% ${20 + scrollRatio * 60}%, rgba(14, 165, 150, ${0.16 + scrollRatio * 0.08}) 0%, rgba(8, 92, 100, ${0.12 + scrollRatio * 0.06}) 45%, rgba(4, 28, 36, 0.08) 100%)`,
        }}
      />

      {/* Floating Animated Radiant Orb 1 (Top Left / Deep Marine to Emerald) */}
      <div
        className="absolute w-[38rem] h-[38rem] rounded-full blur-[90px] transition-all duration-700 ease-out"
        style={{
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          transform: 'translate(-50%, -50%)',
          background: scrollRatio < 0.5
            ? 'radial-gradient(circle, rgba(14, 165, 150, 0.38) 0%, rgba(9, 90, 95, 0.18) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(52, 211, 153, 0.40) 0%, rgba(14, 165, 150, 0.20) 60%, transparent 80%)',
        }}
      />

      {/* Floating Animated Radiant Orb 2 (Top Right / Teal to Emerald Luminous Light) */}
      <div
        className="absolute w-[44rem] h-[44rem] rounded-full blur-[110px] transition-all duration-700 ease-out"
        style={{
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          transform: 'translate(-50%, -50%)',
          background: scrollRatio < 0.5
            ? 'radial-gradient(circle, rgba(10, 147, 138, 0.35) 0%, rgba(6, 40, 48, 0.18) 70%, transparent 85%)'
            : 'radial-gradient(circle, rgba(34, 211, 238, 0.38) 0%, rgba(16, 185, 129, 0.22) 65%, transparent 85%)',
        }}
      />

      {/* Floating Animated Radiant Orb 3 (Center Lower / Radiant Cyan Emerald) */}
      <div
        className="absolute w-[46rem] h-[46rem] rounded-full blur-[120px] transition-all duration-700 ease-out"
        style={{
          left: `${orb3X}%`,
          top: `${orb3Y}%`,
          transform: 'translate(-50%, -50%)',
          background: scrollRatio < 0.6
            ? 'radial-gradient(circle, rgba(8, 115, 115, 0.28) 0%, rgba(6, 40, 48, 0.15) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(14, 165, 150, 0.35) 0%, rgba(52, 211, 153, 0.20) 60%, transparent 80%)',
        }}
      />

      {/* Subtle Fine Mathematical Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#085375 1px, transparent 1px), linear-gradient(to right, #085375 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
