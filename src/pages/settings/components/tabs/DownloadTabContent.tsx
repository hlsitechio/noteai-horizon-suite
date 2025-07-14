import React from 'react';
import { PWADownloadSection } from '@/components/Settings/PWADownloadSection';

export const DownloadTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <PWADownloadSection />
    </div>
  );
};