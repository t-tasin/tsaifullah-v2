import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TARSDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full aspect-video bg-[#0a0a0b] border border-border rounded-lg overflow-hidden flex relative font-mono text-xs shadow-2xl">
      {/* Sidebar log */}
      <div className="w-1/3 border-r border-border bg-surface p-4 flex flex-col gap-2 overflow-hidden opacity-50">
        <div className="text-muted">14:02:11 [SYS] Idle</div>
        <div className="text-muted">14:15:00 [CRON] Syncing tasks</div>
        <div className="text-muted">14:30:45 [NET] Checking pings</div>
      </div>

      {/* Main interactive area */}
      <div className="w-2/3 p-6 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          {step >= 0 && (
            <motion.div 
              key="trigger"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="border border-border p-3 mb-4 rounded text-muted w-3/4 bg-background"
            >
              [EVENT] 3:45 PM · Calendar: Meeting with Advisor
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface border border-accent/30 p-4 rounded shadow-lg mb-4 ml-8"
            >
              <div className="text-accent mb-2 flex items-center gap-2">
                <span className="animate-spin inline-block">⟳</span> T.A.R.S Inference
              </div>
              <p className="text-foreground">Drafting prep notes based on last email thread...</p>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div 
              key="action"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="border border-accent border-dashed p-4 rounded ml-16 text-accent/80 bg-accent/5"
            >
              <ul className="list-disc pl-4 space-y-1">
                <li>Review Chapter 3 edits</li>
                <li>Discuss simulation boundaries</li>
                <li>Ask about NCUR timeline</li>
              </ul>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute bottom-6 right-6 border border-border bg-background px-4 py-2 rounded text-muted flex flex-col items-end"
            >
              <div className="text-foreground mb-1">Actions Taken:</div>
              <div>&rarr; Sent to Things.</div>
              <div>&rarr; 2 tabs opened.</div>
              <div>&rarr; Lights set to focus.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
