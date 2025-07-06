import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

const ResizableSidebarHandle: React.FC = () => {
  return (
    <PanelResizeHandle className="w-px bg-border hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center group cursor-col-resize relative">
      <div className="h-16 w-1 bg-muted-foreground/50 group-hover:bg-primary rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
    </PanelResizeHandle>
  );
};

export default ResizableSidebarHandle;