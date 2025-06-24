
import React from 'react';
import { Languages } from 'lucide-react';

interface TranslateIconProps {
  className?: string;
  size?: number;
}

const TranslateIcon: React.FC<TranslateIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <Languages 
      className={className} 
      size={size}
    />
  );
};

export default TranslateIcon;
