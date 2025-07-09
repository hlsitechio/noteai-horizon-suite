import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { AdvancedColorPicker } from '@/components/Settings/AdvancedColorPicker';
import DynamicAccentSection from '@/components/Settings/DynamicAccentSection';

interface ThemesTabContentProps {
  accentColor: string;
  onColorChange: (color: { name: string; value: string; hsl: string }) => void;
}

export const ThemesTabContent: React.FC<ThemesTabContentProps> = ({ 
  accentColor, 
  onColorChange 
}) => {
  return (
    <TabsContent value="themes" className="space-y-6">
      <DynamicAccentSection />
      <AdvancedColorPicker 
        currentColor={accentColor}
        onColorChange={onColorChange}
      />
    </TabsContent>
  );
};