import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollLightingProps {
  children: React.ReactNode;
  intensity?: number;
  colorPrimary?: string;
  colorSecondary?: string;
}

const ScrollLighting: React.FC<ScrollLightingProps> = ({
  children,
  intensity = 1,
  colorPrimary = '280 100% 70%',
  colorSecondary = '195 100% 50%'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Dynamic lighting based on scroll
  const lightIntensity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, intensity, intensity, 0]);
  const lightRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const lightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.5, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!lightRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      lightRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          hsl(${colorPrimary} / ${0.3 * intensity}), 
          hsl(${colorSecondary} / ${0.2 * intensity}), 
          transparent 50%),
        conic-gradient(from ${x * 3.6}deg at ${x}% ${y}%, 
          hsl(${colorPrimary} / ${0.1 * intensity}), 
          hsl(${colorSecondary} / ${0.1 * intensity}), 
          hsl(315 100% 60% / ${0.1 * intensity}), 
          hsl(${colorPrimary} / ${0.1 * intensity}))
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity, colorPrimary, colorSecondary]);

  return (
    <div ref={containerRef} className="relative">
      {/* Dynamic lighting overlay */}
      <motion.div
        ref={lightRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          opacity: lightIntensity,
          rotate: lightRotation,
          scale: lightScale,
          background: `
            radial-gradient(circle at 50% 50%, 
              hsl(${colorPrimary} / ${0.2 * intensity}), 
              hsl(${colorSecondary} / ${0.1 * intensity}), 
              transparent 60%)
          `
        }}
      />
      
      {/* Ambient light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-full opacity-20"
            style={{
              left: `${(i / 8) * 100}%`,
              background: `linear-gradient(0deg, 
                transparent, 
                hsl(${colorPrimary} / 0.3), 
                transparent)`,
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: 'center'
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleY: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Floating energy orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                hsl(${i % 2 ? colorPrimary : colorSecondary} / 0.8), 
                transparent 70%)`,
              filter: 'blur(2px)'
            }}
            animate={{
              x: [0, 100, 200, 100, 0],
              y: [0, -50, 0, 50, 0],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.5, 1, 1.2, 0.8, 0.5]
            }}
            transition={{
              duration: 8,
              delay: i * 1.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ScrollLighting;