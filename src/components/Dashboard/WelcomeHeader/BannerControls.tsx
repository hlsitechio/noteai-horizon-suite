
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
    <div className={`absolute top-2 right-2 z-10 transition-all duration-300 ${
      showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="flex items-center gap-1 p-1.5 bg-black/40 backdrop-blur-md rounded-md border border-white/20">
        <AIBannerGenerator onBannerGenerated={onAIBannerGenerated} />
        <BannerUpload
          currentBannerUrl={currentBannerUrl}
          onBannerUpdate={onBannerUpdate}
          onBannerDelete={onBannerDelete}
        />
      </div>
    </div>
  );
};

export default BannerControls;
