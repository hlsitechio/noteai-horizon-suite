import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AboutSection from '@/components/Settings/AboutSection';

export const AboutTabContent: React.FC = () => {
  return (
    <TabsContent value="about" className="space-y-6">
      <AboutSection />
    </TabsContent>
  );
};