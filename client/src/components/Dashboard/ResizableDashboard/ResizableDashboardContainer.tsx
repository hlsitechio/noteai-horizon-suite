import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';

interface ResizableDashboardContainerProps {
  bannerContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  bannerDefaultSize?: number;
  bannerMinSize?: number;
  bannerMaxSize?: number;
  isEditMode?: boolean;
  onLayout?: (sizes: number[]) => void;
}

const ResizableDashboardContainer: React.FC<ResizableDashboardContainerProps> = ({
  bannerContent,
  mainContent,
  bannerDefaultSize = 30,
  bannerMinSize = 15,
  bannerMaxSize = 70,
  isEditMode = false,
  onLayout
}) => {
  // Only allow layout changes when in edit mode
  const handleLayout = React.useCallback((sizes: number[]) => {
    if (isEditMode && onLayout) {
      onLayout(sizes);
    }
  }, [isEditMode, onLayout]);

  // Create storage handler that returns undefined to disable localStorage persistence
  // We handle persistence through our own system
  const createStorageHandler = () => {
    return undefined; // Always return undefined to disable localStorage integration
  };

  return (
    <PanelGroup 
      direction="vertical" 
      className="w-full h-full" 
      onLayout={handleLayout}
      id="dashboard-main"
      storage={createStorageHandler()}
    >
      {/* Banner Panel */}
      <Panel
        id="banner-panel"
        order={0}
        defaultSize={bannerDefaultSize}
        minSize={isEditMode ? bannerMinSize : undefined}
        maxSize={isEditMode ? bannerMaxSize : undefined}
        className="flex flex-col"
      >
        <div className="h-full w-full">
          {bannerContent || (
            <div className="w-full h-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Banner Area</h2>
                <p className="text-muted-foreground">Add your banner component here</p>
              </div>
            </div>
          )}
        </div>
      </Panel>
      
      {/* Horizontal Resize Handle - Always present */}
      <HorizontalResizableHandle 
        className={isEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
      />
      
      {/* Main Content Panel */}
      <Panel
        id="main-content-panel"
        order={1}
        className="flex flex-col min-h-0"
      >
        <div className="h-full w-full overflow-y-auto">
          {mainContent || (
            <div className="w-full h-full bg-muted/10 border-2 border-dashed border-muted/30 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
                <p className="text-muted-foreground">Add your dashboard components here</p>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default ResizableDashboardContainer;