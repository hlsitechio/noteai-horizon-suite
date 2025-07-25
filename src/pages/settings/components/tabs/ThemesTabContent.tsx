import React from 'react';
import { AdvancedColorPicker } from '@/components/Settings/AdvancedColorPicker';
import GlowEffectSection from '@/components/Settings/GlowEffectSection';
import { ThemePresets } from '@/components/Settings/ThemePresets';

interface ThemesTabContentProps {
  accentColor: string;
  onColorChange: (color: { name: string; value: string; hsl: string }) => void;
}

export const ThemesTabContent: React.FC<ThemesTabContentProps> = ({ 
  accentColor, 
  onColorChange 
}) => {
  return (
    <div className="space-y-6">
      <ThemePresets />
      <GlowEffectSection />
      <AdvancedColorPicker 
        currentColor={accentColor}
        onColorChange={onColorChange}
      />
    </div>
  );
};