import React, { useEffect, useState } from "react";
import { THEME } from "./types";

type Props = {
  pathId: string;
  duration?: number;
  begin?: number;
  radius?: number;
  color?: string;
  comet?: boolean;
};

/**
 * PulseDot — circle that loops along the referenced SVG path.
 *
 * Implementation: samples the path post-mount via `getPointAtLength` and
 * uses native SVG SMIL `<animate>` on the circle's `cx`/`cy` attributes.
 *
 * We avoid `<animateMotion>` because Chrome mis-positions the dot when the
 * parent SVG has a non-square viewBox. Animating cx/cy directly works
 * correctly with viewBox scaling.
 */
export function PulseDot({
  pathId,
  duration = 3,
  begin = 0,
  radius = 8,
  color = THEME.accent,
  comet = true,
}: Props) {
  const [samples, setSamples] = useState<Array<{ x: number; y: number }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tryLoad = () => {
      const path = document.getElementById(pathId) as unknown as SVGPathElement | null;
      if (!path || typeof path.getTotalLength !== "function") return false;
      const len = path.getTotalLength();
      if (!len) return false;
      const N = 32;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i <= N; i++) {
        const p = path.getPointAtLength((i / N) * len);
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

  const xValues = samples.map((p) => p.x.toFixed(2)).join(";");
  const yValues = samples.map((p) => p.y.toFixed(2)).join(";");
  const keyTimes = samples
    .map((_, i) => (i / (samples.length - 1)).toFixed(4))
    .join(";");
  const dur = `${duration}s`;
  const beg = `${begin}s`;

  const renderCircle = (r: number, opacity: number) => (
    <circle
      r={r}
      fill={color}
      opacity={opacity}
      cx={samples[0].x}
      cy={samples[0].y}
    >
      <animate
        attributeName="cx"
        dur={dur}
        begin={beg}
        repeatCount="indefinite"
        values={xValues}
        keyTimes={keyTimes}
        calcMode="linear"
      />
      <animate
        attributeName="cy"
        dur={dur}
        begin={beg}
        repeatCount="indefinite"
        values={yValues}
        keyTimes={keyTimes}
        calcMode="linear"
      />
    </circle>
  );

  return (
    <g>
      {comet && renderCircle(radius * 1.8, 0.18)}
      {renderCircle(radius, 1)}
    </g>
  );
}
