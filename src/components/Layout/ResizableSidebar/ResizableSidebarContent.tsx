import React from 'react';
import { Panel } from 'react-resizable-panels';

interface ResizableSidebarContentProps {
  children: React.ReactNode;
}

const ResizableSidebarContent: React.FC<ResizableSidebarContentProps> = ({
  children
}) => {
  return (
    <Panel className="flex flex-col min-w-0 flex-1">
      <div className="h-full w-full overflow-hidden">
        {children}
      </div>
    </Panel>
  );
};

export default ResizableSidebarContent;