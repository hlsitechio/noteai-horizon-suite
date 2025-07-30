import { PresetTheme, ThemeColors } from './types';
import { whiteThemes } from './whiteThemes';
import { natureThemes } from './natureThemes';
import { warmThemes } from './warmThemes';
import { softThemes } from './softThemes';
import { luxuryThemes } from './luxuryThemes';
import { specialThemes } from './specialThemes';

// Export types for external use
export type { ThemeColors, PresetTheme };

// Combine all theme categories into a single array
export const presetThemes: PresetTheme[] = [
  ...whiteThemes,
  ...natureThemes,
  ...warmThemes,
  ...softThemes,
  ...luxuryThemes,
  ...specialThemes
];