import { Snowflake, Gem, Droplets } from 'lucide-react';
import { PresetTheme } from './types';

export const whiteThemes: PresetTheme[] = [
  {
    id: 'theme-pristine',
    name: 'Pristine White',
    description: 'Ultra clean and minimal design',
    icon: Snowflake,
    colors: {
      light: {
        primary: '220 100% 50%', // Pure blue
        secondary: '220 80% 45%', // Deeper blue
        accent: '200 100% 55%', // Sky blue
        background: '0 0% 100%', // Pure white
        foreground: '220 20% 10%', // Deep blue-gray
        card: '0 0% 99%', // Off-white
        'card-foreground': '220 20% 10%',
        muted: '220 20% 96%', // Very light blue-gray
        'muted-foreground': '220 15% 45%', // Medium blue-gray
        border: '220 20% 85%' // Light blue-gray
      },
      dark: {
        primary: '220 100% 60%', // Brighter blue for dark
        secondary: '220 80% 55%', // Adjusted blue
        accent: '200 100% 65%', // Brighter sky blue
        background: '220 25% 8%', // Dark blue-gray
        foreground: '220 12% 90%', // Light blue-gray
        card: '220 20% 12%', // Dark card
        'card-foreground': '220 12% 90%',
        muted: '220 18% 15%', // Dark muted
        'muted-foreground': '220 10% 70%', // Muted text
        border: '220 15% 20%' // Dark borders
      }
    },
    preview: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(220 20% 96%), hsl(220 100% 50% / 0.1))'
  },
  {
    id: 'theme-pearl',
    name: 'Pearl Elegance',
    description: 'Sophisticated pearl tones with subtle shimmer',
    icon: Gem,
    colors: {
      light: {
        primary: '210 80% 55%', // Pearl blue
        secondary: '210 70% 50%', // Deeper pearl
        accent: '190 70% 60%', // Pearl cyan
        background: '0 0% 100%', // Pure white
        foreground: '210 15% 12%', // Dark pearl
        card: '210 10% 98%', // Pearl white
        'card-foreground': '210 15% 12%',
        muted: '210 25% 93%', // Pearl gray
        'muted-foreground': '210 20% 35%', // Medium pearl
        border: '210 20% 82%' // Pearl border
      },
      dark: {
        primary: '210 80% 65%', // Brighter pearl blue
        secondary: '210 70% 60%', // Adjusted pearl
        accent: '190 70% 70%', // Brighter pearl cyan
        background: '210 25% 8%', // Dark pearl
        foreground: '210 12% 90%', // Light pearl
        card: '210 20% 12%', // Dark pearl card
        'card-foreground': '210 12% 90%',
        muted: '210 18% 15%', // Dark pearl muted
        'muted-foreground': '210 10% 70%', // Pearl muted text
        border: '210 15% 20%' // Dark pearl borders
      }
    },
    preview: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(210 25% 93%), hsl(210 80% 55% / 0.15))'
  },
  {
    id: 'theme-crystal',
    name: 'Crystal Clear',
    description: 'Transparent clarity with cool blues',
    icon: Droplets,
    colors: {
      light: {
        primary: '200 100% 45%', // Crystal blue
        secondary: '200 80% 40%', // Deep crystal
        accent: '180 80% 50%', // Crystal cyan
        background: '0 0% 100%', // Pure white
        foreground: '200 20% 8%', // Dark crystal
        card: '200 15% 99%', // Crystal white
        'card-foreground': '200 20% 8%',
        muted: '200 25% 95%', // Crystal gray
        'muted-foreground': '200 20% 30%', // Medium crystal
        border: '200 25% 84%' // Crystal border
      },
      dark: {
        primary: '200 100% 55%', // Brighter crystal blue
        secondary: '200 80% 50%', // Adjusted crystal
        accent: '180 80% 60%', // Brighter crystal cyan
        background: '200 25% 8%', // Dark crystal
        foreground: '200 12% 90%', // Light crystal
        card: '200 20% 12%', // Dark crystal card
        'card-foreground': '200 12% 90%',
        muted: '200 18% 15%', // Dark crystal muted
        'muted-foreground': '200 10% 70%', // Crystal muted text
        border: '200 15% 20%' // Dark crystal borders
      }
    },
    preview: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(200 25% 95%), hsl(200 100% 45% / 0.1))'
  }
];