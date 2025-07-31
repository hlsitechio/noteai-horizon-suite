import React from 'react';

export const SettingsHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        Settings
      </h1>
      <p className="text-muted-foreground text-lg">
        Manage your account and application preferences
      </p>
    </div>
  );
};