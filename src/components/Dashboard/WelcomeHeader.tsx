
import React from 'react';
import { Clock } from 'lucide-react';
import FullscreenBanner from './FullscreenBanner';
import BannerBackground from './WelcomeHeader/BannerBackground';

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

  // Get user name safely
  const getUserFirstName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0] || 'User';
  };

  return (
    <div className="space-y-4">
      {/* Compact Welcome Text Section */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">
            Welcome back, {getUserFirstName()}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {currentTime.toLocaleDateString([], {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
              })}
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
