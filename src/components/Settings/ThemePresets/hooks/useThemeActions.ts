import { useState } from 'react';
import { toast } from 'sonner';
import { useAccentColor } from '../../../../contexts/AccentColorContext';
import { useTheme } from '../../../../providers/ThemeProvider';
import { getResolvedTheme } from '../../../../utils/themeUtils';
import { PresetTheme } from '../constants/themeData';
import { GradientPreset } from '../constants/gradientData';

export const useThemeActions = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const { setAccentColor } = useAccentColor();
  const { theme } = useTheme();
  const resolvedTheme = getResolvedTheme(theme);

  const applyTheme = (themeConfig: PresetTheme) => {
    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';
    const colors = isDark ? themeConfig.colors.dark : themeConfig.colors.light;
    
    // Apply all color variables for comprehensive theming
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply additional semantic colors that are consistent
    root.style.setProperty('--destructive', isDark ? '0 85% 65%' : '0 84.2% 60.2%');
    root.style.setProperty('--destructive-foreground', isDark ? '0 0% 95%' : '210 40% 98%');
    root.style.setProperty('--success', '142.1 76.2% 36.3%');
    root.style.setProperty('--success-foreground', isDark ? '0 0% 95%' : '210 40% 98%');
    root.style.setProperty('--warning', '38.2 92% 50%');
    root.style.setProperty('--warning-foreground', isDark ? '0 0% 10%' : '222.2 84% 4.9%');
    root.style.setProperty('--info', colors.primary);
    root.style.setProperty('--info-foreground', isDark ? '0 0% 10%' : '210 40% 98%');
    
    // Update input and ring colors to match theme
    root.style.setProperty('--input', colors.border);
    root.style.setProperty('--ring', colors.primary);
    
    // Update popover colors
    root.style.setProperty('--popover', colors.card);
    root.style.setProperty('--popover-foreground', colors['card-foreground']);
    
    // Update accent color context
    setAccentColor(`hsl(${colors.primary})`, colors.primary);
    
    setSelectedTheme(themeConfig.id);
    setSelectedGradient(null);
    toast.success(`Applied ${themeConfig.name} theme!`);
  };

  const applyGradient = (gradient: GradientPreset) => {
    const root = document.documentElement;
    
    // Apply gradient as CSS custom properties
    root.style.setProperty('--gradient-primary', gradient.gradient);
    root.style.setProperty('--primary', gradient.accentColor);
    root.style.setProperty('--accent', gradient.accentColor);
    
    // Update accent color context
    setAccentColor(`hsl(${gradient.accentColor})`, gradient.accentColor);
    
    setSelectedGradient(gradient.id);
    setSelectedTheme(null);
    toast.success(`Applied ${gradient.name} gradient theme!`);
  };

  const resetToDefault = () => {
    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';
    
    if (isDark) {
      // Reset to default dark theme values (Quantum Aurora)
      root.style.setProperty('--primary', '165 100% 65%');
      root.style.setProperty('--secondary', '45 100% 70%');
      root.style.setProperty('--accent', '290 100% 75%');
      root.style.setProperty('--background', '220 30% 2%');
      root.style.setProperty('--foreground', '45 100% 95%');
      root.style.setProperty('--card', '220 25% 4%');
      root.style.setProperty('--card-foreground', '45 90% 92%');
      root.style.setProperty('--muted', '220 20% 8%');
      root.style.setProperty('--muted-foreground', '45 40% 75%');
      root.style.setProperty('--border', '220 25% 15%');
      setAccentColor('hsl(165 100% 65%)', '165 100% 65%');
    } else {
      // Reset to default light theme values
      root.style.setProperty('--primary', '221.2 83.2% 53.3%');
      root.style.setProperty('--secondary', '210 40% 96%');
      root.style.setProperty('--accent', '210 40% 96%');
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--muted', '210 40% 96%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      setAccentColor('hsl(221.2 83.2% 53.3%)', '221.2 83.2% 53.3%');
    }
    
    // Reset common properties
    root.style.setProperty('--input', '214.3 31.8% 91.4%');
    root.style.setProperty('--ring', '221.2 83.2% 53.3%');
    root.style.removeProperty('--gradient-primary');
    
    setSelectedTheme(null);
    setSelectedGradient(null);
    toast.success('Reset to default theme');
  };

  return {
    selectedTheme,
    selectedGradient,
    resolvedTheme,
    applyTheme,
    applyGradient,
    resetToDefault
  };
};