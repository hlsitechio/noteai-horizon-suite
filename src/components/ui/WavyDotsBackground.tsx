
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WavyDotsBackgroundProps {
  className?: string;
  variant?: 'organic' | 'grid' | 'hybrid';
  intensity?: 'subtle' | 'medium' | 'vibrant';
}

export const WavyDotsBackground: React.FC<WavyDotsBackgroundProps> = ({
  className,
  variant = 'organic',
  intensity = 'medium'
}) => {
  const intensityStyles = {
    subtle: 'opacity-10',
    medium: 'opacity-20',
    vibrant: 'opacity-30'
  };

  // Simplified spacing based on variant
  const getDotSpacing = () => {
    switch (variant) {
      case 'organic': return '25px';
      case 'grid': return '20px';
      case 'hybrid': return '22px';
      default: return '22px';
    }
  };

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>

      {/* Single animated dots layer with reduced complexity */}
      <motion.div
        className={cn(
          "absolute inset-0",
          intensityStyles[intensity]
        )}
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: `${getDotSpacing()} ${getDotSpacing()}`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Subtle overlay for depth - static to avoid flashing */}
      <div 
        className={cn("absolute inset-0", intensityStyles[intensity])}
        style={{
          background: variant === 'organic' 
            ? `radial-gradient(ellipse at 30% 70%, hsl(var(--primary)) 2px, transparent 3px)`
            : `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: `calc(${getDotSpacing()} * 1.5) calc(${getDotSpacing()} * 1.2)`,
          backgroundPosition: '10px 10px'
        }}
      />

      {/* Gentle gradient overlay for visual depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: `
            radial-gradient(circle at 30% 70%, hsl(var(--background) / 0.4) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, hsl(var(--background) / 0.3) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
};

export default WavyDotsBackground;
