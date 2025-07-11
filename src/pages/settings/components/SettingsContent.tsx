import React from 'react';
import { useAccentColor } from '@/contexts/AccentColorContext';
import { ProfileTabContent } from './tabs/ProfileTabContent';
import { LayoutTabContent } from './tabs/LayoutTabContent';
import { ThemesTabContent } from './tabs/ThemesTabContent';
import { PreferencesTabContent } from './tabs/PreferencesTabContent';
import { WeatherTabContent } from './tabs/WeatherTabContent';
import { AITabContent } from './tabs/AITabContent';
import { GoogleDriveTabContent } from './tabs/GoogleDriveTabContent';
import { DataTabContent } from './tabs/DataTabContent';
import { DownloadTabContent } from './tabs/DownloadTabContent';
import { AboutTabContent } from './tabs/AboutTabContent';
import { OnboardingTabContent } from './tabs/OnboardingTabContent';

interface SettingsContentProps {
  activeTab: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ activeTab }) => {
  const { accentColor, setAccentColor } = useAccentColor();

  const handleColorChange = (color: { name: string; value: string; hsl: string }) => {
    setAccentColor(color.value, color.hsl);
  };

  return (
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
      <GoogleDriveTabContent />
      <DataTabContent />
      <DownloadTabContent />
      <OnboardingTabContent />
      <AboutTabContent />
    </div>
  );
};