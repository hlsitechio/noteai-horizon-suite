import React from 'react';

interface PremiumBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ mousePosition, scrollProgress }) => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div 
        className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: `scale(${1 + scrollProgress * 0.5})`,
        }}
      />
    </div>
  );
};

export default PremiumBackground;