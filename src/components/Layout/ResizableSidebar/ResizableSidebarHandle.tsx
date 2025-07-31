import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface ResizableSidebarHandleProps {
  className?: string;
  isEditMode?: boolean;
}

const ResizableSidebarHandle: React.FC<ResizableSidebarHandleProps> = ({ className, isEditMode = false }) => {
  return (
    <PanelResizeHandle 
      className={cn(
        "w-px bg-border transition-colors duration-200 flex items-center justify-center group relative",
        isEditMode 
          ? "hover:bg-primary/20 cursor-col-resize" 
          : "opacity-30 pointer-events-none",
        className
      )}
    >
      {isEditMode && (
        <div className="h-16 w-1 bg-muted-foreground/50 group-hover:bg-primary rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
      )}
    </PanelResizeHandle>
  );
};

export default ResizableSidebarHandle;