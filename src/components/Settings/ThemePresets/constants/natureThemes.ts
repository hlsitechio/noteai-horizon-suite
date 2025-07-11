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
        background: '210 40% 8%', // Dark blue-gray
        foreground: '210 15% 90%', // Light blue-gray
        card: '210 35% 12%',
        'card-foreground': '210 15% 90%',
        muted: '210 30% 15%',
        'muted-foreground': '210 15% 70%',
        border: '210 25% 20%'
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
        background: '140 40% 8%', // Dark green
        foreground: '140 10% 90%', // Light green-gray
        card: '140 35% 12%',
        'card-foreground': '140 10% 90%',
        muted: '140 30% 15%',
        'muted-foreground': '140 10% 70%',
        border: '140 25% 20%'
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
        background: '170 40% 8%', // Dark emerald
        foreground: '170 15% 90%', // Light teal-gray
        card: '170 35% 12%',
        'card-foreground': '170 15% 90%',
        muted: '170 30% 15%',
        'muted-foreground': '170 15% 70%',
        border: '170 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(170 70% 45%), hsl(160 65% 40%), hsl(180 75% 50%))'
  }
];