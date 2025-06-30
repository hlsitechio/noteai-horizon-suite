
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ToolbarSectionProps {
  children: React.ReactNode;
  showSeparator?: boolean;
  separatorColor?: string;
}

const ToolbarSection: React.FC<ToolbarSectionProps> = ({ 
  children, 
  showSeparator = true,
  separatorColor = "bg-blue-200 dark:bg-slate-500"
}) => {
  return (
    <>
      <div className="flex items-center gap-1">
        {children}
      </div>
      {showSeparator && (
        <Separator orientation="vertical" className={`h-6 mx-2 ${separatorColor}`} />
      )}
    </>
  );
};

export default ToolbarSection;
