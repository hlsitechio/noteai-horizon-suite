
import React from 'react';
import { Image } from 'lucide-react';

interface BannerPlaceholderProps {
  isVisible: boolean;
}

const BannerPlaceholder: React.FC<BannerPlaceholderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
      <div className="text-center text-white">
        <Image className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm font-medium">Banner Placeholder</p>
        <p className="text-xs">Upload an image or video to personalize your dashboard</p>
      </div>
    </div>
  );
};

export default BannerPlaceholder;
