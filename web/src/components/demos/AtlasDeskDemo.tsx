import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtlasDeskDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 14 second loop
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full aspect-video bg-surface border border-border rounded-lg overflow-hidden flex flex-col relative font-sans text-sm shadow-2xl">
      {/* Header bar */}
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-border/50"></div>
          <div className="w-3 h-3 rounded-full bg-border/50"></div>
          <div className="w-3 h-3 rounded-full bg-border/50"></div>
        </div>
        <div className="font-mono text-xs text-muted">AtlasDesk Copilot</div>
        <div className="w-12"></div>
      </div>

      <div className="flex-grow p-6 flex flex-col gap-4 relative">
        <AnimatePresence mode="wait">
          {step >= 0 && (
            <motion.div 
              key="user-input"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-background border border-border p-4 rounded text-muted w-3/4 self-start"
            >
              "laptop won't connect to campus wifi after update"
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute right-6 top-6 w-64 bg-background border border-accent/30 rounded p-4 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2 text-accent font-mono text-xs">
                <span className="animate-pulse">●</span> AI Copilot
              </div>
              <p className="text-foreground text-xs mb-2">89% similar to #2341</p>
              <p className="text-muted text-xs">Fix: Reinstall MDM profile. Draft ready.</p>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div 
              key="draft"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 p-4 rounded text-foreground w-3/4 self-end mt-12 relative"
            >
              <p>Hi there, it looks like the recent update disrupted the MDM profile. Please follow these steps to reinstall it...</p>
              
              {step >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-8 right-0 bg-accent text-background px-3 py-1 rounded font-medium text-xs shadow-lg"
                >
                  Send Reply
                </motion.div>
              )}
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div 
              key="closed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-sm flex items-center justify-center flex-col z-10"
            >
              <div className="text-4xl text-accent mb-2">✓</div>
              <div className="font-mono text-muted text-sm tracking-widest uppercase">Ticket Closed</div>
              <div className="font-mono text-foreground mt-2">45 min &rarr; 14 seconds</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
