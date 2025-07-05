import React from 'react';
import { motion } from 'framer-motion';
import BannerContainer from './BannerContainer';
import BannerContent from './BannerContent';
import BannerControls from './BannerControls';
import FullscreenBanner from '../FullscreenBanner';
import { useBannerState } from './hooks/useBannerState';
import { useBannerInteractions } from './hooks/useBannerInteractions';

interface DashboardBannerProps {
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
}

const DashboardBanner: React.FC<DashboardBannerProps> = ({
  className = '',
  minHeight = 120,
  maxHeight = 500,
  defaultHeight = 224
}) => {
  const {
    bannerData,
    isLoading,
    isFullscreenOpen,
    showControls,
    setShowControls,
    setIsFullscreenOpen
  } = useBannerState();

  const {
    bannerData: stateBannerData,
    isLoading,
    isFullscreenOpen,
    showControls,
    setShowControls,
    setIsFullscreenOpen,
    updateBannerData
  } = useBannerState();

  const {
    handleBannerUpdate,
    handleBannerDelete,
    handleAIBannerGenerated,
    handleBannerClick
  } = useBannerInteractions({ setIsFullscreenOpen, updateBannerData });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`relative ${className}`}
      >
        <BannerContainer
          minHeight={minHeight}
          maxHeight={maxHeight}
          defaultHeight={defaultHeight}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <BannerContent
            bannerData={bannerData}
            isLoading={isLoading}
            showControls={showControls}
            onBannerClick={handleBannerClick}
          />
          
          <BannerControls
            showControls={showControls}
            currentBannerUrl={bannerData?.url}
            onBannerUpdate={handleBannerUpdate}
            onBannerDelete={handleBannerDelete}
            onAIBannerGenerated={handleAIBannerGenerated}
          />
        </BannerContainer>
      </motion.div>

      <FullscreenBanner
        bannerData={bannerData}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </>
  );
};

export default DashboardBanner;