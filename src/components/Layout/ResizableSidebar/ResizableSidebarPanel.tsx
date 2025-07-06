import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizableHandle as VerticalResizableHandle } from '@/components/ui/resizable';

interface ResizableSidebarPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  topPanelContent?: React.ReactNode;
  bottomPanelContent?: React.ReactNode;
  isEditMode?: boolean;
}

const ResizableSidebarPanel: React.FC<ResizableSidebarPanelProps> = ({
  children,
  defaultSize = 25,
  minSize = 15,
  maxSize = 50,
  topPanelContent,
  bottomPanelContent,
  isEditMode = false
}) => {
  return (
    <Panel 
      defaultSize={defaultSize} 
      minSize={minSize} 
      maxSize={maxSize}
      className="flex flex-col border-r border-border"
    >
      <div className="h-full w-full">
        {(topPanelContent || bottomPanelContent) ? (
          <PanelGroup direction="vertical" className="h-full">
            {/* Top Panel */}
            <Panel defaultSize={60} minSize={30} maxSize={80}>
              <div className="h-full overflow-y-auto">
                {topPanelContent || children}
              </div>
            </Panel>
            
            {/* Vertical Resize Handle */}
            {isEditMode && <VerticalResizableHandle />}
            
            {/* Bottom Panel */}
            <Panel defaultSize={40} minSize={20} maxSize={70}>
              <div className="h-full overflow-y-auto">
                {bottomPanelContent || (
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Bottom panel</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        )}
      </div>
    </Panel>
  );
};

export default ResizableSidebarPanel;