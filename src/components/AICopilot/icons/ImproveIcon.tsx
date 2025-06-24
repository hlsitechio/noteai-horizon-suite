
import React from 'react';
import { Sparkles } from 'lucide-react';

interface ImproveIconProps {
  className?: string;
  size?: number;
}

const ImproveIcon: React.FC<ImproveIconProps> = ({ 
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

export default ImproveIcon;
