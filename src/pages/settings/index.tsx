import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsTabs } from './components/SettingsTabs';
import { SettingsContent } from './components/SettingsContent';

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('account');
  
  // Development logging only
  if (import.meta.env.DEV) {
    console.log('Settings component rendered with activeTab:', activeTab);
  }

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['account', 'appearance', 'integrations', 'system', 'help'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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