import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedDotsBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
}

export const AnimatedDotsBackground: React.FC<AnimatedDotsBackgroundProps> = ({ 
  className = "", 
  intensity = 'medium' 
}) => {
  // Generate dots grid
  const generateDots = () => {
    const dots = [];
    const rows = 30;
    const cols = 50;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = `${row}-${col}`;
        const delay = (row * cols + col) * 0.01;
        
        dots.push(
          <motion.div
            key={id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(col / cols) * 100}%`,
              top: `${(row / rows) * 100}%`,
            }}
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + (row * 0.1),
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      }
    }
    return dots;
  };

  const intensityStyles = {
    subtle: 'opacity-30',
    medium: 'opacity-50', 
    vibrant: 'opacity-70'
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      {/* Animated wave gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-green-500/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            backgroundSize: ['300% 300%', '200% 200%', '300% 300%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)
            `
          }}
        />
        
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'],
            backgroundSize: ['400% 400%', '300% 300%', '400% 400%']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 30% 70%, rgba(14, 165, 233, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)
            `
          }}
        />
      </div>

      {/* Dots grid overlay */}
      <div className={`absolute inset-0 ${intensityStyles[intensity]}`}>
        {/* Main dots pattern */}
        <div className="relative w-full h-full">
          {Array.from({ length: 25 }, (_, row) => (
            <div key={row} className="flex justify-between w-full" style={{ height: '4%' }}>
              {Array.from({ length: 40 }, (_, col) => {
                const waveOffset = Math.sin((row * 0.3) + (col * 0.2)) * 20;
                const colorPhase = (row + col) * 0.1;
                
                return (
                  <motion.div
                    key={`${row}-${col}`}
                    className="w-0.5 h-0.5 rounded-full"
                    style={{
                      background: `hsl(${(colorPhase * 60 + 260) % 360}, 70%, 60%)`,
                      transform: `translateY(${waveOffset}px)`
                    }}
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.8, 1.4, 0.8],
                      y: [waveOffset, waveOffset + 10, waveOffset]
                    }}
                    transition={{
                      duration: 3 + (row * 0.1),
                      delay: (row * col) * 0.005,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Floating accent dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }, (_, i) => (
            <motion.div
              key={`accent-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${(i * 20 + 280) % 360}, 60%, 70%)`
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/20" />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};