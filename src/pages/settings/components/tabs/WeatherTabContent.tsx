import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';

export const WeatherTabContent: React.FC = () => {
  return (
    <TabsContent value="weather" className="space-y-6">
      <WeatherSettings />
    </TabsContent>
  );
};