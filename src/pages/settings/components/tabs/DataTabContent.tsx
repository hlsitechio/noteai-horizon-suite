import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DataExportSection from '@/components/Settings/DataExportSection';

export const DataTabContent: React.FC = () => {
  return (
    <TabsContent value="data" className="space-y-6">
      <DataExportSection />
    </TabsContent>
  );
};