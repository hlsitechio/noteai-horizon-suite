
import React from 'react';
import { X } from 'lucide-react';

interface CloseIconProps {
  className?: string;
  size?: number;
}

const CloseIcon: React.FC<CloseIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <X 
      className={className} 
      size={size}
    />
  );
};

export default CloseIcon;
