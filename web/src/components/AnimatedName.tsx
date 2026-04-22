import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedName() {
  const [isHovered, setIsHovered] = useState(false);
  const name = "Tasin";
  const declaration = "const name = ";
  const arrayStr = "['T', 'a', 's', 'i', 'n']";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  const letter = {
    hidden: { opacity: 0, display: "none" },
    show: { opacity: 1, display: "inline-block" }
  };

  return (
    <div 
      className="inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-16 sm:h-20 flex items-center">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.h1
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground"
            >
              {name}
            </motion.h1>
          ) : (
            <motion.div
              key="array"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="font-mono text-base tracking-tight sm:tracking-normal sm:text-2xl lg:text-4xl text-accent flex items-center flex-wrap w-full"
            >
              <motion.span className="text-muted mr-2 shrink-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
                {declaration}
              </motion.span>
              {arrayStr.split('').map((char, index) => (
                <motion.span key={index} variants={letter}>
                  {char}
                </motion.span>
              ))}
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="ml-1 inline-block w-2.5 h-6 sm:h-8 bg-accent align-middle"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
