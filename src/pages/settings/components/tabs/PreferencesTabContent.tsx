import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PreferencesSection from '@/components/Settings/PreferencesSection';

export const PreferencesTabContent: React.FC = () => {
  return (
    <TabsContent value="preferences" className="space-y-6">
      <PreferencesSection />
    </TabsContent>
  );
};