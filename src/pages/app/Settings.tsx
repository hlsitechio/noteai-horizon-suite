import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { SettingsHeader } from '../settings/components/SettingsHeader';
import { SettingsTabs } from '../settings/components/SettingsTabs';
import { SettingsContent } from '../settings/components/SettingsContent';

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'layout', 'themes', 'preferences', 'weather', 'ai', 'data', 'download', 'onboarding', 'support', 'about'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <SettingsHeader />
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <SettingsTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        <SettingsContent activeTab={activeTab} />
      </Tabs>
    </div>
  );
};

export default Settings;