import type { Transition } from 'framer-motion';

/**
 * The only three springs on the site.
 *
 * Apple's guidance: critically damped by default (no overshoot), and bounce only
 * when the user's own gesture carried momentum. Nothing here is a drag or flick,
 * so `momentum` is reserved for future gesture work.
 */
export const spring = {
  /** Most UI: indicators, reveals, layout changes. */
  default: { type: 'spring', bounce: 0, duration: 0.35 } as Transition,
  /** Presses, toggles, small state swaps. */
  snappy: { type: 'spring', bounce: 0, duration: 0.2 } as Transition,
  /** Only after a drag or flick. */
  momentum: { type: 'spring', bounce: 0.15, duration: 0.4 } as Transition,
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
