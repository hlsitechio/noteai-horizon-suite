
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedMobileBottomNav from '../components/EnhancedMobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';
import { BannerWithTopNav } from '@/components/Dashboard/BannerWithTopNav';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';

const EnhancedMobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';
  
  const { 
    getBannerSettings,
    updateBannerSelection 
  } = useDashboardWorkspace();
  
  const { url: selectedBannerUrl } = getBannerSettings();

  const handleImageUpload = async (file: File) => {
    console.log('Image upload:', file);
  };

  const handleVideoUpload = async (file: File) => {
    console.log('Video upload:', file);
  };

  const handleAIGenerate = async () => {
    console.log('AI generate');
  };

  const handleImageSelect = async (url: string) => {
    await updateBannerSelection(url, 'image');
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Banner Section - Only show on non-editor pages */}
      {!isEditor && (
        <div className="flex-shrink-0 h-[30vh] min-h-[180px] max-h-[250px]">
          <BannerWithTopNav
            onImageUpload={handleImageUpload}
            onAIGenerate={handleAIGenerate}
            onVideoUpload={handleVideoUpload}
            onImageSelect={handleImageSelect}
            selectedImageUrl={selectedBannerUrl}
            isEditMode={false}
          />
        </div>
      )}
      
      {/* Main Content */}
      <main className={`flex-1 min-h-0 w-full overflow-hidden relative ${isEditor ? 'h-full' : 'pb-16'}`}>
        <div className="h-full w-full overflow-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Enhanced Bottom Navigation - hidden in editor */}
      {!isEditor && (
        <div className="absolute bottom-0 left-0 right-0">
          <EnhancedMobileBottomNav />
        </div>
      )}
      
      {/* Desktop View Button - positioned for frame */}
      <div className="absolute top-2 right-2 z-10">
        <MobileDesktopViewButton />
      </div>
    </div>
  );
};

export default EnhancedMobileLayout;
