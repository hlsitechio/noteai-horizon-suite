import React from 'react';
import { PanelGroup } from 'react-resizable-panels';
import ResizableSidebarPanel from './ResizableSidebarPanel';
import ResizableSidebarContent from './ResizableSidebarContent';
import ResizableSidebarHandle from './ResizableSidebarHandle';
import { ResizableHandle as VerticalResizableHandle } from '@/components/ui/resizable';

interface ResizableSidebarContainerProps {
  sidebarContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  sidebarDefaultSize?: number;
  sidebarMinSize?: number;
  sidebarMaxSize?: number;
  isEditMode?: boolean;
  sidebarTopContent?: React.ReactNode;
  sidebarMiddleContent?: React.ReactNode;
  sidebarBottomContent?: React.ReactNode;
  enableVerticalResize?: boolean;
}

const ResizableSidebarContainer: React.FC<ResizableSidebarContainerProps> = ({
  sidebarContent,
  mainContent,
  sidebarDefaultSize = 25,
  sidebarMinSize = 15,
  sidebarMaxSize = 50,
  isEditMode = false,
  sidebarTopContent,
  sidebarMiddleContent,
  sidebarBottomContent,
  enableVerticalResize = false
}) => {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      {/* Sidebar Panel */}
      <ResizableSidebarPanel
        defaultSize={sidebarDefaultSize}
        minSize={sidebarMinSize}
        maxSize={sidebarMaxSize}
        topPanelContent={enableVerticalResize ? sidebarTopContent : undefined}
        middlePanelContent={enableVerticalResize ? sidebarMiddleContent : undefined}
        bottomPanelContent={enableVerticalResize ? sidebarBottomContent : undefined}
        isEditMode={isEditMode}
      >
        {!enableVerticalResize && (sidebarContent || (
          <div className="w-full h-full bg-muted/10 border-2 border-dashed border-muted/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-bold mb-2">Sidebar Area</h2>
              <p className="text-muted-foreground text-sm">Add your sidebar components here</p>
            </div>
          </div>
        ))}
      </ResizableSidebarPanel>
      
      {/* Vertical Resize Handle */}
      {isEditMode && <ResizableSidebarHandle />}
      
      {/* Main Content Panel */}
      <ResizableSidebarContent>
        {mainContent || (
          <div className="w-full h-full bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
              <p className="text-muted-foreground">Your main application content goes here</p>
            </div>
          </div>
        )}
      </ResizableSidebarContent>
    </PanelGroup>
  );
};

export default ResizableSidebarContainer;