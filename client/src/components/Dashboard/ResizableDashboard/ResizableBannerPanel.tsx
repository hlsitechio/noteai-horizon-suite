import React from 'react';
import { Panel } from 'react-resizable-panels';

interface ResizableBannerPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

const ResizableBannerPanel: React.FC<ResizableBannerPanelProps> = ({
  children,
  defaultSize = 30,
  minSize = 15,
  maxSize = 70
}) => {
  return (
    <Panel 
      defaultSize={defaultSize} 
      minSize={minSize} 
      maxSize={maxSize}
      className="flex flex-col"
    >
      <div className="h-full w-full">
        {children}
      </div>
    </Panel>
  );
};

export default ResizableBannerPanel;