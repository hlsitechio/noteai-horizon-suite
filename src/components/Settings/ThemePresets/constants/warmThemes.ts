import { Sun, Coffee, Sunset } from 'lucide-react';
import { PresetTheme } from './types';

export const warmThemes: PresetTheme[] = [
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm sunset colors',
    icon: Sun,
    colors: {
      light: {
        primary: '15 85% 60%', // Orange
        secondary: '25 80% 55%', // Orange-red
        accent: '45 90% 65%', // Yellow-orange
        background: '30 20% 98%', // Warm white
        foreground: '15 30% 20%', // Dark brown
        card: '30 15% 96%',
        'card-foreground': '15 30% 20%',
        muted: '30 20% 92%',
        'muted-foreground': '15 20% 40%',
        border: '30 25% 88%'
      },
      dark: {
        primary: '15 85% 65%', // Brighter orange
        secondary: '25 80% 60%', // Adjusted orange-red
        accent: '45 90% 70%', // Brighter yellow-orange
        background: '15 40% 8%', // Dark warm
        foreground: '30 20% 90%', // Light warm
        card: '15 35% 12%',
        'card-foreground': '30 20% 90%',
        muted: '15 30% 15%',
        'muted-foreground': '30 15% 70%',
        border: '15 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(15 85% 60%), hsl(25 80% 55%), hsl(45 90% 65%))'
  },
  {
    id: 'coffee-brown',
    name: 'Coffee Brown',
    description: 'Rich coffee and mocha tones',
    icon: Coffee,
    colors: {
      light: {
        primary: '25 50% 35%', // Coffee brown
        secondary: '20 45% 30%', // Dark brown
        accent: '30 65% 50%', // Lighter brown
        background: '25 15% 98%', // Cream white
        foreground: '25 40% 15%', // Dark brown
        card: '25 12% 96%',
        'card-foreground': '25 40% 15%',
        muted: '25 15% 92%',
        'muted-foreground': '25 25% 40%',
        border: '25 20% 88%'
      },
      dark: {
        primary: '25 55% 55%', // Lighter coffee for dark
        secondary: '20 50% 50%', // Medium brown
        accent: '30 70% 60%', // Light brown accent
        background: '25 35% 8%', // Dark coffee
        foreground: '25 15% 90%', // Light cream
        card: '25 30% 12%',
        'card-foreground': '25 15% 90%',
        muted: '25 25% 15%',
        'muted-foreground': '25 15% 70%',
        border: '25 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(25 50% 35%), hsl(20 45% 30%), hsl(30 65% 50%))'
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden sunset vibes',
    icon: Sunset,
    colors: {
      light: {
        primary: '40 85% 55%', // Golden yellow
        secondary: '35 80% 50%', // Orange-gold
        accent: '50 90% 60%', // Bright yellow
        background: '40 20% 98%', // Warm cream
        foreground: '40 35% 20%', // Dark golden brown
        card: '40 15% 96%',
        'card-foreground': '40 35% 20%',
        muted: '40 20% 92%',
        'muted-foreground': '40 25% 40%',
        border: '40 25% 88%'
      },
      dark: {
        primary: '40 85% 65%', // Brighter gold for dark
        secondary: '35 80% 60%', // Adjusted orange-gold
        accent: '50 90% 70%', // Bright yellow accent
        background: '40 35% 8%', // Dark golden brown
        foreground: '40 20% 90%', // Light cream
        card: '40 30% 12%',
        'card-foreground': '40 20% 90%',
        muted: '40 25% 15%',
        'muted-foreground': '40 15% 70%',
        border: '40 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(40 85% 55%), hsl(35 80% 50%), hsl(50 90% 60%))'
  }
];