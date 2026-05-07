import React, { useRef, useEffect } from 'react';

// --- 3D Perspective Laptop Points ---
// We define key 3D vertices and project them with a simple perspective.
function project(x3d, y3d, z3d, cx, cy, fov = 500) {
  const scale = fov / (fov + z3d);
  return {
    x: cx + x3d * scale,
    y: cy + y3d * scale,
    scale,
  };
}

function getLaptopPoints3D(canvasW, canvasH) {
  // Place laptop on the right side, vertically centered in the UPPER half (Benvenuti area)
  const cx = canvasW * 0.76;   // far right
  const cy = canvasH * 0.38;   // upper portion
  const fov = 420;

  // Laptop dimensions in 3D space — much smaller
  const sw = 90, sh = 58, depth = 9;
  const bw = 100, bh = 14, bd = 7;
  const tiltX = -20; // screen tilt (degrees) around X
  const tx = Math.tan(tiltX * Math.PI / 180);

  const pts = [];
  const p = (x, y, z) => {
    const r = project(x, y, z, cx, cy, fov);
    pts.push({ x: r.x, y: r.y });
  };

  // Helper: edge from 3D A to B, N steps
  const edge = (ax, ay, az, bx, by, bz, n = 30) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      p(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t);
    }
  };

  // --- SCREEN (front face, tilted back) ---
  // Tilt: top of screen goes back in Z, bottom connects at hinge
  // bottom-left, bottom-right, top-right, top-left
  const sbl = [-sw / 2, 0,  0];
  const sbr = [ sw / 2, 0,  0];
  const stl = [-sw / 2 + sh * tx, -sh,  sh * 0.3];
  const str = [ sw / 2 + sh * tx, -sh,  sh * 0.3];

  edge(...sbl, ...sbr, 36);          // hinge edge
  edge(...sbr, ...str, 28);          // right edge
  edge(...str, ...stl, 36);          // top edge
  edge(...stl, ...sbl, 28);          // left edge

  // Screen depth (side panel)
  edge(...sbl, sbl[0], sbl[1], sbl[2] - depth, 8);
  edge(...sbr, sbr[0], sbr[1], sbr[2] - depth, 8);

  // Inner screen lines (scan lines for 3D feel)
  for (let row = 1; row <= 5; row++) {
    const t = row / 6;
    const lx0 = sbl[0] + (stl[0] - sbl[0]) * t;
    const ly0 = sbl[1] + (stl[1] - sbl[1]) * t;
    const lz0 = sbl[2] + (stl[2] - sbl[2]) * t;
    const rx0 = sbr[0] + (str[0] - sbr[0]) * t;
    const ry0 = sbr[1] + (str[1] - sbr[1]) * t;
    const rz0 = sbr[2] + (str[2] - sbr[2]) * t;
    edge(lx0, ly0, lz0, rx0, ry0, rz0, 20);
  }

  // --- BASE (keyboard deck, horizontal) ---
  const bbl = [-bw / 2,  8, -bd / 2];
  const bbr = [ bw / 2,  8, -bd / 2];
  const bfl = [-bw / 2,  8,  bh];
  const bfr = [ bw / 2,  8,  bh];

  edge(...bbl, ...bbr, 36);   // back edge
  edge(...bbr, ...bfr, 14);   // right edge
  edge(...bfr, ...bfl, 36);   // front edge
  edge(...bfl, ...bbl, 14);   // left edge

  // Keyboard rows on top surface
  for (let row = 0; row < 4; row++) {
    const t = (row + 1) / 5;
    const y = 8;
    const zr = bbl[2] + (bfl[2] - bbl[2]) * t;
    edge(-bw * 0.45, y, zr,  bw * 0.45, y, zr, 16);
  }

  // Side thickness of base
  edge(...bbl, bbl[0], bbl[1] + 8, bbl[2], 4);
  edge(...bbr, bbr[0], bbr[1] + 8, bbr[2], 4);
  edge(...bfl, bfl[0], bfl[1] + 8, bfl[2], 4);
  edge(...bfr, bfr[0], bfr[1] + 8, bfr[2], 4);

  return pts;
}

export default function StreamToPCAnimation() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const TRAIL_LEN = 20; // comet tail length
    const NUM = 180;

    const rand = (seed) => {
      let x = Math.sin(seed + 1.3) * 43758.5453;
      return x - Math.floor(x);
    };

    // Each particle has a trail array
    const particles = Array.from({ length: NUM }, (_, i) => ({
      id: i,
      sy: rand(i * 3.1),           // normalized start Y (0-1)
      waveAmp: 15 + rand(i * 1.7) * 28,
      waveFreq: 1.2 + rand(i * 2.3) * 2.5,
      wavePhaseOffset: rand(i * 4.7) * Math.PI * 2,
      speed: 0.10 + rand(i * 0.9) * 0.16,  // slower
      hue: 190 + rand(i * 5.5) * 55,
      alpha: 0.22 + rand(i * 6.1) * 0.22,
      progress: rand(i * 7.3),
      trail: [],   // { x, y }[]
    }));

    let lastTime = performance.now();

    const draw = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Slower phase: full cycle ~6s
      phaseRef.current = (phaseRef.current + dt / 6) % 1;
      const phase = phaseRef.current;

      const w = W();
      const h = H();
      const laptopPts = getLaptopPoints3D(w, h);

      // Fade canvas for motion blur (instead of full clear — creates trails naturally)
      ctx.fillStyle = 'rgba(2, 4, 10, 0.18)';
      ctx.fillRect(0, 0, w, h);

      // Blend factor: how much each particle moves toward its laptop target
      let blend = 0;
      if (phase < 0.3) blend = 0;
      else if (phase < 0.58) blend = (phase - 0.3) / 0.28;
      else if (phase < 0.78) blend = 1;
      else blend = 1 - (phase - 0.78) / 0.18;
      blend = blend * blend * (3 - 2 * blend); // smoothstep

      for (let i = 0; i < NUM; i++) {
        const p = particles[i];

        p.progress = (p.progress + p.speed * dt) % 1;

        const streamX = p.progress * (w + 80) - 40;
        const streamY =
          (p.sy * h) +
          Math.sin(p.progress * p.waveFreq * Math.PI * 2 + p.wavePhaseOffset) * p.waveAmp;

        const target = laptopPts[Math.floor((i / NUM) * laptopPts.length)];
        const targetX = target?.x ?? w * 0.76;
        const targetY = target?.y ?? h * 0.38;

        const x = streamX * (1 - blend) + targetX * blend;
        const y = streamY * (1 - blend) + targetY * blend;

        // Push to trail
        p.trail.push({ x, y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        // Draw comet tail
        for (let t = 1; t < p.trail.length; t++) {
          const frac = t / p.trail.length;       // 0 = old, 1 = current
          const a = p.trail[t - 1];
          const b = p.trail[t];
          const alphaVal = p.alpha * frac * frac; // quadratic fade
          const width = frac * (1.5 + blend * 1.5);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${alphaVal})`;
          ctx.lineWidth = width * 0.7;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        const headR = 0.8 + blend * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, headR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${p.alpha * 0.8})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
