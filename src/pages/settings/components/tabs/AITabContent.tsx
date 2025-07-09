import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AISettingsSection from '@/components/Settings/AISettingsSection';

export const AITabContent: React.FC = () => {
  return (
    <TabsContent value="ai" className="space-y-6">
      <AISettingsSection />
    </TabsContent>
  );
};