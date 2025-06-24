
import React from 'react';
import { Button } from '@/components/ui/button';
import { SharePlatform } from '../../services/noteExportService';

interface ShareButtonsProps {
  onShare: (platform: SharePlatform) => void;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ onShare }) => {
  const shareButtons = [
    { platform: 'facebook' as SharePlatform, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { platform: 'twitter' as SharePlatform, label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
    { platform: 'linkedin' as SharePlatform, label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
    { platform: 'whatsapp' as SharePlatform, label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700' },
    { platform: 'email' as SharePlatform, label: 'Email', color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Share to Social Media</h3>
      <div className="grid grid-cols-2 gap-3">
        {shareButtons.map(({ platform, label, color }) => (
          <Button
            key={platform}
            onClick={() => onShare(platform)}
            className={`${color} text-white`}
          >
            {label}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Share your note with friends and colleagues on your favorite platforms.
      </p>
    </div>
  );
};

export default ShareButtons;
