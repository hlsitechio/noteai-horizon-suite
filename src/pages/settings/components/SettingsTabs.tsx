import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Layout, Palette, Settings as SettingsIcon, Cloud, Sliders, Download, Monitor, Info } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-9">
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Profile
      </TabsTrigger>
      <TabsTrigger value="layout" className="flex items-center gap-2">
        <Layout className="h-4 w-4" />
        Layout
      </TabsTrigger>
      <TabsTrigger value="themes" className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Themes
      </TabsTrigger>
      <TabsTrigger value="preferences" className="flex items-center gap-2">
        <SettingsIcon className="h-4 w-4" />
        Preferences
      </TabsTrigger>
      <TabsTrigger value="weather" className="flex items-center gap-2">
        <Cloud className="h-4 w-4" />
        Weather
      </TabsTrigger>
      <TabsTrigger value="ai" className="flex items-center gap-2">
        <Sliders className="h-4 w-4" />
        AI Settings
      </TabsTrigger>
      <TabsTrigger value="data" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Data Export
      </TabsTrigger>
      <TabsTrigger value="download" className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        Desktop App
      </TabsTrigger>
      <TabsTrigger value="about" className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        About
      </TabsTrigger>
    </TabsList>
  );
};