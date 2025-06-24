
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsIconProps {
  className?: string;
  size?: number;
}

const AnalyticsIcon: React.FC<AnalyticsIconProps> = ({ 
  className = "w-4 h-4", 
  size 
}) => {
  return (
    <BarChart3 
      className={className} 
      size={size}
    />
  );
};

export default AnalyticsIcon;
