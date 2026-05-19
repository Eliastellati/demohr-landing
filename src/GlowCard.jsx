import React, { useEffect, useRef } from 'react';

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        // Calculate coordinate relative to card bounding box so spotlight aligns perfectly with mouse cursor inside the card
        const rect = cardRef.current.getBoundingClientRect();
        const cardX = x - rect.left;
        const cardY = y - rect.top;
        cardRef.current.style.setProperty('--x', cardX.toFixed(2));
        cardRef.current.style.setProperty('--xp', (cardX / rect.width).toFixed(2));
        cardRef.current.style.setProperty('--y', cardY.toFixed(2));
        cardRef.current.style.setProperty('--yp', (cardY / rect.height).toFixed(2));
      }
    };

    // Listen to pointermove specifically on the card (or window, but card-specific is more efficient and avoids jumping)
    const cardEl = cardRef.current;
    if (cardEl) {
      window.addEventListener('pointermove', syncPointer);
    }
    return () => {
      window.removeEventListener('pointermove', syncPointer);
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '1.5',
      '--backdrop': 'rgba(255, 255, 255, 0.03)',
      '--backup-border': 'rgba(255, 255, 255, 0.08)',
      '--size': '220',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) 100% 70% / 0.08), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    @media (min-width: 1024px) {
      [data-glow]::before,
      [data-glow]::after {
        pointer-events: none;
        content: "";
        position: absolute;
        inset: calc(var(--border-size) * -1);
        border: var(--border-size) solid transparent;
        border-radius: calc(var(--radius) * 1px);
        background-repeat: no-repeat;
        
        /* Standard masking */
        mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
        mask-clip: padding-box, border-box;
        mask-composite: intersect;
        
        /* Webkit / Chrome / Safari compatibility masking */
        -webkit-mask: linear-gradient(transparent, transparent) padding-box, linear-gradient(white, white) border-box;
        -webkit-mask-composite: destination-in;
      }
      
      [data-glow]::before {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) 100% 60% / 1), transparent 100%
        );
        filter: brightness(1.5);
      }
      
      [data-glow]::after {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(0 100% 100% / 0.5), transparent 100%
        );
      }
      
      [data-glow] [data-glow] {
        position: absolute;
        inset: 0;
        will-change: filter;
        opacity: var(--outer, 1);
        border-radius: calc(var(--radius) * 1px);
        border-width: calc(var(--border-size) * 20);
        filter: blur(calc(var(--border-size) * 10));
        background: none;
        pointer-events: none;
        border: none;
      }
    }

    @media (max-width: 1023px) {
      [data-glow] {
        border-color: hsla(var(--base), 100%, 70%, 0.15) !important;
        background-image: radial-gradient(
          120% 120% at 50% 50%,
          hsl(var(--base) 100% 70% / 0.04), transparent 80%
        ) !important;
        box-shadow: 0 0 25px hsla(var(--base), 100%, 70%, 0.08) !important;
      }
      [data-glow]::before,
      [data-glow]::after {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          rounded-2xl 
          relative 
          backdrop-blur-[12px]
          transition-all duration-300
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard };
