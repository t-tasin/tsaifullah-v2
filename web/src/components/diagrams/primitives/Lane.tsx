import React from "react";

type Props = {
  label: string;
  yPct: number;
  /** when true, draws a faint horizontal guide line */
  guide?: boolean;
};

/**
 * Lane — horizontal swim-lane label. Sets architectural layer (EDGE / SERVICES / DATA).
 */
export function Lane({ label, yPct, guide = true }: Props) {
  return (
    <>
      <div
        className="absolute left-4 z-10 font-mono text-[9px] tracking-[0.2em] uppercase text-muted/60"
        style={{ top: `calc(${yPct}% - 60px)` }}
      >
        {label}
      </div>
      {guide && (
        <div
          className="absolute left-0 right-0 border-t border-dashed border-border/40 z-0"
          style={{ top: `${yPct}%` }}
        />
      )}
    </>
  );
}
