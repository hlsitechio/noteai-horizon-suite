import { Cherry, Flower2 } from 'lucide-react';
import { PresetTheme } from './types';

export const softThemes: PresetTheme[] = [
  {
    id: 'sakura-pink',
    name: 'Sakura Pink',
    description: 'Soft cherry blossom tones',
    icon: Cherry,
    colors: {
      light: {
        primary: '330 70% 60%', // Soft pink
        secondary: '340 65% 55%', // Rose pink
        accent: '320 80% 65%', // Bright pink
        background: '330 25% 98%', // Very light pink
        foreground: '330 35% 20%', // Dark pink-brown
        card: '330 20% 96%',
        'card-foreground': '330 35% 20%',
        muted: '330 20% 92%',
        'muted-foreground': '330 25% 45%',
        border: '330 25% 88%'
      },
      dark: {
        primary: '330 70% 70%', // Brighter pink for dark
        secondary: '340 65% 65%', // Adjusted rose
        accent: '320 80% 75%', // Bright accent pink
        background: '330 35% 8%', // Dark pink
        foreground: '330 20% 90%', // Light pink-gray
        card: '330 30% 12%',
        'card-foreground': '330 20% 90%',
        muted: '330 25% 15%',
        'muted-foreground': '330 15% 70%',
        border: '330 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(330 70% 60%), hsl(340 65% 55%), hsl(320 80% 65%))'
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    description: 'Gentle lavender hues',
    icon: Flower2,
    colors: {
      light: {
        primary: '250 60% 60%', // Soft lavender
        secondary: '240 55% 55%', // Purple-blue
        accent: '260 70% 65%', // Light purple
        background: '250 20% 98%', // Very light lavender
        foreground: '250 40% 20%', // Dark purple
        card: '250 15% 96%',
        'card-foreground': '250 40% 20%',
        muted: '250 15% 92%',
        'muted-foreground': '250 25% 45%',
        border: '250 20% 88%'
      },
      dark: {
        primary: '250 60% 70%', // Brighter lavender
        secondary: '240 55% 65%', // Adjusted purple-blue
        accent: '260 70% 75%', // Bright purple accent
        background: '250 35% 8%', // Dark lavender
        foreground: '250 15% 90%', // Light lavender-gray
        card: '250 30% 12%',
        'card-foreground': '250 15% 90%',
        muted: '250 25% 15%',
        'muted-foreground': '250 15% 70%',
        border: '250 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(250 60% 60%), hsl(240 55% 55%), hsl(260 70% 65%))'
  }
];