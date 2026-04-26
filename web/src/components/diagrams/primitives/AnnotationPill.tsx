import React from "react";

type Props = {
  xPct: number;
  yPct: number;
  text: string;
  tone?: "muted" | "accent" | "warn";
  /** offset alignment from anchor point */
  align?: "center" | "left" | "right";
};

/**
 * AnnotationPill — small mono uppercase tag for callouts on arrows/nodes.
 * Tone "accent" highlights credibility-flex pills (single-writer rules,
 * matrix authz, etc.). "warn" is reserved for guard/gate annotations.
 */
export function AnnotationPill({
  xPct,
  yPct,
  text,
  tone = "muted",
  align = "center",
}: Props) {
  const toneClass =
    tone === "accent"
      ? "border-accent/40 text-accent bg-accent/[0.08]"
      : tone === "warn"
        ? "border-amber-500/40 text-amber-400 bg-amber-500/[0.08]"
        : "border-border text-muted bg-background/80";

  const alignClass =
    align === "left"
      ? "translate-x-0"
      : align === "right"
        ? "-translate-x-full"
        : "-translate-x-1/2";

  return (
    <div
      className={`absolute -translate-y-1/2 ${alignClass} px-2 py-0.5 rounded-sm border ${toneClass} backdrop-blur-sm font-mono text-[8px] tracking-[0.15em] uppercase whitespace-nowrap z-20`}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      {text}
    </div>
  );
}
