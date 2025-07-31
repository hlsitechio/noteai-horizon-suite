import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface FloatingCard3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  rotateOnHover?: boolean;
  glowIntensity?: number;
}

const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  children,
  className = '',
  depth = 20,
  rotateOnHover = true,
  glowIntensity = 0.6
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [-5, 5]));

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !rotateOnHover) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setMousePosition({
      x: (mouseX / rect.width) * depth,
      y: -(mouseY / rect.height) * depth
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${className}`}
      style={{
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Holographic glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            hsl(280 100% 70% / ${glowIntensity}), 
            hsl(195 100% 50% / ${glowIntensity * 0.7}), 
            transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          zIndex: -1
        }}
      />
      
      {/* Main card */}
      <motion.div
        className="card-holographic w-full h-full relative overflow-hidden"
        style={{
          rotateX: isHovered ? mousePosition.y : 0,
          rotateY: isHovered ? mousePosition.x : 0,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? `0 ${depth}px ${depth * 2}px rgba(139, 92, 246, 0.3),
               0 0 ${depth * 3}px rgba(6, 182, 212, 0.2)`
            : '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Dynamic light reflection */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(${135 + mousePosition.x}deg, 
              transparent 30%, 
              hsl(280 100% 70% / 0.1) 50%, 
              transparent 70%)`,
            transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, ${depth}px)`
          }}
        />
        
        {/* Content */}
        <div 
          className="relative z-10 w-full h-full"
          style={{
            transform: `translateZ(${depth / 2}px)`
          }}
        >
          {children}
        </div>
        
        {/* Depth layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50"
          style={{
            transform: `translateZ(${depth / 4}px)`
          }}
        />
        
        {/* Edge lighting */}
        <div 
          className="absolute inset-0 border border-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 20px hsl(280 100% 70% / 0.3)`,
            transform: `translateZ(${depth / 3}px)`
          }}
        />
      </motion.div>
      
      {/* Floating data particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FloatingCard3D;