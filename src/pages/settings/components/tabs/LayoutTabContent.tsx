import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { LayoutSettings } from '../LayoutSettings';

export const LayoutTabContent: React.FC = () => {
  return (
    <TabsContent value="layout" className="space-y-6">
      <LayoutSettings />
    </TabsContent>
  );
};