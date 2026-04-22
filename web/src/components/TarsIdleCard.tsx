import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TarsIdleCard() {
  const [isIdle, setIsIdle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const parent = containerRef.current?.closest('a');
    if (!parent) return;

    const handleEnter = () => {
      setIsIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsIdle(true), 2500); // 2.5 seconds hover triggers it
    };

    const handleLeave = () => {
      setIsIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // Attach to the parent <a> tag so hovering anywhere on the T.A.R.S card triggers the terminal
    parent.addEventListener('mouseenter', handleEnter);
    parent.addEventListener('mouseleave', handleLeave);

    return () => {
      parent.removeEventListener('mouseenter', handleEnter);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="text-muted mb-4 h-10 w-full"
    >
      <AnimatePresence mode="wait">
        {!isIdle ? (
          <motion.div
            key="normal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-mono text-xs flex items-center p-2 rounded h-full"
          >
            <span className="mr-2 text-accent">&gt; [SYS]</span> Ambient monitoring active. Waiting for events...
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 inline-block w-2 h-4 bg-muted align-middle"
            />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="text-accent font-mono text-xs flex items-center border border-accent/20 bg-accent/5 p-2 rounded h-full"
          >
            <span className="mr-2">&gt; [SYS]</span> User appears to be falling asleep. Initiating emergency coffee order...
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 inline-block w-2 h-4 bg-accent align-middle"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
