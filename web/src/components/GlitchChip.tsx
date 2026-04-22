import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchChipProps {
  originalText: string;
  glitchText: string;
  className?: string;
}

export default function GlitchChip({ originalText, glitchText, className = "" }: GlitchChipProps) {
  const [state, setState] = useState<'normal' | 'glitch' | 'restored'>('normal');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (state !== 'normal') return;
    
    // Trigger glitch
    setState('glitch');
    
    // After 600ms, restore
    timeoutRef.current = setTimeout(() => {
      setState('restored');
      
      // After another 1.5s, go back to normal so it can trigger again
      setTimeout(() => {
        setState('normal');
      }, 1500);
    }, 600);
  };

  return (
    <span 
      className={`px-2 py-1 border font-mono text-xs cursor-crosshair transition-colors duration-75 relative overflow-hidden inline-block ${className}
        ${state === 'normal' ? 'border-border text-foreground bg-surface/50' : ''}
        ${state === 'glitch' ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
        ${state === 'restored' ? 'border-accent text-accent bg-accent/10' : ''}
      `}
      onMouseEnter={handleMouseEnter}
    >
      <AnimatePresence mode="popLayout">
        {state === 'normal' && (
          <motion.span key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(2px)' }}>
            {originalText}
          </motion.span>
        )}
        {state === 'glitch' && (
          <motion.span 
            key="glitch" 
            initial={{ opacity: 0, x: -5 }} 
            animate={{ opacity: 1, x: [0, -2, 2, -1, 0] }} 
            transition={{ duration: 0.2 }}
            className="font-bold"
          >
            {glitchText}
          </motion.span>
        )}
        {state === 'restored' && (
          <motion.span key="restored" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            [RESTORED] {originalText}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
