import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Check, Waves, Sun, Trees, Crown, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ColorThemesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    colors: ['280 80% 60%', '160 70% 50%', '300 75% 65%', '120 60% 45%']
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Blazing flame colors',
    gradient: 'linear-gradient(135deg, hsl(0 85% 60%), hsl(20 90% 55%), hsl(40 95% 50%), hsl(60 100% 45%))',
    colors: ['0 85% 60%', '20 90% 55%', '40 95% 50%', '60 100% 45%']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea blues',
    gradient: 'linear-gradient(135deg, hsl(220 85% 25%), hsl(200 80% 45%), hsl(180 75% 55%), hsl(190 85% 65%))',
    colors: ['220 85% 25%', '200 80% 45%', '180 75% 55%', '190 85% 65%']
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Cosmic deep space',
    gradient: 'linear-gradient(135deg, hsl(240 50% 15%), hsl(280 60% 25%), hsl(320 55% 35%), hsl(260 65% 20%))',
    colors: ['240 50% 15%', '280 60% 25%', '320 55% 35%', '260 65% 20%']
  }
];

const ColorThemesModal: React.FC<ColorThemesModalProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);

  const applyTheme = (theme: typeof presetThemes[0]) => {
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.foreground);
    
    setSelectedTheme(theme.id);
    toast.success(`Applied ${theme.name} theme!`);
  };

  const applyGradient = (gradient: typeof gradientPresets[0]) => {
    const root = document.documentElement;
    
    // Apply gradient as a CSS custom property
    root.style.setProperty('--gradient-primary', gradient.gradient);
    
    setSelectedGradient(gradient.id);
    toast.success(`Applied ${gradient.name} gradient!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Themes & Gradients
          </DialogTitle>
          <DialogDescription>
            Choose from preset themes or create custom gradients for your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh]">
          <Tabs defaultValue="presets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Preset Themes</TabsTrigger>
              <TabsTrigger value="gradients">Gradient Presets</TabsTrigger>
            </TabsList>

            {/* Preset Themes Tab */}
            <TabsContent value="presets" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Preset Themes</h3>
                <p className="text-muted-foreground">
                  Complete color schemes for your dashboard
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
                <h3 className="text-lg font-semibold mb-2">Gradient Presets</h3>
                <p className="text-muted-foreground">
                  Beautiful gradient combinations for backgrounds and accents
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
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedTheme || selectedGradient ? 
              `Applied: ${selectedTheme ? presetThemes.find(t => t.id === selectedTheme)?.name : 
                        gradientPresets.find(g => g.id === selectedGradient)?.name}` : 
              'Select a theme or gradient to apply'
            }
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorThemesModal;