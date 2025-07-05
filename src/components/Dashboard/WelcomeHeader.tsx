
import React from 'react';
import FullscreenBanner from './FullscreenBanner';
import WelcomeContent from './WelcomeHeader/WelcomeContent';
import BannerBackground from './WelcomeHeader/BannerBackground';
import BannerControls from './WelcomeHeader/BannerControls';
import BannerPlaceholder from './WelcomeHeader/BannerPlaceholder';
import FullscreenHint from './WelcomeHeader/FullscreenHint';
import { useWelcomeHeader } from './WelcomeHeader/hooks/useWelcomeHeader';

const WelcomeHeader: React.FC = () => {
  const {
    currentTime,
    bannerData,
    isLoading,
    isFullscreenOpen,
    showControls,
    setShowControls,
    handleBannerUpdate,
    handleBannerDelete,
    handleAIBannerGenerated,
    handleBannerClick,
    setIsFullscreenOpen
  } = useWelcomeHeader();

  return (
    <div className="space-y-2">
      {/* Responsive Banner Section */}
      <div 
        className="relative h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 overflow-hidden rounded-lg border border-blue-100 dark:border-slate-600 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Banner Background */}
        <BannerBackground
          bannerData={bannerData}
          isLoading={isLoading}
          onBannerClick={handleBannerClick}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
        
        {/* Welcome Content Overlay */}
        <WelcomeContent currentTime={currentTime} />

        {/* Banner Placeholder Content */}
        <BannerPlaceholder isVisible={!isLoading && !bannerData} />

        {/* Unified Banner Controls */}
        <BannerControls
          showControls={showControls}
          currentBannerUrl={bannerData?.url}
          onBannerUpdate={handleBannerUpdate}
          onBannerDelete={handleBannerDelete}
          onAIBannerGenerated={handleAIBannerGenerated}
        />

        {/* Click to fullscreen hint */}
        <FullscreenHint
          showControls={showControls}
          isVisible={!isLoading && !!bannerData}
        />
      </div>

      {/* Fullscreen Banner Modal */}
      <FullscreenBanner
        bannerData={bannerData}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
};

export default WelcomeHeader;
