import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BannerMedia from './BannerMedia';
import BannerPlaceholder from './BannerPlaceholder';
import FullscreenHint from '../WelcomeHeader/FullscreenHint';

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
  const overlayVariants = {
    hover: {
      background: 'linear-gradient(to right, rgba(var(--background) / 0.8), rgba(var(--background) / 0.5), rgba(var(--background) / 0.2))',
      transition: { duration: 0.3 }
    },
    initial: {
      background: 'linear-gradient(to right, rgba(var(--background) / 0.9), rgba(var(--background) / 0.6), rgba(var(--background) / 0.3))',
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Banner Media */}
      <BannerMedia
        bannerData={bannerData}
        isLoading={isLoading}
        onBannerClick={onBannerClick}
      />
      
      {/* Dynamic Overlay */}
      <motion.div
        className="absolute inset-0"
        variants={overlayVariants}
        initial="initial"
        whileHover="hover"
      />
      
      {/* Banner Placeholder Content */}
      <AnimatePresence>
        {!isLoading && !bannerData && (
          <BannerPlaceholder />
        )}
      </AnimatePresence>

      {/* Fullscreen Hint */}
      <AnimatePresence>
        {!isLoading && bannerData && (
          <FullscreenHint
            showControls={showControls}
            isVisible={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerContent;