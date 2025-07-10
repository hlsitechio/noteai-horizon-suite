
import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileDesktopViewButton from '../components/MobileDesktopViewButton';
import { useLocation } from 'react-router-dom';
import { BannerWithTopNav } from '@/components/Dashboard/BannerWithTopNav';
import { usePageBannerSettings } from '@/hooks/usePageBannerSettings';

const MobileLayout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname === '/mobile/editor';
  
  const { 
    selectedBannerUrl, 
    handleImageUpload, 
    handleVideoUpload, 
    handleAIGenerate, 
    handleImageSelect 
  } = usePageBannerSettings();

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
      {/* Header - hidden in editor for distraction-free experience */}
      {!isEditor && <MobileHeader />}
      
      {/* Banner Section - Only show on non-editor pages */}
      {!isEditor && (
        <div className="flex-shrink-0 h-[25vh] min-h-[150px] max-h-[200px]">
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
      <main className={`flex-1 min-h-0 w-full overflow-hidden ${isEditor ? 'h-full' : ''}`}>
        <Outlet />
      </main>
      
      {/* Bottom Navigation - hidden in editor */}
      {!isEditor && <MobileBottomNav />}
      
      {/* Desktop View Button - always visible */}
      <MobileDesktopViewButton />
    </div>
  );
};

export default MobileLayout;
