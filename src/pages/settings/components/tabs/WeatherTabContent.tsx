import React from 'react';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';

export const WeatherTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <WeatherSettings />
    </div>
  );
};