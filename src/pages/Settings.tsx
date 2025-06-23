import React from 'react';
import ProfileSection from '../components/Settings/ProfileSection';
import PreferencesSection from '../components/Settings/PreferencesSection';
import AISettingsSection from '../components/Settings/AISettingsSection';
import DataExportSection from '../components/Settings/DataExportSection';
import AboutSection from '../components/Settings/AboutSection';
import { Separator } from '@/components/ui/separator';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and application preferences
        </p>
        <Separator className="mt-4" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8">
        {/* Profile Section - Now with better spacing */}
        <section>
          <ProfileSection />
        </section>

        {/* Other Settings Sections */}
        <section>
          <PreferencesSection />
        </section>

        <section>
          <AISettingsSection />
        </section>

        <section>
          <DataExportSection />
        </section>

        <section>
          <AboutSection />
        </section>
      </div>
    </div>
  );
};

export default Settings;
