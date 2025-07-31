export interface GradientPreset {
  id: string;
  name: string;
  description: string;
  gradient: string;
  colors: string[];
  accentColor: string;
}

// Gradient Presets - Updated for better readability and eye comfort
export const gradientPresets: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights inspired',
    gradient: 'linear-gradient(135deg, hsl(280 60% 55%), hsl(160 50% 45%), hsl(300 55% 60%), hsl(120 45% 40%))',
    colors: ['280 60% 55%', '160 50% 45%', '300 55% 60%', '120 45% 40%'],
    accentColor: '280 60% 55%'
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Warm sunset colors',
    gradient: 'linear-gradient(135deg, hsl(0 70% 55%), hsl(20 75% 50%), hsl(40 80% 45%), hsl(60 85% 40%))',
    colors: ['0 70% 55%', '20 75% 50%', '40 80% 45%', '60 85% 40%'],
    accentColor: '15 75% 50%'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm sea blues',
    gradient: 'linear-gradient(135deg, hsl(220 65% 35%), hsl(200 60% 50%), hsl(180 55% 60%), hsl(190 65% 70%))',
    colors: ['220 65% 35%', '200 60% 50%', '180 55% 60%', '190 65% 70%'],
    accentColor: '200 60% 55%'
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Cosmic deep space',
    gradient: 'linear-gradient(135deg, hsl(240 40% 25%), hsl(280 45% 35%), hsl(320 40% 45%), hsl(260 50% 30%))',
    colors: ['240 40% 25%', '280 45% 35%', '320 40% 45%', '260 50% 30%'],
    accentColor: '280 45% 40%'
  },
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Cherry blossom pinks',
    gradient: 'linear-gradient(135deg, hsl(330 65% 70%), hsl(320 60% 60%), hsl(340 70% 75%), hsl(350 65% 65%))',
    colors: ['330 65% 70%', '320 60% 60%', '340 70% 75%', '350 65% 65%'],
    accentColor: '330 65% 60%'
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Futuristic cyber theme',
    gradient: 'linear-gradient(135deg, hsl(180 80% 45%), hsl(280 80% 45%), hsl(320 80% 55%), hsl(200 80% 40%))',
    colors: ['180 80% 45%', '280 80% 45%', '320 80% 55%', '200 80% 40%'],
    accentColor: '280 80% 50%'
  }
];