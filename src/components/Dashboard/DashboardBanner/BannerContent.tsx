import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BannerMedia from './BannerMedia';
import BannerPlaceholder from './BannerPlaceholder';

interface BannerContentProps {
  bannerData: {url: string, type: 'image' | 'video'} | null;
  isLoading: boolean;
  showControls: boolean;
  onBannerClick: () => void;
}

const BannerContent: React.FC<BannerContentProps> = ({
  bannerData,
  isLoading,
  showControls,
  onBannerClick
}) => {

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Banner Media */}
      <BannerMedia
        bannerData={bannerData}
        isLoading={isLoading}
        onBannerClick={onBannerClick}
      />
      
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Banner Placeholder Content */}
      <AnimatePresence>
        {!isLoading && !bannerData && (
          <BannerPlaceholder />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerContent;