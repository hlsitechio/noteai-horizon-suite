import { Waves, Trees, Gem } from 'lucide-react';
import { PresetTheme } from './types';

export const natureThemes: PresetTheme[] = [
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool and calming blues',
    icon: Waves,
    colors: {
      light: {
        primary: '200 80% 50%', // Ocean blue
        secondary: '210 70% 45%', // Deeper blue
        accent: '190 85% 55%', // Cyan
        background: '210 15% 98%', // Light blue-gray
        foreground: '210 40% 15%', // Dark blue-gray
        card: '210 10% 96%',
        'card-foreground': '210 40% 15%',
        muted: '210 15% 92%',
        'muted-foreground': '210 25% 40%',
        border: '210 20% 88%'
      },
      dark: {
        primary: '200 80% 60%', // Brighter ocean blue for dark
        secondary: '210 70% 55%', // Adjusted blue
        accent: '190 85% 65%', // Brighter cyan
        background: '210 25% 16%', // Softer dark blue-gray (was 8%)
        foreground: '210 12% 84%', // Softer light blue-gray (was 90%)
        card: '210 20% 20%', // Softer card (was 12%)
        'card-foreground': '210 12% 84%', // Consistent with foreground
        muted: '210 18% 26%', // Less harsh muted (was 15%)
        'muted-foreground': '210 10% 64%', // Softer muted text (was 70%)
        border: '210 15% 32%' // Softer borders (was 20%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(200 80% 50%), hsl(210 70% 45%), hsl(190 85% 55%))'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green tones',
    icon: Trees,
    colors: {
      light: {
        primary: '140 65% 45%', // Forest green
        secondary: '120 60% 40%', // Darker green
        accent: '160 70% 50%', // Mint green
        background: '140 10% 98%', // Light green-gray
        foreground: '140 40% 15%', // Dark green
        card: '140 8% 96%',
        'card-foreground': '140 40% 15%',
        muted: '140 10% 92%',
        'muted-foreground': '140 20% 40%',
        border: '140 15% 88%'
      },
      dark: {
        primary: '140 65% 55%', // Brighter forest green
        secondary: '120 60% 50%', // Adjusted green
        accent: '160 70% 60%', // Brighter mint
        background: '140 24% 16%', // Softer dark green (was 8%)
        foreground: '140 8% 84%', // Softer light green-gray (was 90%)
        card: '140 20% 20%', // Softer card (was 12%)
        'card-foreground': '140 8% 84%', // Consistent with foreground
        muted: '140 16% 26%', // Less harsh muted (was 15%)
        'muted-foreground': '140 6% 64%', // Softer muted text (was 70%)
        border: '140 12% 32%' // Softer borders (was 20%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(140 65% 45%), hsl(120 60% 40%), hsl(160 70% 50%))'
  },
  {
    id: 'emerald-teal',
    name: 'Emerald Teal',
    description: 'Luxurious emerald and teal',
    icon: Gem,
    colors: {
      light: {
        primary: '170 70% 45%', // Emerald teal
        secondary: '160 65% 40%', // Deep teal
        accent: '180 75% 50%', // Bright cyan-teal
        background: '170 15% 98%', // Light teal-gray
        foreground: '170 40% 15%', // Dark teal
        card: '170 10% 96%',
        'card-foreground': '170 40% 15%',
        muted: '170 15% 92%',
        'muted-foreground': '170 25% 40%',
        border: '170 20% 88%'
      },
      dark: {
        primary: '170 70% 55%', // Brighter emerald
        secondary: '160 65% 50%', // Adjusted teal
        accent: '180 75% 60%', // Bright teal accent
        background: '170 25% 16%', // Softer dark emerald (was 8%)
        foreground: '170 12% 84%', // Softer light teal-gray (was 90%)
        card: '170 20% 20%', // Softer card (was 12%)
        'card-foreground': '170 12% 84%', // Consistent with foreground
        muted: '170 18% 26%', // Less harsh muted (was 15%)
        'muted-foreground': '170 10% 64%', // Softer muted text (was 70%)
        border: '170 15% 32%' // Softer borders (was 20%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(170 70% 45%), hsl(160 65% 40%), hsl(180 75% 50%))'
  }
];