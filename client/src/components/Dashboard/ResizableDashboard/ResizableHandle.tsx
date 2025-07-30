import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

const ResizableHandle: React.FC = () => {
  return (
    <PanelResizeHandle className="h-3 bg-border hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center group cursor-row-resize relative">
      <div className="w-16 h-1 bg-muted-foreground/50 group-hover:bg-primary rounded-full transition-all duration-200" />
    </PanelResizeHandle>
  );
};

export default ResizableHandle;