import React from "react";
import { THEME } from "./types";

type Props = {
  id: string;
  from: { xPct: number; yPct: number };
  to: { xPct: number; yPct: number };
  /**
   * Curve magnitude. 0 = straight line. Positive = bow right of direct path,
   * negative = bow left. ~0.2 looks natural for most layouts.
   */
  curve?: number;
  variant?: "solid" | "dashed" | "dotted";
  emphasis?: "normal" | "dim" | "highlight";
  /** show arrowhead at `to` end */
  arrowhead?: boolean;
};

/**
 * Arrow — SVG path drawn between two percentage anchors. Static baseline
 * stroke; pulse traffic is rendered separately via PulseDot referencing this
 * path's id.
 *
 * Renders inside a viewBox of 100x100 so percentages map 1:1 to user units.
 * Caller wraps multiple Arrows in a single SvgLayer.
 */
export function Arrow({
  id,
  from,
  to,
  curve = 0,
  variant = "solid",
  emphasis = "normal",
  arrowhead = true,
}: Props) {
  const dx = to.xPct - from.xPct;
  const dy = to.yPct - from.yPct;

  // Quadratic control point: midpoint pushed perpendicular by `curve` * length
  const midX = (from.xPct + to.xPct) / 2;
  const midY = (from.yPct + to.yPct) / 2;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cpX = midX + nx * curve * len;
  const cpY = midY + ny * curve * len;

  // Scale into the SvgLayer viewBox (1600 × 900 = 16:9). Each percent unit
  // equals 16 user units horizontally and 9 vertically — so animateMotion
  // (which works in user space) traces the path with consistent ratio.
  const SX = 16, SY = 9;
  const d = `M ${from.xPct * SX} ${from.yPct * SY} Q ${cpX * SX} ${cpY * SY} ${to.xPct * SX} ${to.yPct * SY}`;

  const stroke =
    emphasis === "highlight" ? THEME.accent
    : emphasis === "dim" ? THEME.border
    : THEME.muted;

  const dash =
    variant === "dashed" ? "1.2 1.2"
    : variant === "dotted" ? "0.4 0.8"
    : undefined;

  return (
    <path
      id={id}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={3.5}
      strokeOpacity={emphasis === "dim" ? 0.5 : 0.85}
      strokeDasharray={dash ? dash.split(' ').map(n => Number(n) * 10).join(' ') : undefined}
      markerEnd={arrowhead ? "url(#arrowhead)" : undefined}
      strokeLinecap="round"
    />
  );
}

/**
 * SvgLayer — single SVG viewport that hosts all Arrows + PulseDots for a
 * diagram. Use once per DiagramFrame.
 */
export function SvgLayer({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    >
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={THEME.muted} opacity="0.85" />
        </marker>
        <marker
          id="arrowhead-accent"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={THEME.accent} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}
