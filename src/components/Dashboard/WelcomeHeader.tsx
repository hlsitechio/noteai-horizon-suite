
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Image, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BannerUpload from './BannerUpload';
import AIBannerGenerator from './AIBannerGenerator';
import FullscreenBanner from './FullscreenBanner';
import { BannerStorageService, BannerData } from '@/services/bannerStorage';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannerData, setBannerData] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load banner from Supabase on component mount
    const loadBanner = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('WelcomeHeader: Loading dashboard banner from Supabase');
        const banner = await BannerStorageService.getBanner('dashboard');
        if (banner) {
          console.log('WelcomeHeader: Banner loaded:', banner);
          setBannerData({
            url: banner.file_url,
            type: banner.file_type
          });
        } else {
          console.log('WelcomeHeader: No banner found');
          setBannerData(null);
        }
      } catch (error) {
        console.error('WelcomeHeader: Error loading banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, [user]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFirstName = (name: string) => {
    return name?.split(' ')[0] || 'User';
  };

  const handleBannerUpdate = (bannerUrl: string, type: 'image' | 'video') => {
    console.log('WelcomeHeader: Banner updated:', type, bannerUrl.substring(0, 50) + '...');
    setBannerData({ url: bannerUrl, type });
  };

  const handleBannerDelete = () => {
    console.log('WelcomeHeader: Banner deleted');
    setBannerData(null);
  };

  const handleAIBannerGenerated = async (imageUrl: string) => {
    console.log('WelcomeHeader: AI banner generated:', imageUrl.substring(0, 50) + '...');
    
    // Convert the base64 image to a File object and upload it
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'ai-generated-banner.png', { type: 'image/png' });
      
      // Upload using the banner storage service
      const bannerData = await BannerStorageService.uploadBanner(file, 'dashboard');
      
      if (bannerData) {
        setBannerData({
          url: bannerData.file_url,
          type: bannerData.file_type
        });
      }
    } catch (error) {
      console.error('WelcomeHeader: Error saving AI banner:', error);
      // Still show the generated banner even if upload fails
      setBannerData({ url: imageUrl, type: 'image' });
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreenOpen(!isFullscreenOpen);
  };

  const handleBannerClick = () => {
    if (bannerData) {
      setIsFullscreenOpen(true);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Banner Section */}
      <div 
        className="relative h-64 overflow-hidden rounded-xl border border-blue-100 dark:border-slate-600 group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Banner Background */}
        {!isLoading && bannerData ? (
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={handleBannerClick}
          >
            {bannerData.type === 'video' ? (
              <video
                src={bannerData.url}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  console.error('WelcomeHeader: Video playback error:', e);
                }}
                onLoadedData={() => {
                  console.log('WelcomeHeader: Video loaded successfully');
                }}
                onCanPlay={() => {
                  console.log('WelcomeHeader: Video can play');
                }}
              />
            ) : (
              <img
                src={bannerData.url}
                alt="Dashboard banner"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error('WelcomeHeader: Image load error:', e);
                }}
                onLoad={() => {
                  console.log('WelcomeHeader: Image loaded successfully');
                }}
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
        
        {/* Banner Placeholder Content (only show when no banner is set) */}
        {!isLoading && !bannerData && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="text-center text-white">
              <Image className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Banner Placeholder</p>
              <p className="text-sm">Upload an image or video to personalize your dashboard</p>
            </div>
          </div>
        )}

        {/* Unified Banner Controls */}
        <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/20">
            <AIBannerGenerator onBannerGenerated={handleAIBannerGenerated} />
            <BannerUpload
              currentBannerUrl={bannerData?.url}
              onBannerUpdate={handleBannerUpdate}
              onBannerDelete={handleBannerDelete}
            />
          </div>
        </div>

        {/* Click to fullscreen hint - only show when banner exists */}
        {!isLoading && bannerData && (
          <div className={`absolute bottom-4 left-4 z-10 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          } text-white/90 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full`}>
            Click to view fullscreen
          </div>
        )}
      </div>

      {/* Welcome Content Below Banner */}
      <div className="flex items-center justify-between p-6 bg-card/50 rounded-xl border border-border/20 backdrop-blur-sm">
        <div className="text-foreground flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {formatDate(currentTime)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-right">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-lg font-semibold text-foreground">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              Local Time
            </div>
          </div>
        </div>
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
