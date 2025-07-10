import React from 'react';
import { motion } from 'framer-motion';
import QuantumWebGLBackground from './QuantumWebGLBackground';
import SimpleParticleField from './SimpleParticleField';
import ScrollLighting from './ScrollLighting';

interface PremiumBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress?: number;
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ 
  mousePosition, 
  scrollProgress = 0 
}) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Revolutionary WebGL Quantum Aurora Background */}
      <QuantumWebGLBackground 
        mousePosition={mousePosition} 
        scrollProgress={scrollProgress}
      />
      
      {/* Quantum Particle Field */}
      <SimpleParticleField 
        mousePosition={mousePosition} 
        intensity={1.5}
      />
      
      {/* Quantum scroll lighting */}
      <ScrollLighting 
        intensity={2} 
        colorPrimary="165 100% 65%" 
        colorSecondary="45 100% 70%"
      >
        <div />
      </ScrollLighting>
      
      {/* Quantum gradient overlay with mouse interaction */}
      <motion.div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            hsl(165 100% 65% / 0.4), 
            hsl(45 100% 70% / 0.3), 
            hsl(290 100% 75% / 0.2),
            transparent 60%)`
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Quantum energy orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: i % 3 === 0 
                ? 'hsl(165 100% 65% / 0.6)' 
                : i % 3 === 1 
                ? 'hsl(45 100% 70% / 0.6)' 
                : 'hsl(290 100% 75% / 0.6)',
              filter: 'blur(1px)',
              boxShadow: '0 0 20px currentColor'
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 1, 0],
              scale: [0.3, 1.8, 0.3]
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Quantum field distortion */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `conic-gradient(from ${mousePosition.x * 0.1}deg at 50% 50%, 
            hsl(165 100% 65%), 
            hsl(45 100% 70%), 
            hsl(290 100% 75%), 
            hsl(165 100% 65%))`
        }}
      />
    </div>
  );
};

export default PremiumBackground;