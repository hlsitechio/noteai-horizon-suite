import { Waves, Sun, Trees, Crown, Palette, Zap } from 'lucide-react';

export interface ThemeColors {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  icon: any;
  colors: ThemeColors;
  preview: string;
}

// Preset Color Themes with both light and dark variants
export const presetThemes: PresetTheme[] = [
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
        background: '270 40% 8%', // Dark purple
        foreground: '270 15% 90%', // Light purple-gray
        card: '270 35% 12%',
        'card-foreground': '270 15% 90%',
        muted: '270 30% 15%',
        'muted-foreground': '270 15% 70%',
        border: '270 25% 20%'
      }
    },
    preview: 'linear-gradient(135deg, hsl(270 75% 55%), hsl(285 70% 50%), hsl(255 80% 60%))'
  },
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