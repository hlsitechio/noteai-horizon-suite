export interface GradientPreset {
  id: string;
  name: string;
  description: string;
  gradient: string;
  colors: string[];
  accentColor: string;
}

// Gradient Presets
export const gradientPresets: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights inspired',
    gradient: 'linear-gradient(135deg, hsl(280 80% 60%), hsl(160 70% 50%), hsl(300 75% 65%), hsl(120 60% 45%))',
    colors: ['280 80% 60%', '160 70% 50%', '300 75% 65%', '120 60% 45%'],
    accentColor: '280 80% 60%'
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Blazing flame colors',
    gradient: 'linear-gradient(135deg, hsl(0 85% 60%), hsl(20 90% 55%), hsl(40 95% 50%), hsl(60 100% 45%))',
    colors: ['0 85% 60%', '20 90% 55%', '40 95% 50%', '60 100% 45%'],
    accentColor: '15 85% 60%'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea blues',
    gradient: 'linear-gradient(135deg, hsl(220 85% 25%), hsl(200 80% 45%), hsl(180 75% 55%), hsl(190 85% 65%))',
    colors: ['220 85% 25%', '200 80% 45%', '180 75% 55%', '190 85% 65%'],
    accentColor: '200 80% 50%'
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Cosmic deep space',
    gradient: 'linear-gradient(135deg, hsl(240 50% 15%), hsl(280 60% 25%), hsl(320 55% 35%), hsl(260 65% 20%))',
    colors: ['240 50% 15%', '280 60% 25%', '320 55% 35%', '260 65% 20%'],
    accentColor: '280 60% 40%'
  },
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Cherry blossom pinks',
    gradient: 'linear-gradient(135deg, hsl(330 85% 75%), hsl(320 80% 65%), hsl(340 90% 80%), hsl(350 85% 70%))',
    colors: ['330 85% 75%', '320 80% 65%', '340 90% 80%', '350 85% 70%'],
    accentColor: '330 85% 65%'
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Futuristic cyber theme',
    gradient: 'linear-gradient(135deg, hsl(180 100% 50%), hsl(280 100% 50%), hsl(320 100% 60%), hsl(200 100% 45%))',
    colors: ['180 100% 50%', '280 100% 50%', '320 100% 60%', '200 100% 45%'],
    accentColor: '280 100% 60%'
  }
];