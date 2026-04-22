import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { nodesData } from './avatarNodesData';

export default function LivingAvatar() {
  const controls = useAnimation();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    async function sequence() {
      // Step 1: Fly in to scattered abstract topology
      await controls.start("abstract");
      setPhase(1);
      
      // Step 2: Hold briefly, then snap to face shape
      await new Promise(resolve => setTimeout(resolve, 800));
      await controls.start("face");
      setPhase(2);

      // Step 3: Draw the tracing line
      await controls.start("trace");
      setPhase(3);
    }
    
    // Slight initial delay to let the page load
    setTimeout(sequence, 500);
  }, [controls]);

  // Create the path string that connects all nodes in order (Nearest Neighbor TSP sorted)
  const pathData = nodesData.reduce((acc, node, i) => {
    return acc + (i === 0 ? `M ${node.fx} ${node.fy}` : ` L ${node.fx} ${node.fy}`);
  }, "");

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative flex items-center justify-center">
      <svg viewBox="-20 -20 140 140" className="w-full h-full overflow-visible opacity-90">
        
        {/* Faint network lines (shown in phase 1 & 2) */}
        {nodesData.slice(0, 150).map((n, i) => {
          if (i === 0) return null;
          const prev = nodesData[i - 1];
          return (
            <motion.line
              key={`edge-${i}`}
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-muted/30"
              variants={{
                hidden: { opacity: 0 },
                abstract: { opacity: 1, x1: prev.ax, y1: prev.ay, x2: n.ax, y2: n.ay, transition: { duration: 2 } },
                face: { opacity: 0.2, x1: prev.fx, y1: prev.fy, x2: n.fx, y2: n.fy, transition: { duration: 2, ease: "easeInOut" } },
                trace: { opacity: 0.1, x1: prev.fx, y1: prev.fy, x2: n.fx, y2: n.fy }
              }}
              initial="hidden"
              animate={controls}
            />
          );
        })}

        {/* The nodes */}
        {nodesData.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            r="0.4"
            fill="currentColor"
            className="text-foreground"
            variants={{
              hidden: { cx: node.hx, cy: node.hy, opacity: 0 },
              abstract: { cx: node.ax, cy: node.ay, opacity: 1, transition: { duration: 1.5, delay: (i % 20) * 0.05, type: "spring", bounce: 0.1 } },
              face: { cx: node.fx, cy: node.fy, opacity: 0.6, transition: { duration: 2, ease: "easeInOut" } },
              trace: { cx: node.fx, cy: node.fy, opacity: 0.4 }
            }}
            initial="hidden"
            animate={controls}
          />
        ))}

        {/* The continuous tracing line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-accent"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            abstract: { pathLength: 0, opacity: 0 },
            face: { pathLength: 0, opacity: 1 },
            trace: { pathLength: 1, opacity: 0.8, transition: { duration: 4, ease: "easeInOut" } }
          }}
          initial="hidden"
          animate={controls}
        />
      </svg>
      
      {/* Dynamic Label */}
      <motion.span 
        className="font-mono text-muted text-[10px] absolute bottom-8 right-8 opacity-50 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase > 0 ? 0.5 : 0 }}
        transition={{ duration: 1 }}
      >
        {phase === 1 && "SYS.SWARM_TOPOLOGY"}
        {phase === 2 && "SYS.ALIGNING"}
        {phase === 3 && "SYS.MAPPED_SUBJECT_T"}
      </motion.span>
    </div>
  );
}
