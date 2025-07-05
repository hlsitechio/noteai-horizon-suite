import React from 'react';

interface DynamicBackgroundProps {
  mousePosition: { x: number; y: number };
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ mousePosition }) => {
  return (
    <>
      {/* Dynamic Background with Mouse Following Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 40%)`
        }}
      />
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>
    </>
  );
};

export default DynamicBackground;