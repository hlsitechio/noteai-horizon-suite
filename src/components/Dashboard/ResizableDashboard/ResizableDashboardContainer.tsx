import React from 'react';
import { PanelGroup } from 'react-resizable-panels';
import ResizableBannerPanel from './ResizableBannerPanel';
import ResizableContentPanel from './ResizableContentPanel';
import ResizableHandle from './ResizableHandle';

interface ResizableDashboardContainerProps {
  bannerContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  bannerDefaultSize?: number;
  bannerMinSize?: number;
  bannerMaxSize?: number;
}

const ResizableDashboardContainer: React.FC<ResizableDashboardContainerProps> = ({
  bannerContent,
  mainContent,
  bannerDefaultSize = 30,
  bannerMinSize = 15,
  bannerMaxSize = 70
}) => {
  return (
    <PanelGroup direction="vertical" className="w-full h-full">
      {/* Banner Panel */}
      <ResizableBannerPanel
        defaultSize={bannerDefaultSize}
        minSize={bannerMinSize}
        maxSize={bannerMaxSize}
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
      
      {/* Resize Handle */}
      <ResizableHandle />
      
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