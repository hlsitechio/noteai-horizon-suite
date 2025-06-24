
import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface ThumbsUpIconProps {
  className?: string;
  size?: number;
}

const ThumbsUpIcon: React.FC<ThumbsUpIconProps> = ({ 
  className = "w-3 h-3", 
  size 
}) => {
  return (
    <ThumbsUp 
      className={className} 
      size={size}
    />
  );
};

export default ThumbsUpIcon;
