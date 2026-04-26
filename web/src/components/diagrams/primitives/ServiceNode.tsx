import React from "react";
import type { NodeKind } from "./types";

type Props = {
  xPct: number;
  yPct: number;
  label: string;
  sublabel?: string;
  kind?: NodeKind;
  /** width in % of container */
  widthPct?: number;
  highlight?: boolean;
};

/**
 * ServiceNode — labeled box anchored at percentage coords (centered on the anchor).
 *
 * `kind` shifts visual treatment:
 *   - service: dark surface, accent label
 *   - data: dashed border (DB/store)
 *   - external: muted dotted border (3rd-party)
 *   - client: terminal-green tint
 */
export function ServiceNode({
  xPct,
  yPct,
  label,
  sublabel,
  kind = "service",
  widthPct = 14,
  highlight = false,
}: Props) {
  const borderClass =
    kind === "data"
      ? "border-dashed"
      : kind === "external"
        ? "border-dotted"
        : "border-solid";

  const tintClass =
    kind === "client"
      ? "bg-accent/[0.06] border-accent/40"
      : highlight
        ? "bg-accent/10 border-accent/50"
        : "bg-background/80 border-border";

  return (
    <div
      className={`absolute px-3 py-2 rounded border ${borderClass} ${tintClass} backdrop-blur-sm`}
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${widthPct}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="font-mono text-[10px] tracking-wider uppercase text-foreground leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </div>
      {sublabel && (
        <div className="font-mono text-[9px] text-muted/70 mt-0.5 leading-snug whitespace-normal" style={{ wordBreak: "normal", overflowWrap: "break-word" }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
