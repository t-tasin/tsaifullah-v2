import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TarsIdleCard() {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdle = () => {
    setIsIdle(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 5000); // 5 seconds of hovering without moving
  };

  const handleMouseLeave = () => {
    setIsIdle(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div 
      className="text-muted leading-relaxed mb-6 min-h-[5rem]"
      onMouseEnter={resetIdle}
      onMouseMove={resetIdle}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isIdle ? (
          <motion.p
            key="normal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="m-0"
          >
            Personal AI assistant, self-hosted on my apartment server. Continuously running, handling ambient automation across my life — my "second brain." In active development.
          </motion.p>
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
