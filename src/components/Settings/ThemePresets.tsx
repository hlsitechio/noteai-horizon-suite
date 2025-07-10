import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Check, Waves, Sun, Trees, Crown, Zap, Sparkles, Paintbrush, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAccentColor } from '../../contexts/AccentColorContext';

// Preset Color Themes
const presetThemes = [
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool and calming blues',
    icon: Waves,
    colors: {
      primary: '200 80% 50%', // Ocean blue
      secondary: '210 70% 45%', // Deeper blue
      accent: '190 85% 55%', // Cyan
      background: '210 15% 95%', // Light blue-gray
      foreground: '210 40% 15%', // Dark blue-gray
    },
    preview: 'linear-gradient(135deg, hsl(200 80% 50%), hsl(210 70% 45%), hsl(190 85% 55%))'
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm sunset colors',
    icon: Sun,
    colors: {
      primary: '15 85% 60%', // Orange
      secondary: '25 80% 55%', // Orange-red
      accent: '45 90% 65%', // Yellow-orange
      background: '30 20% 95%', // Warm white
      foreground: '15 30% 20%', // Dark brown
    },
    preview: 'linear-gradient(135deg, hsl(15 85% 60%), hsl(25 80% 55%), hsl(45 90% 65%))'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green tones',
    icon: Trees,
    colors: {
      primary: '140 65% 45%', // Forest green
      secondary: '120 60% 40%', // Darker green
      accent: '160 70% 50%', // Mint green
      background: '140 10% 95%', // Light green-gray
      foreground: '140 40% 15%', // Dark green
    },
    preview: 'linear-gradient(135deg, hsl(140 65% 45%), hsl(120 60% 40%), hsl(160 70% 50%))'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Rich purple shades',
    icon: Crown,
    colors: {
      primary: '270 75% 55%', // Royal purple
      secondary: '285 70% 50%', // Blue-purple
      accent: '255 80% 60%', // Violet
      background: '270 15% 95%', // Light purple-gray
      foreground: '270 40% 15%', // Dark purple
    },
    preview: 'linear-gradient(135deg, hsl(270 75% 55%), hsl(285 70% 50%), hsl(255 80% 60%))'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic grayscale',
    icon: Palette,
    colors: {
      primary: '0 0% 30%', // Dark gray
      secondary: '0 0% 50%', // Medium gray
      accent: '0 0% 70%', // Light gray
      background: '0 0% 98%', // Almost white
      foreground: '0 0% 10%', // Almost black
    },
    preview: 'linear-gradient(135deg, hsl(0 0% 30%), hsl(0 0% 50%), hsl(0 0% 70%))'
  },
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    description: 'Vibrant neon colors',
    icon: Zap,
    colors: {
      primary: '300 100% 50%', // Neon magenta
      secondary: '180 100% 50%', // Neon cyan
      accent: '60 100% 50%', // Neon yellow
      background: '0 0% 5%', // Almost black
      foreground: '0 0% 95%', // Almost white
    },
    preview: 'linear-gradient(135deg, hsl(300 100% 50%), hsl(180 100% 50%), hsl(60 100% 50%))'
  }
];

// Gradient Presets
const gradientPresets = [
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

export const ThemePresets: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const { setAccentColor } = useAccentColor();

  const applyTheme = (theme: typeof presetThemes[0]) => {
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.foreground);
    
    // Update accent color context
    setAccentColor(`hsl(${theme.colors.primary})`, theme.colors.primary);
    
    setSelectedTheme(theme.id);
    setSelectedGradient(null);
    toast.success(`Applied ${theme.name} theme!`);
  };

  const applyGradient = (gradient: typeof gradientPresets[0]) => {
    const root = document.documentElement;
    
    // Apply gradient as CSS custom properties
    root.style.setProperty('--gradient-primary', gradient.gradient);
    root.style.setProperty('--primary', gradient.accentColor);
    root.style.setProperty('--accent', gradient.accentColor);
    
    // Update accent color context
    setAccentColor(`hsl(${gradient.accentColor})`, gradient.accentColor);
    
    setSelectedGradient(gradient.id);
    setSelectedTheme(null);
    toast.success(`Applied ${gradient.name} gradient theme!`);
  };

  const resetToDefault = () => {
    const root = document.documentElement;
    
    // Reset to default theme values
    root.style.setProperty('--primary', '187 100% 42%');
    root.style.setProperty('--secondary', '210 40% 98%');
    root.style.setProperty('--accent', '210 40% 98%');
    root.style.setProperty('--background', '0 0% 100%');
    root.style.setProperty('--foreground', '222.2 84% 4.9%');
    root.style.removeProperty('--gradient-primary');
    
    setAccentColor('hsl(187 100% 42%)', '187 100% 42%');
    setSelectedTheme(null);
    setSelectedGradient(null);
    toast.success('Reset to default theme');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Theme Presets</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color Themes
            </TabsTrigger>
            <TabsTrigger value="gradients" className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              Gradients
            </TabsTrigger>
          </TabsList>

          {/* Preset Themes Tab */}
          <TabsContent value="presets" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Color Themes</h3>
              <p className="text-muted-foreground">
                Complete color schemes for your entire application
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presetThemes.map((theme) => {
                const IconComponent = theme.icon;
                const isSelected = selectedTheme === theme.id;
                
                return (
                  <Card 
                    key={theme.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
                    }`}
                    onClick={() => applyTheme(theme)}
                  >
                    <CardContent className="p-4">
                      {/* Preview */}
                      <div 
                        className="w-full h-16 rounded-lg mb-4 relative overflow-hidden"
                        style={{ background: theme.preview }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Theme Info */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{theme.name}</h4>
                          <p className="text-sm text-muted-foreground">{theme.description}</p>
                        </div>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex gap-2 mt-3">
                        {Object.entries(theme.colors).slice(0, 3).map(([key, value]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: `hsl(${value})` }}
                            title={key}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Gradient Presets Tab */}
          <TabsContent value="gradients" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Gradient Themes</h3>
              <p className="text-muted-foreground">
                Beautiful gradient combinations with matching accent colors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gradientPresets.map((gradient) => {
                const isSelected = selectedGradient === gradient.id;
                
                return (
                  <Card 
                    key={gradient.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/50'
                    }`}
                    onClick={() => applyGradient(gradient)}
                  >
                    <CardContent className="p-6">
                      {/* Large Gradient Preview */}
                      <div 
                        className="w-full h-24 rounded-lg mb-4 relative overflow-hidden"
                        style={{ background: gradient.gradient }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Gradient Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{gradient.name}</h4>
                          <p className="text-sm text-muted-foreground">{gradient.description}</p>
                        </div>
                      </div>

                      {/* Color Breakdown */}
                      <div className="flex gap-2">
                        {gradient.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-8 rounded border-2 border-white shadow-sm"
                            style={{ backgroundColor: `hsl(${color})` }}
                            title={`Color ${index + 1}: hsl(${color})`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Status Message */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground text-center">
            {selectedTheme ? 
              `Applied: ${presetThemes.find(t => t.id === selectedTheme)?.name} theme` : 
              selectedGradient ?
              `Applied: ${gradientPresets.find(g => g.id === selectedGradient)?.name} gradient theme` :
              'Select a theme or gradient to customize your application'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};