import React from 'react';
import { cn } from '@/lib/utils';

interface DotsBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'normal' | 'vibrant';
}

export const DotsBackground: React.FC<DotsBackgroundProps> = ({
  className,
  variant = 'normal'
}) => {
  const variantStyles = {
    subtle: 'opacity-20',
    normal: 'opacity-30',
    vibrant: 'opacity-50'
  };

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none overflow-hidden",
      variantStyles[variant],
      className
    )}>
      {/* Static gradient pattern - no animations for better performance */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, hsl(280 70% 60% / 0.08) 0%, transparent 40%),
              radial-gradient(circle at 75% 25%, hsl(200 70% 60% / 0.08) 0%, transparent 40%),
              radial-gradient(circle at 25% 75%, hsl(160 70% 60% / 0.08) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, hsl(320 70% 60% / 0.08) 0%, transparent 40%)
            `,
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      {/* Static dots pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, hsl(280 60% 70% / 0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, hsl(200 60% 70% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 30px 30px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      />

      {/* Soft overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/10" />
    </div>
  );
};

// Add these styles to your global CSS or create a separate CSS file
export const dotsBackgroundStyles = `
@keyframes wave-motion {
  0%, 100% { 
    background-position: 0% 50%; 
    transform: scale(1) rotate(0deg);
  }
  25% { 
    background-position: 100% 0%; 
    transform: scale(1.1) rotate(1deg);
  }
  50% { 
    background-position: 100% 100%; 
    transform: scale(1) rotate(0deg);
  }
  75% { 
    background-position: 0% 100%; 
    transform: scale(0.9) rotate(-1deg);
  }
}

@keyframes dots-float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px); 
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-5px) translateX(2px); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(0px) translateX(5px); 
    opacity: 0.4;
  }
  75% { 
    transform: translateY(3px) translateX(-2px); 
    opacity: 0.7;
  }
}

@keyframes wave-pattern {
  0%, 100% { 
    background-position: 0 0, 0 30px, 30px -30px, -30px 0;
    opacity: 0.1;
  }
  50% { 
    background-position: 30px 30px, 30px 0, 0 0, 0 30px;
    opacity: 0.2;
  }
}

.animate-wave-slow {
  animation: wave-motion 20s ease-in-out infinite;
}

.animate-dots-wave {
  animation: dots-float 15s ease-in-out infinite;
}
`;