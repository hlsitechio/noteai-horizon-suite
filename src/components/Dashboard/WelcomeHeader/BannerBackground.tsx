
import React from 'react';

interface BannerBackgroundProps {
  bannerData: {url: string, type: 'image' | 'video'} | null;
  isLoading: boolean;
  onBannerClick: () => void;
}

const BannerBackground: React.FC<BannerBackgroundProps> = ({ 
  bannerData, 
  isLoading, 
  onBannerClick 
}) => {
  if (isLoading || !bannerData) {
    return <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>;
  }

  return (
    <div 
      className="absolute inset-0 cursor-pointer"
      onClick={onBannerClick}
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
  );
};

export default BannerBackground;
