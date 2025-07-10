import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  className = "", 
  id 
}) => {
  const ref = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create multiple parallax layers with different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.02, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      id={id}
      style={{
        y: y1,
        scale,
        opacity
      }}
    >
      {/* Background parallax layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1 - Slowest moving background elements */}
        <motion.div
          className="absolute inset-0"
          style={{ y: y3, rotate }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent/3 to-secondary/3 rounded-full blur-3xl" />
        </motion.div>

        {/* Layer 2 - Medium speed floating elements */}
        <motion.div
          className="absolute inset-0"
          style={{ y: y2 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-30"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${20 + Math.floor(i / 4) * 60}%`,
                background: `hsl(${200 + i * 30} 70% 60%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Layer 3 - Fastest moving foreground elements */}
        <motion.div
          className="absolute inset-0"
          style={{ y: y1 }}
        >
          {/* Geometric shapes */}
          <div className="absolute top-16 right-16 w-32 h-32 border border-primary/20 rounded-lg rotate-45 opacity-30" />
          <div className="absolute bottom-32 left-16 w-24 h-24 border border-accent/20 rounded-full opacity-20" />
        </motion.div>
      </div>

      {/* Content with subtle parallax */}
      <motion.div
        className="relative z-10"
        style={{ y: y1 }}
      >
        {children}
      </motion.div>

      {/* Interactive constellation lines that respond to scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]) }}
      >
        <svg className="w-full h-full">
          <defs>
            <linearGradient id={`parallax-gradient-${id || Math.random()}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Animated constellation lines */}
          <motion.path
            d="M 0 50% Q 25% 25% 50% 50% T 100% 50%"
            fill="none"
            stroke={`url(#parallax-gradient-${id || Math.random()})`}
            strokeWidth="1"
            strokeDasharray="5,10"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              strokeDashoffset: useTransform(scrollYProgress, [0, 1], [0, -50])
            }}
          />
          
          <motion.path
            d="M 0 25% Q 50% 75% 100% 25%"
            fill="none"
            stroke={`url(#parallax-gradient-${id || Math.random()})`}
            strokeWidth="1"
            strokeDasharray="3,8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
            style={{
              strokeDashoffset: useTransform(scrollYProgress, [0, 1], [0, 30])
            }}
          />
        </svg>
      </motion.div>
    </motion.section>
  );
};

export default ParallaxSection;