import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Paintbrush, RefreshCw } from 'lucide-react';
import { presetThemes } from './ThemePresets/constants/themeData';
import { gradientPresets } from './ThemePresets/constants/gradientData';
import { useThemeActions } from './ThemePresets/hooks/useThemeActions';
import { ThemeCard } from './ThemePresets/components/ThemeCard';
import { GradientCard } from './ThemePresets/components/GradientCard';

export const ThemePresets: React.FC = () => {
  const {
    selectedTheme,
    selectedGradient,
    resolvedTheme,
    applyTheme,
    applyGradient,
    resetToDefault
  } = useThemeActions();

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
              {presetThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  resolvedTheme={resolvedTheme}
                  onApply={applyTheme}
                />
              ))}
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
              {gradientPresets.map((gradient) => (
                <GradientCard
                  key={gradient.id}
                  gradient={gradient}
                  isSelected={selectedGradient === gradient.id}
                  onApply={applyGradient}
                />
              ))}
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