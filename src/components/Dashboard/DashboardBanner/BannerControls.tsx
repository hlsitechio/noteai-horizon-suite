import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BannerControlsComponent from '../WelcomeHeader/BannerControls';

interface BannerControlsProps {
  showControls: boolean;
  currentBannerUrl?: string;
  onBannerUpdate: (bannerUrl: string, type: 'image' | 'video') => void;
  onBannerDelete: () => void;
  onAIBannerGenerated: (imageUrl: string) => Promise<void>;
}

const BannerControls: React.FC<BannerControlsProps> = ({
  showControls,
  currentBannerUrl,
  onBannerUpdate,
  onBannerDelete,
  onAIBannerGenerated
}) => {
  const controlsVariants = {
    hidden: { 
      opacity: 0, 
      y: -10
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          className="absolute top-2 right-2 z-50"
          variants={controlsVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
        >
          <BannerControlsComponent
            showControls={true}  
            currentBannerUrl={currentBannerUrl}
            onBannerUpdate={onBannerUpdate}
            onBannerDelete={onBannerDelete}
            onAIBannerGenerated={onAIBannerGenerated}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BannerControls;