import React from 'react';
import { PanelGroup } from 'react-resizable-panels';
import ResizableBannerPanel from './ResizableBannerPanel';
import ResizableContentPanel from './ResizableContentPanel';
import ResizableHandle from './ResizableHandle';
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

  return (
    <PanelGroup 
      direction="vertical" 
      className="w-full h-full" 
      onLayout={handleLayout}
      key={`dashboard-${isEditMode}`} // Force re-render when edit mode changes
    >
      {/* Banner Panel */}
      <ResizableBannerPanel
        defaultSize={bannerDefaultSize}
        minSize={isEditMode ? bannerMinSize : bannerDefaultSize}
        maxSize={isEditMode ? bannerMaxSize : bannerDefaultSize}
      >
        {bannerContent || (
          <div className="w-full h-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Banner Area</h2>
              <p className="text-muted-foreground">Add your banner component here</p>
            </div>
          </div>
        )}
      </ResizableBannerPanel>
      
      {/* Horizontal Resize Handle - Always present but disabled when not in edit mode */}
      <HorizontalResizableHandle 
        className={isEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
      />
      
      {/* Main Content Panel */}
      <ResizableContentPanel>
        {mainContent || (
          <div className="w-full h-full bg-muted/10 border-2 border-dashed border-muted/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
              <p className="text-muted-foreground">Add your dashboard components here</p>
            </div>
          </div>
        )}
      </ResizableContentPanel>
    </PanelGroup>
  );
};

export default ResizableDashboardContainer;