import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { PWADownloadSection } from '@/components/Settings/PWADownloadSection';

export const DownloadTabContent: React.FC = () => {
  return (
    <TabsContent value="download" className="space-y-6">
      <PWADownloadSection />
    </TabsContent>
  );
};