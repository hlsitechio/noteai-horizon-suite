import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ProfileSection from '@/components/Settings/ProfileSection';
import PreferencesSection from '@/components/Settings/PreferencesSection';
import AISettingsSection from '@/components/Settings/AISettingsSection';
import DataExportSection from '@/components/Settings/DataExportSection';
import AboutSection from '@/components/Settings/AboutSection';
import { AdvancedColorPicker } from '@/components/Settings/AdvancedColorPicker';
import { PWADownloadSection } from '@/components/Settings/PWADownloadSection';
import DynamicAccentSection from '@/components/Settings/DynamicAccentSection';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';
import { LayoutSettings } from './LayoutSettings';
import { useAccentColor } from '@/contexts/AccentColorContext';

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
        <TabsContent value="profile" className="space-y-6">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <LayoutSettings />
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <DynamicAccentSection />
          <AdvancedColorPicker 
            currentColor={accentColor}
            onColorChange={handleColorChange}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSection />
        </TabsContent>

        <TabsContent value="weather" className="space-y-6">
          <WeatherSettings />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AISettingsSection />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataExportSection />
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <PWADownloadSection />
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <AboutSection />
        </TabsContent>
      </div>
    </Tabs>
  );
};