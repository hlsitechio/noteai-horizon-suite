import { Crown, Moon } from 'lucide-react';
import { PresetTheme } from './types';

export const luxuryThemes: PresetTheme[] = [
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Rich purple shades',
    icon: Crown,
    colors: {
      light: {
        primary: '270 75% 55%', // Royal purple
        secondary: '285 70% 50%', // Blue-purple
        accent: '255 80% 60%', // Violet
        background: '270 15% 98%', // Light purple-gray
        foreground: '270 40% 15%', // Dark purple
        card: '270 10% 96%',
        'card-foreground': '270 40% 15%',
        muted: '270 15% 92%',
        'muted-foreground': '270 25% 40%',
        border: '270 20% 88%'
      },
      dark: {
        primary: '270 75% 65%', // Brighter royal purple
        secondary: '285 70% 60%', // Adjusted blue-purple
        accent: '255 80% 70%', // Brighter violet
        background: '270 25% 16%', // Softer dark purple (was 8%)
        foreground: '270 12% 84%', // Softer light purple-gray (was 90%)
        card: '270 20% 20%', // Softer card (was 12%)
        'card-foreground': '270 12% 84%', // Consistent with foreground
        muted: '270 18% 26%', // Less harsh muted (was 15%)
        'muted-foreground': '270 10% 64%', // Softer muted text (was 70%)
        border: '270 15% 32%' // Softer borders (was 20%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(270 75% 55%), hsl(285 70% 50%), hsl(255 80% 60%))'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep midnight navy tones',
    icon: Moon,
    colors: {
      light: {
        primary: '220 70% 40%', // Deep navy
        secondary: '210 65% 35%', // Darker blue
        accent: '230 80% 55%', // Bright blue
        background: '220 15% 98%', // Light blue-gray
        foreground: '220 40% 15%', // Dark navy
        card: '220 10% 96%',
        'card-foreground': '220 40% 15%',
        muted: '220 15% 92%',
        'muted-foreground': '220 25% 40%',
        border: '220 20% 88%'
      },
      dark: {
        primary: '220 70% 60%', // Brighter navy for dark
        secondary: '210 65% 55%', // Adjusted blue
        accent: '230 80% 70%', // Bright blue accent
        background: '220 28% 15%', // Softer dark navy (was 6%)
        foreground: '220 12% 84%', // Softer light blue-gray (was 90%)
        card: '220 24% 19%', // Softer card (was 10%)
        'card-foreground': '220 12% 84%', // Consistent with foreground
        muted: '220 20% 25%', // Less harsh muted (was 12%)
        'muted-foreground': '220 10% 64%', // Softer muted text (was 70%)
        border: '220 16% 30%' // Softer borders (was 18%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(220 70% 40%), hsl(210 65% 35%), hsl(230 80% 55%))'
  }
];