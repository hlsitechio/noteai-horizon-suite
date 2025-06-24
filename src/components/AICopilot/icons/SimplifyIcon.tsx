
import React from 'react';
import { Bot } from 'lucide-react';

interface SimplifyIconProps {
  className?: string;
  size?: number;
}

const SimplifyIcon: React.FC<SimplifyIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <Bot 
      className={className} 
      size={size}
    />
  );
};

export default SimplifyIcon;
