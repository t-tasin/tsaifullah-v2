import React, { useEffect, useState } from 'react';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import { spring } from '../lib/motion';

type Item = { id: string; label: string; href: string };

const ITEMS: Item[] = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'experience', label: 'Experience', href: '/#experience' },
  { id: 'research', label: 'Research', href: '/#research' },
  { id: 'about', label: 'About', href: '/about' },
];

const SECTION_IDS = ['work', 'experience', 'research'];

/**
 * Primary navigation. One pill marks where you are and springs to the next
 * place you go, so the movement itself says which way you travelled.
 * Persisted across View Transitions so the pill can animate between pages.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const sync = () => {
      observer?.disconnect();
      const path = window.location.pathname;

      if (path.startsWith('/about')) return setActive('about');
      if (path.startsWith('/projects')) return setActive('work');
      if (path !== '/') return setActive(null);

      // Home: follow the section in the middle of the viewport.
      setActive(null);
      const visible = new Map<string, boolean>();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
          const current = SECTION_IDS.find((id) => visible.get(id));
          setActive(current ?? null);
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer!.observe(el);
      });
    };

    sync();
    document.addEventListener('astro:page-load', sync);
    return () => {
      observer?.disconnect();
      document.removeEventListener('astro:page-load', sync);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={spring.default}>
      <nav aria-label="Primary" className="flex items-center gap-0.5 text-sm">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`pressable relative px-2.5 sm:px-3 py-1.5 rounded-full transition-colors duration-200 ${
                isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/[0.06]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </MotionConfig>
  );
}
