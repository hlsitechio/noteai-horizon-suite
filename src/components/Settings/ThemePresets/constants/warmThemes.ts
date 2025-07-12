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
        background: '15 25% 15%', // Softer dark warm (was 8%)
        foreground: '30 15% 85%', // Softer light warm (was 90%)
        card: '15 20% 18%', // Softer card background (was 12%)
        'card-foreground': '30 15% 85%', // Consistent with foreground
        muted: '15 20% 22%', // Less harsh muted (was 15%)
        'muted-foreground': '30 12% 65%', // Softer muted text (was 70%)
        border: '15 18% 28%' // Softer borders (was 20%)
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
        background: '25 22% 16%', // Softer dark coffee (was 8%)
        foreground: '25 12% 82%', // Softer light cream (was 90%)
        card: '25 18% 20%', // Softer card (was 12%)
        'card-foreground': '25 12% 82%', // Consistent with foreground
        muted: '25 16% 25%', // Less harsh muted (was 15%)
        'muted-foreground': '25 10% 62%', // Softer muted text (was 70%)
        border: '25 15% 30%' // Softer borders (was 20%)
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
        background: '40 20% 16%', // Softer dark golden brown (was 8%)
        foreground: '40 15% 84%', // Softer light cream (was 90%)
        card: '40 16% 20%', // Softer card (was 12%)
        'card-foreground': '40 15% 84%', // Consistent with foreground
        muted: '40 14% 26%', // Less harsh muted (was 15%)
        'muted-foreground': '40 12% 64%', // Softer muted text (was 70%)
        border: '40 12% 32%' // Softer borders (was 20%)
      }
    },
    preview: 'linear-gradient(135deg, hsl(40 85% 55%), hsl(35 80% 50%), hsl(50 90% 60%))'
  }
];