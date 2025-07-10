import React from 'react';
import { motion } from 'framer-motion';

interface PremiumBackgroundProps {
  mousePosition: { x: number; y: number };
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ mousePosition }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />
      
      {/* Minimal grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
};

export default PremiumBackground;