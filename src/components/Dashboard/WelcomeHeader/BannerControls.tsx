
import React from 'react';
import AIBannerGenerator from '../AIBannerGenerator';
import BannerUpload from '../BannerUpload';

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
  // Only show controls when explicitly requested and when hovering
  if (!showControls) return null;
  
  return (
    <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
      <AIBannerGenerator onBannerGenerated={onAIBannerGenerated} />
      <BannerUpload
        currentBannerUrl={currentBannerUrl}
        onBannerUpdate={onBannerUpdate}
        onBannerDelete={onBannerDelete}
      />
    </div>
  );
};

export default BannerControls;
