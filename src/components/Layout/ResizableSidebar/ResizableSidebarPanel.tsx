import React from 'react';
import { Panel } from 'react-resizable-panels';

interface ResizableSidebarPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

const ResizableSidebarPanel: React.FC<ResizableSidebarPanelProps> = ({
  children,
  defaultSize = 25,
  minSize = 15,
  maxSize = 50
}) => {
  return (
    <Panel 
      defaultSize={defaultSize} 
      minSize={minSize} 
      maxSize={maxSize}
      className="flex flex-col border-r border-border"
    >
      <div className="h-full w-full overflow-y-auto">
        {children}
      </div>
    </Panel>
  );
};

export default ResizableSidebarPanel;