import React from 'react';
import { motion } from 'framer-motion';

interface CyberpunkCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'neural' | 'holographic';
  animate?: boolean;
}

const CyberpunkCard: React.FC<CyberpunkCardProps> = ({ 
  children, 
  className = '',
  variant = 'holographic',
  animate = true
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1
    }
  };

  const getCardClasses = () => {
    const baseClasses = 'relative overflow-hidden neural-perspective';
    
    switch (variant) {
      case 'neural':
        return `${baseClasses} bg-neural-mesh border border-primary/30 rounded-2xl shadow-glow`;
      case 'holographic':
        return `${baseClasses} card-holographic hover-neural`;
      default:
        return `${baseClasses} bg-card/50 border border-border/50 rounded-lg`;
    }
  };

  const CardContent = () => (
    <div className={`${getCardClasses()} ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1]
        }}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          transition: { duration: 0.3 }
        }}
      >
        <CardContent />
      </motion.div>
    );
  }

  return <CardContent />;
};

export default CyberpunkCard;