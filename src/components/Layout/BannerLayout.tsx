import React from 'react';
import { Outlet } from 'react-router-dom';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import { BannerWithTopNav } from '@/components/Dashboard/BannerWithTopNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardBanner } from '@/hooks/useDashboardBanner';

const BannerLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = useDashboardBanner();

  // Mobile layout - simpler vertical stack
  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col bg-background">
        {/* Banner Section - Fixed height on mobile */}
        <div className="flex-shrink-0 h-[35vh] min-h-[200px] max-h-[300px]">
          <BannerWithTopNav
            onImageUpload={handleImageUpload}
            onAIGenerate={handleAIGenerate}
            onVideoUpload={handleVideoUpload}
            onImageSelect={handleImageSelect}
            selectedImageUrl={selectedBannerUrl}
            isEditMode={false}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  // Desktop layout - resizable panels
  return (
    <div className="h-full w-full bg-background">
      <PanelGroup 
        direction="vertical" 
        className="w-full h-full"
        id="banner-layout"
      >
        {/* Banner Panel */}
        <Panel
          id="banner-panel"
          defaultSize={30}
          minSize={20}
          maxSize={50}
          className="flex flex-col"
        >
          <div className="h-full w-full">
            <BannerWithTopNav
              onImageUpload={handleImageUpload}
              onAIGenerate={handleAIGenerate}
              onVideoUpload={handleVideoUpload}
              onImageSelect={handleImageSelect}
              selectedImageUrl={selectedBannerUrl}
              isEditMode={false}
            />
          </div>
        </Panel>
        
        {/* Resize Handle */}
        <ResizableHandle className="opacity-0 hover:opacity-100 transition-opacity h-1" />
        
        {/* Main Content Panel */}
        <Panel
          id="content-panel"
          className="flex flex-col min-h-0"
        >
          <div className="h-full w-full overflow-auto">
            <Outlet />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default BannerLayout;