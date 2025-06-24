
import React from 'react';
import { ThumbsDown } from 'lucide-react';

interface ThumbsDownIconProps {
  className?: string;
  size?: number;
}

const ThumbsDownIcon: React.FC<ThumbsDownIconProps> = ({ 
  className = "w-3 h-3", 
  size 
}) => {
  return (
    <ThumbsDown 
      className={className} 
      size={size}
    />
  );
};

export default ThumbsDownIcon;
