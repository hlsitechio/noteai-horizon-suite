import React from 'react';
import { cn } from '@/lib/utils';

interface WavyDotsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  intensity?: string;
}

export const WavyDotsBackground: React.FC<WavyDotsBackgroundProps> = ({ 
  className = '',
  children,
  variant,
  intensity 
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-accent/15 to-secondary/15 rounded-full blur-3xl animate-float-gentle opacity-25" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-primary/25 to-accent/15 rounded-full blur-3xl animate-gradient-mesh opacity-20" />
        
        {/* Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};