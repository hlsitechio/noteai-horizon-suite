import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Layout, Cloud, Cpu, HelpCircle } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  // Development logging only
  if (import.meta.env.DEV) {
    console.log('SettingsTabs rendered with activeTab:', activeTab);
  }
  
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="account" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Account & Profile
      </TabsTrigger>
      <TabsTrigger value="appearance" className="flex items-center gap-2">
        <Layout className="h-4 w-4" />
        Appearance & Layout
      </TabsTrigger>
      <TabsTrigger value="integrations" className="flex items-center gap-2">
        <Cloud className="h-4 w-4" />
        Integrations & Data
      </TabsTrigger>
      <TabsTrigger value="system" className="flex items-center gap-2">
        <Cpu className="h-4 w-4" />
        System & Apps
      </TabsTrigger>
      <TabsTrigger value="help" className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4" />
        Help & Support
      </TabsTrigger>
    </TabsList>
  );
};