import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useAccentColor } from '@/contexts/AccentColorContext';
import { ProfileTabContent } from './tabs/ProfileTabContent';
import { LayoutTabContent } from './tabs/LayoutTabContent';
import { ThemesTabContent } from './tabs/ThemesTabContent';
import { PreferencesTabContent } from './tabs/PreferencesTabContent';
import { WeatherTabContent } from './tabs/WeatherTabContent';
import { AITabContent } from './tabs/AITabContent';
import { DataTabContent } from './tabs/DataTabContent';
import { DownloadTabContent } from './tabs/DownloadTabContent';
import { AboutTabContent } from './tabs/AboutTabContent';

interface SettingsContentProps {
  activeTab: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ activeTab }) => {
  const { accentColor, setAccentColor } = useAccentColor();

  const handleColorChange = (color: { name: string; value: string; hsl: string }) => {
    setAccentColor(color.value, color.hsl);
  };

  return (
    <Tabs value={activeTab} className="w-full">
      <div className="mt-6">
        <ProfileTabContent />
        <LayoutTabContent />
        <ThemesTabContent 
          accentColor={accentColor}
          onColorChange={handleColorChange}
        />
        <PreferencesTabContent />
        <WeatherTabContent />
        <AITabContent />
        <DataTabContent />
        <DownloadTabContent />
        <AboutTabContent />
      </div>
    </Tabs>
  );
};