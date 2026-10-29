import React, { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { spring } from '../lib/motion';

const NAME = 'Tasin';
const DECLARATION = 'const name = ';
const ARRAY = "['T', 'a', 's', 'i', 'n']";

/**
 * The name, with a small easter egg: hover (or tap on touch) reveals it as an
 * array literal.
 *
 * Both layers stay mounted and cross-fade, so the <h1> never leaves the page,
 * and every change animates from whatever is on screen right now. Moving the
 * pointer off mid-reveal reverses immediately instead of finishing first.
 */
export default function AnimatedName() {
  const [revealed, setRevealed] = useState(false);

  return (
    <MotionConfig reducedMotion="user" transition={spring.default}>
      <div
        className="relative inline-block select-none"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setRevealed(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setRevealed(false)}
        onClick={() => setRevealed((r) => !r)}
      >
        <motion.h1
          className="t-display text-foreground"
          animate={{ opacity: revealed ? 0 : 1, y: revealed ? -6 : 0 }}
        >
          {NAME}
        </motion.h1>

        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-sm sm:text-2xl lg:text-[2rem] whitespace-nowrap flex items-center pointer-events-none"
          initial={false}
          animate={revealed ? 'show' : 'hidden'}
          variants={{
            hidden: { opacity: 0, transition: { ...spring.snappy, staggerChildren: 0.01, staggerDirection: -1 } },
            show: { opacity: 1, transition: { ...spring.default, staggerChildren: 0.022 } },
          }}
        >
          <motion.span className="text-faint mr-2" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
            {DECLARATION}
          </motion.span>
          {ARRAY.split('').map((char, i) => (
            <motion.span
              key={i}
              className="text-accent whitespace-pre"
              variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            className="ml-1 inline-block w-[0.5em] h-[1.1em] bg-accent"
            variants={{ hidden: { opacity: 0 }, show: { opacity: [0, 1, 0, 1], transition: { duration: 1.2, delay: 0.6 } } }}
          />
        </motion.div>
      </div>
    </MotionConfig>
  );
}
