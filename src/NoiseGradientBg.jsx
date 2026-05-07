import React from 'react';

/**
 * NoiseGradientBg
 * ---------------
 * Layered depth background — darker, no film grain.
 *  1. Deep dark base (#010208) — deeper than before
 *  2. Animated CSS gradient orbs (muted electric-blue / indigo)
 *  3. Multi-layer depth vignette for 3D-space feel
 *  4. Heavy overlay to keep overall darkness
 */
export default function NoiseGradientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* ── Base dark fill ── */}
      <div className="absolute inset-0 bg-[#010208]" />

      {/* ── Animated gradient orbs (muted) ── */}
      <div className="absolute inset-0 noise-gradient-orbs" />

      {/* ── Heavy dark overlay to deepen everything ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(1,2,8,0.60)' }}
      />

      {/* ── Depth vignette: darkening edges radially ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 10%, rgba(1,2,8,0.65) 60%, #010208 100%)',
        }}
      />

      {/* ── Subtle inner bloom / light source top-center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(0,80,200,0.05) 0%, transparent 70%)',
        }}
      />

      {/* ── Bottom fog ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: 'linear-gradient(to top, rgba(1,2,8,0.90) 0%, transparent 100%)',
        }}
      />

      {/* ── Top fade ── */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#010208] to-transparent" />
    </div>
  );
}
