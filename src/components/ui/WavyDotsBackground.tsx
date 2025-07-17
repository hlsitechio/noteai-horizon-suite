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
    subtle: 'opacity-20',
    medium: 'opacity-30',
    vibrant: 'opacity-50'
  };

  const variantStyles = {
    organic: {
      dotSize: 'var(--dot-size-organic)',
      spacing: 'var(--dot-spacing-organic)',
      waveAmplitude: 'var(--wave-amplitude-organic)'
    },
    grid: {
      dotSize: 'var(--dot-size-grid)',
      spacing: 'var(--dot-spacing-grid)',
      waveAmplitude: 'var(--wave-amplitude-grid)'
    },
    hybrid: {
      dotSize: 'var(--dot-size-hybrid)',
      spacing: 'var(--dot-spacing-hybrid)',
      waveAmplitude: 'var(--wave-amplitude-hybrid)'
    }
  };

  const currentVariant = variantStyles[variant];
  
  // Dynamic spacing and sizes based on variant
  const getDotSpacing = () => {
    switch (variant) {
      case 'organic': return 'clamp(15px, 2vw, 35px)';
      case 'grid': return 'clamp(20px, 1.5vw, 25px)';
      case 'hybrid': return 'clamp(18px, 1.8vw, 30px)';
      default: return 'clamp(18px, 1.8vw, 30px)';
    }
  };

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>

      {/* Base Dots Layer */}
      <motion.div
        className={cn(
          "absolute inset-0 wavy-dots-base",
          intensityStyles[intensity]
        )}
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: getDotSpacing() + ' ' + getDotSpacing(),
          transform: `translateZ(0)`
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Wave Distortion Layer 1 */}
      <motion.div
        className={cn(
          "absolute inset-0 wavy-dots-wave-1",
          intensityStyles[intensity]
        )}
        style={{
          background: variant === 'organic' 
            ? `radial-gradient(ellipse at center, hsl(var(--primary-glow)) 2px, transparent 3px)`
            : `radial-gradient(circle at center, hsl(var(--primary)) 1.5px, transparent 1.5px)`,
          backgroundSize: getDotSpacing() + ' ' + getDotSpacing(),
          transform: `translateZ(0)`
        }}
        animate={{
          backgroundPosition: ['50% 50%', '150% 150%'],
          transform: [
            'translateZ(0) skewX(0deg) skewY(0deg)',
            'translateZ(0) skewX(2deg) skewY(1deg)',
            'translateZ(0) skewX(-1deg) skewY(-2deg)',
            'translateZ(0) skewX(0deg) skewY(0deg)'
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Wave Distortion Layer 2 */}
      <motion.div
        className={cn(
          "absolute inset-0 wavy-dots-wave-2",
          intensityStyles[intensity]
        )}
        style={{
          background: variant === 'organic'
            ? `radial-gradient(circle at 30% 70%, hsl(var(--accent)) 1.5px, transparent 2px)`
            : `radial-gradient(circle at center, hsl(var(--muted-foreground)) 1px, transparent 1px)`,
          backgroundSize: `calc(${getDotSpacing()} * 1.3) calc(${getDotSpacing()} * 0.8)`,
          transform: `translateZ(0)`
        }}
        animate={{
          backgroundPosition: ['-50% -50%', '50% 50%'],
          transform: [
            'translateZ(0) rotateZ(0deg)',
            'translateZ(0) rotateZ(1deg)',
            'translateZ(0) rotateZ(-1deg)',
            'translateZ(0) rotateZ(0deg)'
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Halftone Effect Layer (for organic variant) */}
      {variant === 'organic' && (
        <motion.div
          className={cn(
            "absolute inset-0 wavy-dots-halftone",
            intensityStyles[intensity]
          )}
          style={{
            background: `
              radial-gradient(circle at 20% 20%, hsl(var(--primary-glow)) 3px, transparent 4px),
              radial-gradient(circle at 80% 80%, hsl(var(--primary)) 2px, transparent 3px),
              radial-gradient(circle at 60% 40%, hsl(var(--accent)) 1px, transparent 2px)
            `,
            backgroundSize: '60px 60px, 40px 40px, 80px 80px',
            backgroundPosition: '0 0, 20px 20px, 40px 40px'
          }}
          animate={{
            backgroundPosition: [
              '0 0, 20px 20px, 40px 40px',
              '60px 60px, 80px 80px, 120px 120px',
              '0 0, 20px 20px, 40px 40px'
            ]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Flow Overlay */}
      <motion.div
        className={cn(
          "absolute inset-0 wavy-dots-flow",
          intensityStyles[intensity]
        )}
        style={{
          background: `linear-gradient(45deg, 
            transparent 40%, 
            hsl(var(--primary) / 0.1) 50%, 
            transparent 60%
          )`,
          transform: 'translateZ(0)'
        }}
        animate={{
          backgroundPosition: ['-100% -100%', '100% 100%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Gradient Overlay for Depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 70%, hsl(var(--background) / 0.8) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, hsl(var(--background) / 0.6) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
};

export default WavyDotsBackground;