import React from 'react';
import { CategoryContent } from './CategoryContent';

interface SettingsContentProps {
  activeTab: string;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ activeTab }) => {
  return (
    <div className="mt-6">
      <CategoryContent activeTab={activeTab} />
    </div>
  );
};