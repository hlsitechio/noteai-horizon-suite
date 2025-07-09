import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsTabs } from './components/SettingsTabs';
import { SettingsContent } from './components/SettingsContent';

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'layout', 'themes', 'preferences', 'weather', 'ai', 'data', 'download', 'about'].includes(tab)) {
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
      <SettingsTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <SettingsContent activeTab={activeTab} />
    </div>
  );
};

export default Settings;