import React from 'react';
import { motion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import ScrollLighting from './ScrollLighting';

interface PremiumBackgroundProps {
  mousePosition: { x: number; y: number };
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ mousePosition }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Advanced particle system */}
      <ParticleSystem density={80} speed={0.8} interactive={true} />
      
      {/* Dynamic scroll lighting */}
      <ScrollLighting intensity={1.2}>
        <div />
      </ScrollLighting>
      
      {/* Neural mesh background */}
      <div className="absolute inset-0 bg-neural-mesh opacity-60" />
      
      {/* Cyberpunk grid */}
      <div className="absolute inset-0 bg-cyberpunk-grid opacity-20" />
      
      {/* Dynamic gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            hsl(280 100% 70% / 0.3), 
            hsl(195 100% 50% / 0.2), 
            transparent 50%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating holographic elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full neural-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumBackground;