import React, { useEffect, useRef } from 'react';
import { nodesData } from './avatarNodesData';

type Props = {
  /** Play the assemble sequence. Off = render the finished face immediately. */
  animate?: boolean;
  className?: string;
};

const SESSION_KEY = 'ts-avatar-played';

// viewBox the node data was authored in
const VB = { x: -20, y: -20, w: 140, h: 140 };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * The node-swarm portrait, drawn on one <canvas>.
 *
 * It assembles once per browser session (scattered → face → traced line), then
 * stays still. Under reduced motion, or on later visits, it renders the final
 * frame directly. One canvas replaces ~450 animated SVG elements.
 */
export default function LivingAvatar({ animate = true, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(canvas);
    const fg = styles.getPropertyValue('--avatar-fg').trim() || '#f4f4f5';
    const accent = styles.getPropertyValue('--avatar-accent').trim() || '#6fdcaa';

    let size = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const px = (v: number, axis: 'x' | 'y') => ((v - (axis === 'x' ? VB.x : VB.y)) / VB.w) * size;

    // t in seconds since start. Timeline: assemble 0–1.4, hold, morph 1.8–3.4, trace 3.4–5.6.
    const draw = (t: number) => {
      ctx.clearRect(0, 0, size, size);
      const assemble = easeOut(clamp01(t / 1.4));
      const morph = easeInOut(clamp01((t - 1.8) / 1.6));
      const trace = easeInOut(clamp01((t - 3.4) / 2.2));

      const pts = nodesData.map((n) => {
        const ax = n.hx + (n.ax - n.hx) * assemble;
        const ay = n.hy + (n.ay - n.hy) * assemble;
        return { x: px(ax + (n.fx - ax) * morph, 'x'), y: px(ay + (n.fy - ay) * morph, 'y') };
      });

      // Faint network edges, fading as the face resolves
      ctx.globalAlpha = 0.18 * assemble * (1 - 0.6 * morph);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 1; i < Math.min(150, pts.length); i++) {
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // Nodes
      ctx.globalAlpha = assemble * (1 - 0.45 * morph);
      ctx.fillStyle = fg;
      const r = Math.max(0.8, size / 360);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // The single traced line through every node
      if (trace > 0) {
        const count = Math.max(2, Math.floor(trace * pts.length));
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(1, size / 230);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < count; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const END = 5.6;
    let raf = 0;
    let disposed = false;

    resize();

    let played = false;
    try {
      played = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const willPlay = animate && !reduce && !played;
    // Last drawn time, so a resize redraws the same frame instead of jumping ahead.
    let lastT = willPlay ? 0 : END;

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(lastT);
    });
    ro.observe(canvas);

    if (!willPlay) {
      draw(END);
    } else {
      // Start only once the canvas is on screen.
      const io = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting || disposed) return;
        io.disconnect();
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {}
        const start = performance.now();
        const tick = (now: number) => {
          if (disposed) return;
          const t = Math.min(END, (now - start) / 1000);
          lastT = t;
          draw(t);
          if (t < END) raf = requestAnimationFrame(tick);
          else raf = 0;
        };
        raf = requestAnimationFrame(tick);
      });
      io.observe(canvas);
      return () => {
        disposed = true;
        io.disconnect();
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    }

    return () => {
      disposed = true;
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block w-full aspect-square [--avatar-fg:theme(colors.foreground)] [--avatar-accent:theme(colors.accent)] ${className}`}
    />
  );
}
