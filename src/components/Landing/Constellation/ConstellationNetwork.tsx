import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ConstellationNetworkProps {
  mousePosition: { x: number; y: number };
  scrollProgress?: number;
}

const ConstellationNetwork: React.FC<ConstellationNetworkProps> = ({ 
  mousePosition, 
  scrollProgress = 0 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const createConstellationPaths = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create multiple constellation patterns
    const patterns = [
      // Spiral galaxy pattern
      {
        type: 'spiral',
        centerX: centerX - 200,
        centerY: centerY,
        radius: 150,
        arms: 3,
        points: 20
      },
      // Radial burst pattern
      {
        type: 'radial',
        centerX: centerX + 200,
        centerY: centerY - 100,
        radius: 120,
        rays: 8,
        points: 16
      },
      // Flowing wave pattern
      {
        type: 'wave',
        centerX: centerX,
        centerY: centerY + 150,
        amplitude: 80,
        frequency: 3,
        points: 24
      }
    ];

    return patterns;
  }, []);

  const animate = useCallback(() => {
    timeRef.current += 0.016; // ~60fps
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* SVG Constellation Lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="constellation-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(200, 80%, 60%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(280, 80%, 70%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(320, 80%, 65%)" stopOpacity="0.4" />
          </linearGradient>
          
          <linearGradient id="constellation-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(180, 90%, 55%)" stopOpacity="0.7" />
            <stop offset="50%" stopColor="hsl(240, 85%, 65%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(200, 80%, 60%)" stopOpacity="0.3" />
          </linearGradient>

          {/* Filter for glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic constellation paths */}
        <g className="constellation-group">
          {/* Spiral constellation */}
          <motion.path
            d={`M ${window.innerWidth / 2 - 200} ${window.innerHeight / 2} 
                Q ${window.innerWidth / 2 - 100} ${window.innerHeight / 2 - 100} 
                  ${window.innerWidth / 2} ${window.innerHeight / 2} 
                Q ${window.innerWidth / 2 + 100} ${window.innerHeight / 2 + 100} 
                  ${window.innerWidth / 2 + 200} ${window.innerHeight / 2}`}
            fill="none"
            stroke="url(#constellation-gradient-1)"
            strokeWidth="2"
            strokeDasharray="5,5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0],
              strokeDashoffset: [0, -20]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Radial burst lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const startX = window.innerWidth / 2 + Math.cos(angle) * 50;
            const startY = window.innerHeight / 2 + Math.sin(angle) * 50;
            const endX = window.innerWidth / 2 + Math.cos(angle) * 200;
            const endY = window.innerHeight / 2 + Math.sin(angle) * 200;
            
            return (
              <motion.line
                key={i}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="url(#constellation-gradient-2)"
                strokeWidth="1.5"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 6,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Flowing curves */}
          <motion.path
            d={`M 100 ${window.innerHeight / 2} 
                Q ${window.innerWidth / 4} ${window.innerHeight / 2 - 100} 
                  ${window.innerWidth / 2} ${window.innerHeight / 2}
                Q ${window.innerWidth * 3/4} ${window.innerHeight / 2 + 100} 
                  ${window.innerWidth - 100} ${window.innerHeight / 2}`}
            fill="none"
            stroke="url(#constellation-gradient-1)"
            strokeWidth="2"
            strokeDasharray="10,5"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: [0, 1],
              strokeDashoffset: [0, -30]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </g>
      </svg>

      {/* Interactive Constellation Nodes */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${20 + (i % 5) * 20}%`,
              top: `${30 + Math.floor(i / 5) * 25}%`,
              background: `radial-gradient(circle, 
                hsl(${200 + i * 20} 80% 70% / 0.9), 
                hsl(${200 + i * 20} 80% 70% / 0.3) 70%, 
                transparent)`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                `0 0 10px hsl(${200 + i * 20} 80% 70% / 0.5)`,
                `0 0 20px hsl(${200 + i * 20} 80% 70% / 0.8)`,
                `0 0 10px hsl(${200 + i * 20} 80% 70% / 0.5)`
              ]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 2,
              boxShadow: `0 0 30px hsl(${200 + i * 20} 80% 70% / 1)`
            }}
          />
        ))}
      </div>

      {/* Mouse-following constellation */}
      <motion.div
        className="absolute w-6 h-6 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, 
            hsl(280 80% 70% / 0.8), 
            hsl(280 80% 70% / 0.3) 70%, 
            transparent)`,
          boxShadow: '0 0 20px hsl(280 80% 70% / 0.6)'
        }}
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 100, damping: 20 },
          y: { type: "spring", stiffness: 100, damping: 20 },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Connecting lines to mouse */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const nodeX = (20 + (i % 5) * 20) * window.innerWidth / 100;
          const nodeY = (30 + Math.floor(i / 5) * 25) * window.innerHeight / 100;
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - nodeX, 2) + 
            Math.pow(mousePosition.y - nodeY, 2)
          );
          
          if (distance < 200) {
            return (
              <motion.line
                key={i}
                x1={nodeX}
                y1={nodeY}
                x2={mousePosition.x}
                y2={mousePosition.y}
                stroke={`hsl(${200 + i * 20} 80% 70%)`}
                strokeWidth="1"
                opacity={0.6 - (distance / 200) * 0.6}
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default ConstellationNetwork;