import { Palette, Zap } from 'lucide-react';
import { PresetTheme } from './types';

export const specialThemes: PresetTheme[] = [
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic grayscale',
    icon: Palette,
    colors: {
      light: {
        primary: '0 0% 30%', // Dark gray
        secondary: '0 0% 50%', // Medium gray
        accent: '0 0% 70%', // Light gray
        background: '0 0% 98%', // Almost white
        foreground: '0 0% 10%', // Almost black
        card: '0 0% 96%',
        'card-foreground': '0 0% 10%',
        muted: '0 0% 92%',
        'muted-foreground': '0 0% 40%',
        border: '0 0% 88%'
      },
      dark: {
        primary: '0 0% 70%', // Light gray for dark mode
        secondary: '0 0% 50%', // Medium gray
        accent: '0 0% 60%', // Adjusted gray
        background: '0 0% 8%', // Almost black
        foreground: '0 0% 90%', // Almost white
        card: '0 0% 12%',
        'card-foreground': '0 0% 90%',
        muted: '0 0% 15%',
        'muted-foreground': '0 0% 70%',
        border: '0 0% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(0 0% 30%), hsl(0 0% 50%), hsl(0 0% 70%))'
  },
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    description: 'Vibrant neon colors',
    icon: Zap,
    colors: {
      light: {
        primary: '300 80% 45%', // Toned down magenta for light
        secondary: '180 80% 45%', // Toned down cyan
        accent: '60 80% 50%', // Toned down yellow
        background: '0 0% 98%', // Light background
        foreground: '0 0% 10%', // Dark text
        card: '0 0% 96%',
        'card-foreground': '0 0% 10%',
        muted: '0 0% 92%',
        'muted-foreground': '0 0% 40%',
        border: '0 0% 88%'
      },
      dark: {
        primary: '300 100% 65%', // Bright neon magenta
        secondary: '180 100% 65%', // Bright neon cyan
        accent: '60 100% 65%', // Bright neon yellow
        background: '0 0% 5%', // Almost black
        foreground: '0 0% 95%', // Almost white
        card: '0 0% 8%',
        'card-foreground': '0 0% 95%',
        muted: '0 0% 12%',
        'muted-foreground': '0 0% 75%',
        border: '0 0% 18%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(300 100% 50%), hsl(180 100% 50%), hsl(60 100% 50%))'
  }
];