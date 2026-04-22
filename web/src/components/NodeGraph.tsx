import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { nodesData } from './nodesData';

export default function NodeGraph() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-full aspect-square bg-surface border border-border rounded flex items-center justify-center overflow-hidden relative group cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 schematic-bg opacity-20"></div>
      
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 overflow-visible">
        
        {/* Draw abstract network lines between some nodes */}
        {nodesData.slice(0, 80).map((n, i) => {
          if (i === 0) return null;
          const prev = nodesData[i - 1];
          return (
            <motion.line
              key={`edge-${i}`}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-muted group-hover:text-accent/20 transition-colors duration-700"
              initial={false}
              animate={{ 
                x1: isHovered ? prev.fx : prev.ax, 
                y1: isHovered ? prev.fy : prev.ay,
                x2: isHovered ? n.fx : n.ax, 
                y2: isHovered ? n.fy : n.ay
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          );
        })}

        {/* The nodes */}
        {nodesData.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            r={isHovered ? 0.8 : 1.2}
            fill="currentColor"
            className="text-foreground group-hover:text-accent transition-colors duration-500"
            initial={false}
            animate={{ 
              cx: isHovered ? node.fx : node.ax, 
              cy: isHovered ? node.fy : node.ay 
            }}
            transition={{ 
              duration: 1.2, 
              delay: isHovered ? i * 0.002 : (i % 10) * 0.02,
              ease: [0.16, 1, 0.3, 1] // Custom spring-like ease
            }}
          />
        ))}
      </svg>
      
      <span className="font-mono text-muted text-[10px] absolute bottom-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity uppercase">
        {isHovered ? 'SYS.MAPPED_SUBJECT' : 'SYS.TOPOLOGY'}
      </span>
    </div>
  );
}
