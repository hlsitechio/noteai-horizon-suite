
import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create depth layers with different scales and offsets
  const layer1X = useTransform(mouseX, [0, 1000], [-20, 20]);
  const layer1Y = useTransform(mouseY, [0, 1000], [-20, 20]);
  const layer2X = useTransform(mouseX, [0, 1000], [-40, 40]);
  const layer2Y = useTransform(mouseY, [0, 1000], [-40, 40]);
  const layer3X = useTransform(mouseX, [0, 1000], [-60, 60]);
  const layer3Y = useTransform(mouseY, [0, 1000], [-60, 60]);

  // Wave distortion values
  const waveAmplitude = useTransform(mouseX, [0, 1000], [0, 30]);
  const waveFrequency = useTransform(mouseY, [0, 1000], [0.5, 2]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const intensityStyles = {
    subtle: 'opacity-10',
    medium: 'opacity-20',
    vibrant: 'opacity-30'
  };

  const getDotSpacing = () => {
    switch (variant) {
      case 'organic': return '25px';
      case 'grid': return '20px';
      case 'hybrid': return '22px';
      default: return '22px';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}
    >
      {/* Background layer - deepest */}
      <motion.div
        className={cn("absolute inset-0", intensityStyles[intensity])}
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)) 0.5px, transparent 1px)`,
          backgroundSize: `calc(${getDotSpacing()} * 2) calc(${getDotSpacing()} * 2)`,
          x: layer3X,
          y: layer3Y,
          filter: 'blur(1px)',
        }}
      />

      {/* Middle layer with wave distortion */}
      <motion.div
        className={cn("absolute inset-0", intensityStyles[intensity])}
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: `calc(${getDotSpacing()} * 1.5) calc(${getDotSpacing()} * 1.5)`,
          x: layer2X,
          y: layer2Y,
          transform: useTransform(
            [waveAmplitude, waveFrequency, mouseX, mouseY],
            ([amp, freq, mx, my]) => 
              `perspective(1000px) rotateX(${(my - 500) * 0.02}deg) rotateY(${(mx - 500) * 0.02}deg) translateZ(-100px)`
          ),
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Foreground layer with wave effect */}
      <motion.div
        className={cn("absolute inset-0", intensityStyles[intensity])}
        style={{
          background: variant === 'organic' 
            ? `radial-gradient(ellipse at center, hsl(var(--primary)) 1px, transparent 2px)`
            : `radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: `${getDotSpacing()} ${getDotSpacing()}`,
          x: layer1X,
          y: layer1Y,
          transform: useTransform(
            [waveAmplitude, waveFrequency, mouseX, mouseY],
            ([amp, freq, mx, my]) => {
              const waveX = Math.sin((my * freq) / 100) * amp;
              const waveY = Math.cos((mx * freq) / 100) * amp;
              return `translate(${waveX}px, ${waveY}px) perspective(800px) rotateX(${(my - 500) * 0.01}deg) rotateY(${(mx - 500) * 0.01}deg)`;
            }
          ),
        }}
        animate={{
          backgroundPosition: ['0% 0%', '50% 50%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />

      {/* Depth gradient overlay for enhanced 3D effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) => `
              radial-gradient(circle at ${mx}px ${my}px, 
                hsl(var(--background) / 0.1) 0%, 
                hsl(var(--background) / 0.3) 40%,
                hsl(var(--background) / 0.6) 80%
              )
            `
          ),
        }}
      />

      {/* Ambient lighting effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) => `
              radial-gradient(ellipse 800px 600px at ${mx}px ${my}px, 
                hsl(var(--primary) / 0.1) 0%, 
                transparent 50%
              )
            `
          ),
        }}
      />
    </div>
  );
};

export default WavyDotsBackground;
