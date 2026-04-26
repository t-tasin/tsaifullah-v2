import React from "react";

type Props = {
  label?: string;
  caption?: string;
  aspect?: string;
  children: React.ReactNode;
};

/**
 * DiagramFrame — outer card for every diagram. Matches AtlasDeskDemo card
 * styling so all visuals feel like one family.
 *
 * Layout: full-bleed `relative` stage. Children position themselves with
 * percentage coordinates. SVG arrow layer + HTML node layer share the stage.
 */
export function DiagramFrame({
  label,
  caption,
  aspect = "aspect-video",
  children,
}: Props) {
  return (
    <div
      className={`w-full ${aspect} bg-surface border border-border rounded-lg overflow-hidden relative font-sans shadow-2xl`}
      style={{ backgroundColor: "#111113" }}
    >
      <div className="absolute inset-0 schematic-bg opacity-30" />

      {label && (
        <div className="absolute top-3 left-4 z-20 font-mono text-[10px] tracking-widest uppercase text-muted">
          {label}
        </div>
      )}

      <div className="absolute inset-0 z-10">{children}</div>

      {caption && (
        <div className="absolute top-3 right-4 z-20 font-mono text-[10px] tracking-widest uppercase text-muted opacity-60">
          {caption}
        </div>
      )}
    </div>
  );
}
