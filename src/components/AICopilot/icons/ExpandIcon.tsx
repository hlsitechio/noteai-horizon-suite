
import React from 'react';
import { Sparkles } from 'lucide-react';

interface ExpandIconProps {
  className?: string;
  size?: number;
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <Sparkles 
      className={className} 
      size={size}
    />
  );
};

export default ExpandIcon;
