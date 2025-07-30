import React from 'react';
import { Panel } from 'react-resizable-panels';

interface ResizableSidebarContentProps {
  children: React.ReactNode;
}

const ResizableSidebarContent: React.FC<ResizableSidebarContentProps> = ({
  children
}) => {
  return (
    <Panel className="flex flex-col">
      <div className="h-full w-full">
        {children}
      </div>
    </Panel>
  );
};

export default ResizableSidebarContent;