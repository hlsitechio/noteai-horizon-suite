
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
    <div className="space-y-4">
      {/* Professional Banner Section */}
      <div 
        className="relative h-40 md:h-48 lg:h-56 overflow-hidden rounded-lg border border-border bg-card group shadow-soft"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Banner Background */}
        <BannerBackground
          bannerData={bannerData}
          isLoading={isLoading}
          onBannerClick={handleBannerClick}
        />
        
        {/* Clean Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30 group-hover:from-background/80 group-hover:via-background/50 group-hover:to-background/20 transition-all duration-300"></div>
        
        {/* Welcome Content Overlay */}
        <WelcomeContent currentTime={currentTime} />

        {/* Banner Placeholder Content */}
        <BannerPlaceholder isVisible={!isLoading && !bannerData} />

        {/* Clean Banner Controls */}
        <BannerControls
          showControls={showControls}
          currentBannerUrl={bannerData?.url}
          onBannerUpdate={handleBannerUpdate}
          onBannerDelete={handleBannerDelete}
          onAIBannerGenerated={handleAIBannerGenerated}
        />

        {/* Fullscreen Hint */}
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
