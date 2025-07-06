import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizableHandle as VerticalResizableHandle } from '@/components/ui/resizable';

interface ResizableSidebarPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  topPanelContent?: React.ReactNode;
  middlePanelContent?: React.ReactNode;
  bottomPanelContent?: React.ReactNode;
  isEditMode?: boolean;
}

const ResizableSidebarPanel: React.FC<ResizableSidebarPanelProps> = ({
  children,
  defaultSize = 25,
  minSize = 15,
  maxSize = 50,
  topPanelContent,
  middlePanelContent,
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
        {(topPanelContent || middlePanelContent || bottomPanelContent) ? (
          <PanelGroup direction="vertical" className="h-full">
            {/* Top Panel */}
            <Panel defaultSize={40} minSize={25} maxSize={60}>
              <div className="h-full overflow-y-auto">
                {topPanelContent || children}
              </div>
            </Panel>
            
            {/* Vertical Resize Handle */}
            {isEditMode && <VerticalResizableHandle />}
            
            {/* Middle Panel */}
            <Panel defaultSize={35} minSize={20} maxSize={50}>
              <div className="h-full overflow-y-auto">
                {middlePanelContent || (
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Middle panel</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
            
            {/* Vertical Resize Handle */}
            {isEditMode && <VerticalResizableHandle />}
            
            {/* Bottom Panel */}
            <Panel defaultSize={25} minSize={15} maxSize={40}>
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