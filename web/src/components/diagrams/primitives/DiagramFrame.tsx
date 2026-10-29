import React, { useEffect, useRef } from "react";

type Props = {
  label?: string;
  caption?: string;
  aspect?: string;
  children: React.ReactNode;
};

/**
 * DiagramFrame — outer card for every diagram, so all visuals feel like one family.
 *
 * Layout: full-bleed `relative` stage. Children position themselves with
 * percentage coordinates. SVG arrow layer + HTML node layer share the stage.
 *
 * On phones the stage keeps a fixed design width inside a horizontal scroller,
 * so labels stay at their designed size instead of shrinking to unreadable.
 * Pulse animations pause while the frame is off screen.
 */
export function DiagramFrame({
  label,
  caption,
  aspect = "aspect-video",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      el.querySelectorAll("svg").forEach((svg) => {
        if (typeof (svg as SVGSVGElement).pauseAnimations !== "function") return;
        entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations();
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="m-0">
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
        <div
          ref={ref}
          className={`w-full min-w-[720px] sm:min-w-0 ${aspect} bg-surface border border-border rounded-xl overflow-hidden relative font-sans`}
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
      </div>
      <figcaption className="sm:hidden mt-2 text-xs text-faint">Scroll sideways to see the whole diagram.</figcaption>
    </figure>
  );
}
