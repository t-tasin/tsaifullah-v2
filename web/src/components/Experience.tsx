import React, { useId, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { spring } from '../lib/motion';
import { track } from '../lib/analytics';
import type { Lens, Role } from '../data/experience';

type Filter = 'all' | Lens;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'product', label: 'Product' },
  { id: 'engineering', label: 'Engineering' },
];

type Props = { roles: Role[] };

/**
 * Experience, readable through a lens.
 *
 * The segmented control filters highlights to the product side, the
 * engineering side, or both. Roles expand in place; several can be open at once.
 * Everything animates from its current state, so rapid toggling never queues.
 */
export default function Experience({ roles }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Set<string>>(() => new Set([roles[0]?.id]));
  const uid = useId();

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <MotionConfig reducedMotion="user" transition={spring.default}>
      <div
        role="group"
        aria-label="Show highlights from"
        className="inline-flex p-1 mb-8 rounded-full border border-border bg-surface/80"
      >
        {FILTERS.map((f) => {
          const selected = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (f.id !== filter) track('lens_filter', { lens: f.id });
                setFilter(f.id);
              }}
              className={`pressable relative px-3.5 sm:px-4 h-8 rounded-full text-sm transition-colors duration-200 ${
                selected ? 'text-background' : 'text-muted hover:text-foreground'
              }`}
            >
              {selected && (
                <motion.span layoutId={`${uid}-lens`} className="absolute inset-0 rounded-full bg-foreground" />
              )}
              <span className="relative font-medium">{f.label}</span>
            </button>
          );
        })}
      </div>

      <ol className="border-t border-border">
        {roles.map((role) => {
          const highlights = role.highlights.filter((h) => filter === 'all' || h.lens.includes(filter));
          const isOpen = open.has(role.id);
          const isCurrent = role.end === 'Present';
          const panelId = `${uid}-${role.id}`;

          return (
            <li key={role.id} className="border-b border-border">
              <button
                type="button"
                onClick={() => toggle(role.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group w-full text-left py-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 items-baseline"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-foreground font-semibold tracking-[-0.01em] text-[1.0625rem]">{role.title}</span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-label="Current role" />
                    )}
                  </span>
                  <span className="block text-muted mt-0.5">{role.org}</span>
                </span>
                <span className="flex items-center gap-3 font-mono text-xs text-faint tabular-nums whitespace-nowrap">
                  <span className="hidden sm:inline">
                    {role.start} — {role.end}
                  </span>
                  <motion.svg
                    viewBox="0 0 12 12"
                    className="w-3 h-3 text-muted group-hover:text-foreground"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    aria-hidden="true"
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </span>
                <span className="sm:hidden col-span-2 font-mono text-xs text-faint tabular-nums">
                  {role.start} — {role.end}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      {role.context && <p className="text-muted mb-4 max-w-[62ch]">{role.context}</p>}
                      <ul className="flex flex-col">
                        <AnimatePresence initial={false}>
                          {highlights.map((h) => (
                            <motion.li
                              key={h.text}
                              layout="position"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="relative pl-5 pb-3 text-[0.9375rem] leading-relaxed text-muted max-w-[68ch]">
                                <span className="absolute left-0 top-[0.7em] w-1.5 h-px bg-accent" aria-hidden="true" />
                                {h.text}
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                        {highlights.length === 0 && (
                          <li className="pl-5 pb-3 text-faint text-sm">
                            Nothing from the {filter} side in this role.
                          </li>
                        )}
                      </ul>
                      {role.href && (
                        <a href={role.href} className="pressable inline-flex mt-2 ml-5 text-sm text-accent hover:text-foreground transition-colors">
                          Read the case study →
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </MotionConfig>
  );
}
