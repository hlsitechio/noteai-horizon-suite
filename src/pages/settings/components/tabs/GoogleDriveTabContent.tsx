import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { GoogleDriveSection } from '@/components/Settings/GoogleDriveSection';

export const GoogleDriveTabContent: React.FC = () => {
  return (
    <TabsContent value="drive" className="space-y-6">
      <GoogleDriveSection />
    </TabsContent>
  );
};