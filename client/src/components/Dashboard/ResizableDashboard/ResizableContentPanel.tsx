import React from 'react';
import { Panel } from 'react-resizable-panels';

interface ResizableContentPanelProps {
  children: React.ReactNode;
}

const ResizableContentPanel: React.FC<ResizableContentPanelProps> = ({
  children
}) => {
  return (
    <Panel className="flex flex-col min-h-0">
      <div className="h-full w-full overflow-y-auto">
        {children}
      </div>
    </Panel>
  );
};

export default ResizableContentPanel;