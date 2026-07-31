'use client';

import { useRef, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_MARKERS: { lat: number; lng: number; label?: string }[] = [
  { lat: 28.61,  lng: 77.21,   label: 'Delhi'       },
  { lat: 37.78,  lng: -122.42, label: 'San Francisco'},
  { lat: 51.51,  lng: -0.13,   label: 'London'      },
  { lat: 35.68,  lng: 139.69,  label: 'Tokyo'       },
  { lat: -33.87, lng: 151.21,  label: 'Sydney'      },
  { lat: 1.35,   lng: 103.82,  label: 'Singapore'   },
  { lat: 48.85,  lng: 2.35,    label: 'Paris'       },
  { lat: 40.71,  lng: -74.01,  label: 'New York'    },
  { lat: 19.43,  lng: -99.13,  label: 'Mexico City' },
  { lat: 55.76,  lng: 37.62,   label: 'Moscow'      },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  { from: [28.61,  77.21],   to: [51.51,  -0.13]   },
  { from: [28.61,  77.21],   to: [1.35,   103.82]  },
  { from: [28.61,  77.21],   to: [35.68,  139.69]  },
  { from: [37.78,  -122.42], to: [51.51,  -0.13]   },
  { from: [37.78,  -122.42], to: [1.35,   103.82]  },
  { from: [51.51,  -0.13],   to: [48.85,  2.35]    },
  { from: [51.51,  -0.13],   to: [55.76,  37.62]   },
  { from: [35.68,  139.69],  to: [-33.87, 151.21]  },
  { from: [1.35,   103.82],  to: [-33.87, 151.21]  },
  { from: [40.71,  -74.01],  to: [37.78,  -122.42] },
];

// ─── Math Helpers ─────────────────────────────────────────────────────────────

function latLngToXYZ(
  lat: number,
  lng: number,
  radius: number,
): [number, number, number] {
  const phi   = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

function rotateX(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function project(
  x: number, y: number, z: number,
  cx: number, cy: number, fov: number,
): [number, number, number] {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InteractiveGlobe({
  className,
  size = 460,
  // White dots — matches black/white portfolio theme
  dotColor     = 'rgba(255, 255, 255, ALPHA)',
  // Soft white arcs
  arcColor     = 'rgba(255, 255, 255, 0.18)',
  // Bright white markers
  markerColor  = 'rgba(255, 255, 255, 1)',
  autoRotateSpeed = 0.0018,
  connections  = DEFAULT_CONNECTIONS,
  markers      = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef   = useRef(0.4);
  const rotXRef   = useRef(0.15);
  const dragRef   = useRef({
    active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0,
  });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Pre-computed Fibonacci sphere dots
  const dotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
    const numDots    = 1400;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const dots: [number, number, number][] = [];

    for (let i = 0; i < numDots; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / numDots);
      dots.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ]);
    }
    dotsRef.current = dots;
  }, []);

  // ── Draw loop ──────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.clientWidth;
    const h   = canvas.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx     = w / 2;
    const cy     = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov    = 600;

    // Auto-rotate when not dragging
    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.015;
    const time = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    // Subtle white ambient glow
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.6);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.015)');
    glow.addColorStop(1,   'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Subtle globe border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    // Inner rim highlight
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    const rimGrad = ctx.createRadialGradient(
      cx - radius * 0.3, cy - radius * 0.3, 0,
      cx, cy, radius,
    );
    rimGrad.addColorStop(0,   'rgba(255, 255, 255, 0.05)');
    rimGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.02)');
    rimGrad.addColorStop(1,   'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rimGrad;
    ctx.fill();

    const ry = rotYRef.current;
    const rx = rotXRef.current;

    // ── Dots ────────────────────────────────────────────────────────────────
    for (const dot of dotsRef.current) {
      let [x, y, z] = [dot[0] * radius, dot[1] * radius, dot[2] * radius];
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > 0) continue; // back-face cull

      const [sx, sy]   = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      const dotSize    = 0.9 + depthAlpha * 0.7;

      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace('ALPHA', depthAlpha.toFixed(2));
      ctx.fill();
    }

    // ── Arcs + travelling dots ───────────────────────────────────────────────
    for (const conn of connections) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);

      [x1, y1, z1] = rotateX(x1, y1, z1, rx);
      [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx);
      [x2, y2, z2] = rotateY(x2, y2, z2, ry);

      // Skip if both endpoints are on back face
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      // Elevated midpoint for smooth arc curve
      const mx   = (x1 + x2) / 2;
      const my   = (y1 + y2) / 2;
      const mz   = (z1 + z2) / 2;
      const mLen = Math.sqrt(mx * mx + my * my + mz * mz);
      const lift = radius * 1.28;
      const [scx, scy] = project(
        (mx / mLen) * lift, (my / mLen) * lift, (mz / mLen) * lift,
        cx, cy, fov,
      );

      // Draw arc
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Travelling glow dot
      const t  = (Math.sin(time * 1.1 + conn.from[0] * 0.08) + 1) / 2;
      const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
      const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;

      // Outer glow
      const tGlow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 6);
      tGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      tGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fillStyle = tGlow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();
    }

    // ── Markers ─────────────────────────────────────────────────────────────
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);

      if (z > radius * 0.1) continue; // back-face cull

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse    = Math.sin(time * 2.2 + marker.lat * 0.07) * 0.5 + 0.5;

      // Pulse ring
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + pulse * 0.18})`;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Core marker dot
      const mGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 3.5);
      mGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      mGrad.addColorStop(1, 'rgba(200, 200, 200, 0.7)');
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = mGrad;
      ctx.fill();

      // Label
      if (marker.label) {
        ctx.font      = '10px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(marker.label, sx + 7, sy + 3);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = {
      active:    true,
      startX:    e.clientX,
      startY:    e.clientY,
      startRotY: rotYRef.current,
      startRotX: rotXRef.current,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    rotYRef.current = dragRef.current.startRotY + dx * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + dy * 0.005));
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={['cursor-grab active:cursor-grabbing select-none', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, maxWidth: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
