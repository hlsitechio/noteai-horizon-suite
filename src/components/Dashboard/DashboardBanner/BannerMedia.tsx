import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Image } from 'lucide-react';

interface BannerMediaProps {
  bannerData: {url: string, type: 'image' | 'video'} | null;
  isLoading: boolean;
  onBannerClick: () => void;
}

const BannerMedia: React.FC<BannerMediaProps> = ({ 
  bannerData, 
  isLoading, 
  onBannerClick 
}) => {
  const [mediaError, setMediaError] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  if (isLoading || !bannerData) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/60 flex flex-col items-center gap-2">
            <Image className="w-8 h-8" />
            <span className="text-sm font-medium">Loading banner...</span>
          </div>
        </div>
      </div>
    );
  }

  if (mediaError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-dashed border-red-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm font-medium">Failed to load banner</span>
          </div>
        </div>
      </div>
    );
  }

  const handleMediaLoad = () => {
    setIsMediaLoading(false);
    setMediaError(false);
  };

  const handleMediaError = (e: React.SyntheticEvent) => {
    console.error('Banner media load error:', e);
    setMediaError(true);
    setIsMediaLoading(false);
  };

  return (
    <motion.div 
      className="absolute inset-0 cursor-pointer"
      onClick={onBannerClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Loading overlay */}
      {isMediaLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60 flex flex-col items-center gap-2">
              <Image className="w-6 h-6 animate-pulse" />
              <span className="text-xs">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {bannerData.type === 'video' ? (
        <video
          src={bannerData.url}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          autoPlay
          loop
          muted
          playsInline
          onError={handleMediaError}
          onLoadedData={handleMediaLoad}
          onCanPlay={handleMediaLoad}
        />
      ) : (
        <img
          src={bannerData.url}
          alt="Dashboard banner"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          onError={handleMediaError}
          onLoad={handleMediaLoad}
        />
      )}
    </motion.div>
  );
};

export default BannerMedia;