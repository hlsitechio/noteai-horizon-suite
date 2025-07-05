
import React from 'react';
import { Clock } from 'lucide-react';
import FullscreenBanner from './FullscreenBanner';
import BannerBackground from './WelcomeHeader/BannerBackground';
import BannerControls from './WelcomeHeader/BannerControls';
import BannerPlaceholder from './WelcomeHeader/BannerPlaceholder';
import FullscreenHint from './WelcomeHeader/FullscreenHint';
import ResizableBanner from './WelcomeHeader/ResizableBanner';
import { useWelcomeHeader } from './WelcomeHeader/hooks/useWelcomeHeader';
import { useAuth } from '../../contexts/AuthContext';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
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
      {/* Fixed Welcome Text Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between px-6 py-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1 leading-tight text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {currentTime.toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-right self-end sm:self-center mt-3 sm:mt-0">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <div>
            <div className="text-base sm:text-lg font-medium text-foreground">
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              Local Time
            </div>
          </div>
        </div>
      </div>

      {/* Professional Banner Section */}
      <ResizableBanner
        minHeight={120}
        maxHeight={500}
        defaultHeight={224}
      >
        <div 
          className="absolute inset-0 w-full h-full"
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
      </ResizableBanner>

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
