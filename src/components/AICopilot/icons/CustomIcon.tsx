
import React from 'react';
import { Send } from 'lucide-react';

interface CustomIconProps {
  className?: string;
  size?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <Send 
      className={className} 
      size={size}
    />
  );
};

export default CustomIcon;
