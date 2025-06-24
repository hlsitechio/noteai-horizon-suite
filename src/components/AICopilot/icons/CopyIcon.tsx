
import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyIconProps {
  className?: string;
  size?: number;
  isCopied?: boolean;
}

const CopyIcon: React.FC<CopyIconProps> = ({ 
  className = "w-4 h-4", 
  size,
  isCopied = false
}) => {
  return isCopied ? (
    <Check 
      className={className} 
      size={size}
    />
  ) : (
    <Copy 
      className={className} 
      size={size}
    />
  );
};

export default CopyIcon;
