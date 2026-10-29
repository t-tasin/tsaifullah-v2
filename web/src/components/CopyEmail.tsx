import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { spring } from '../lib/motion';
import { track } from '../lib/analytics';

const EMAIL = 'tsaifullah25@gmail.com';

type Props = { variant?: 'button' | 'link' };

/**
 * Copies the address instead of launching a mail client. The label swaps to
 * "Copied" on the same frame as the copy, which is the completion feedback.
 */
export default function CopyEmail({ variant = 'button' }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    track('copy_email', { location: variant === 'button' ? 'hero' : 'footer' });
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const base =
    variant === 'button'
      ? 'pressable inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:bg-white'
      : 'pressable inline-flex items-center gap-1.5 text-muted hover:text-foreground transition-colors';

  return (
    <MotionConfig reducedMotion="user" transition={spring.snappy}>
      <button type="button" onClick={copy} className={base} aria-live="polite">
        <span className="relative inline-flex w-4 h-4 items-center justify-center" aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            {copied ? (
              <motion.svg
                key="check"
                viewBox="0 0 16 16"
                className="w-4 h-4"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                viewBox="0 0 16 16"
                className="w-4 h-4"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 3.5v-.25A1.25 1.25 0 009.25 2h-5.5A1.25 1.25 0 002.5 3.25v5.5A1.25 1.25 0 003.75 10h.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
        {/* Both labels share one grid cell so the button never changes width. */}
        <span className="inline-grid">
          <span className={`[grid-area:1/1] transition-opacity duration-150 ${copied ? 'opacity-0' : 'opacity-100'}`}>
            {variant === 'button' ? 'Copy email' : 'Email'}
          </span>
          <span className={`[grid-area:1/1] transition-opacity duration-150 ${copied ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!copied}>
            Copied
          </span>
        </span>
      </button>
    </MotionConfig>
  );
}
