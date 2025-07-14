import React from 'react';
import { Outlet } from 'react-router-dom';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/ui/resizable';
import { BannerWithTopNav } from '@/components/Dashboard/BannerWithTopNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';
import { useEditMode } from '@/contexts/EditModeContext';
import StatusBar from '@/components/StatusBar/StatusBar';
import { useStatusBar } from '@/hooks/useStatusBar';

const BannerLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { isDashboardEditMode } = useEditMode();
  const { message: statusMessage, isEnabled: statusBarEnabled } = useStatusBar();
  const { 
    workspace, 
    getPanelSizes, 
    updatePanelSizes,
    getBannerSettings,
    updateBannerSelection 
  } = useDashboardWorkspace();
  
  const panelSizes = getPanelSizes();
  const { url: selectedBannerUrl } = getBannerSettings();

  const handleBannerResize = async (sizes: number[]) => {
    if (sizes.length >= 2) {
      await updatePanelSizes({ ...panelSizes, banner: Math.round(sizes[0]) });
    }
  };

  const handleImageUpload = async (file: File) => {
    // Handle image upload logic here
    console.log('Image upload:', file);
  };

  const handleVideoUpload = async (file: File) => {
    // Handle video upload logic here
    console.log('Video upload:', file);
  };

  const handleAIGenerate = async () => {
    // Handle AI generation logic here
    console.log('AI generate');
  };

  const handleImageSelect = async (url: string) => {
    await updateBannerSelection(url, 'image');
  };

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
        
        {/* Status Bar */}
        {statusBarEnabled && (
          <StatusBar message={statusMessage} />
        )}
        
        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  // Desktop layout - resizable panels with proper saving
  return (
    <div className="h-full w-full bg-background">
      <PanelGroup 
        direction="vertical" 
        className="w-full h-full"
        onLayout={handleBannerResize}
        id="banner-layout"
      >
        {/* Banner Panel - Now with proper sizing and save functionality */}
        <Panel
          id="banner-panel"
          defaultSize={panelSizes.banner || 25}
          minSize={isDashboardEditMode ? 15 : undefined}
          maxSize={isDashboardEditMode ? 50 : undefined}
          className="flex flex-col"
        >
          <div className="h-full w-full">
            <BannerWithTopNav
              onImageUpload={handleImageUpload}
              onAIGenerate={handleAIGenerate}
              onVideoUpload={handleVideoUpload}
              onImageSelect={handleImageSelect}
              selectedImageUrl={selectedBannerUrl}
              isEditMode={isDashboardEditMode}
            />
          </div>
        </Panel>
        
        {/* Resize Handle - Only visible in edit mode */}
        <ResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
        
        {/* Main Content Panel */}
        <Panel
          id="content-panel"
          className="flex flex-col min-h-0"
        >
          {/* Status Bar */}
          {statusBarEnabled && (
            <StatusBar message={statusMessage} />
          )}
          
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default BannerLayout;