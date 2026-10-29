import React, { useEffect, useState } from "react";
import { THEME } from "./types";

type Props = {
  pathId: string;
  duration?: number;
  begin?: number;
  radius?: number;
  color?: string;
  comet?: boolean;
  /**
   * Optional shared loop length in seconds. When set, the dot travels during
   * [begin, begin + duration] of every `cycle` and is hidden the rest of the
   * time, so several dots can be sequenced into one story that repeats.
   */
  cycle?: number;
};

const N = 32;
// Packets accelerate out and settle in, instead of moving at constant speed.
const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * PulseDot — circle that loops along the referenced SVG path.
 *
 * Implementation: samples the path post-mount via `getPointAtLength` and
 * uses native SVG SMIL `<animate>` on the circle's `cx`/`cy` attributes.
 * Samples are taken at eased distances, so linear keyTimes still produce
 * eased motion. The dot fades in and out at the ends so the loop has no seam.
 *
 * We avoid `<animateMotion>` because Chrome mis-positions the dot when the
 * parent SVG has a non-square viewBox. Animating cx/cy directly works
 * correctly with viewBox scaling.
 *
 * Renders nothing under prefers-reduced-motion: the static arrows carry the meaning.
 */
export function PulseDot({
  pathId,
  duration = 3,
  begin = 0,
  radius = 8,
  color = THEME.accent,
  comet = true,
  cycle,
}: Props) {
  const [samples, setSamples] = useState<Array<{ x: number; y: number }> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const tryLoad = () => {
      const path = document.getElementById(pathId) as unknown as SVGPathElement | null;
      if (!path || typeof path.getTotalLength !== "function") return false;
      const len = path.getTotalLength();
      if (!len) return false;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i <= N; i++) {
        const p = path.getPointAtLength(ease(i / N) * len);
        pts.push({ x: p.x, y: p.y });
      }
      if (!cancelled) setSamples(pts);
      return true;
    };
    if (!tryLoad()) {
      requestAnimationFrame(() => {
        if (!cancelled) tryLoad();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [pathId]);

  if (!samples) return null;

  const fmt = (n: number) => n.toFixed(4);
  const xs = samples.map((p) => p.x.toFixed(2));
  const ys = samples.map((p) => p.y.toFixed(2));

  let dur: string;
  let beg: string;
  let xValues: string;
  let yValues: string;
  let keyTimes: string;
  let opacityValues: string;
  let opacityTimes: string;

  if (cycle && cycle > duration) {
    // Travel inside a window of a longer shared loop.
    const start = Math.max(0, Math.min(begin, cycle - duration)) / cycle;
    const end = start + duration / cycle;
    const fade = Math.min(0.12 * duration, 0.25) / cycle;
    const times = samples.map((_, i) => start + (i / N) * (end - start));
    const hasLead = start > 0;
    const hasTail = end < 1;

    xValues = [...(hasLead ? [xs[0]] : []), ...xs, ...(hasTail ? [xs[N]] : [])].join(";");
    yValues = [...(hasLead ? [ys[0]] : []), ...ys, ...(hasTail ? [ys[N]] : [])].join(";");
    keyTimes = [...(hasLead ? [0] : []), ...times, ...(hasTail ? [1] : [])].map(fmt).join(";");

    const o: Array<[number, number]> = [];
    if (hasLead) o.push([0, 0]);
    o.push([start, 0], [start + fade, 1], [end - fade, 1], [end, 0]);
    if (hasTail) o.push([1, 0]);
    opacityValues = o.map(([, v]) => v).join(";");
    opacityTimes = o.map(([t]) => fmt(t)).join(";");
    dur = `${cycle}s`;
    beg = "0s";
  } else {
    xValues = xs.join(";");
    yValues = ys.join(";");
    keyTimes = samples.map((_, i) => fmt(i / N)).join(";");
    opacityValues = "0;1;1;0";
    opacityTimes = "0;0.1;0.9;1";
    dur = `${duration}s`;
    beg = `${begin}s`;
  }

  const renderCircle = (r: number, opacity: number) => (
    <g opacity={opacity}>
      <circle r={r} fill={color} cx={samples[0].x} cy={samples[0].y} opacity={0}>
        <animate attributeName="cx" dur={dur} begin={beg} repeatCount="indefinite" values={xValues} keyTimes={keyTimes} calcMode="linear" />
        <animate attributeName="cy" dur={dur} begin={beg} repeatCount="indefinite" values={yValues} keyTimes={keyTimes} calcMode="linear" />
        <animate attributeName="opacity" dur={dur} begin={beg} repeatCount="indefinite" values={opacityValues} keyTimes={opacityTimes} calcMode="linear" />
      </circle>
    </g>
  );

  return (
    <g>
      {comet && renderCircle(radius * 1.8, 0.18)}
      {renderCircle(radius, 1)}
    </g>
  );
}
