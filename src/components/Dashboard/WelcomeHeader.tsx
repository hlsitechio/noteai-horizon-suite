
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Image } from 'lucide-react';
import BannerUpload from './BannerUpload';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannerData, setBannerData] = useState<{url: string, type: 'image' | 'video'} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load banner from localStorage on component mount
    const savedBanner = localStorage.getItem('dashboard_banner');
    console.log('WelcomeHeader: Loading banner from localStorage:', savedBanner);
    if (savedBanner) {
      try {
        const bannerInfo = JSON.parse(savedBanner);
        console.log('WelcomeHeader: Banner info parsed:', bannerInfo);
        setBannerData({
          url: bannerInfo.url,
          type: bannerInfo.type || 'image'
        });
      } catch (error) {
        console.error('WelcomeHeader: Error loading saved banner:', error);
      }
    }
  }, []);

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

  return (
    <div className="relative h-64 overflow-hidden rounded-xl mb-6 border border-blue-100 dark:border-slate-600">
      {/* Banner Background */}
      {bannerData ? (
        bannerData.type === 'video' ? (
          <video
            src={bannerData.url}
            className="absolute inset-0 w-full h-full object-cover"
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
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('WelcomeHeader: Image load error:', e);
            }}
            onLoad={() => {
              console.log('WelcomeHeader: Image loaded successfully');
            }}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Banner Placeholder Content (only show when no banner is set) */}
      {!bannerData && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="text-center text-white">
            <Image className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium">Banner Placeholder</p>
            <p className="text-sm">Upload an image or video to personalize your dashboard</p>
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-end p-8">
        <div className="text-white flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-xl text-white/90 mb-4">
            {formatDate(currentTime)}
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5" />
            <div>
              <div className="text-lg font-semibold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-white/70">
                Local Time
              </div>
            </div>
          </div>
          
          {/* Upload Banner Component */}
          <BannerUpload
            currentBannerUrl={bannerData?.url}
            onBannerUpdate={handleBannerUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
