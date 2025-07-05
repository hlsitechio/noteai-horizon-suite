
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
  return (
    <div className="flex items-center gap-2">
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
