
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SummarizeIconProps {
  className?: string;
  size?: number;
}

const SummarizeIcon: React.FC<SummarizeIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <Lightbulb 
      className={className} 
      size={size}
    />
  );
};

export default SummarizeIcon;
