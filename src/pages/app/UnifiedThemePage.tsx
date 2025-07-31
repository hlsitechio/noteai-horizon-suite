import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, Settings, Brush } from 'lucide-react';

// Import all theme-related components
import ThemeGallery from '@/components/ThemeGallery/ThemeGallery';
import { ThemePresets } from '@/components/Settings/ThemePresets';
import { AdvancedColorPicker } from '@/components/Settings/AdvancedColorPicker';
import GlowEffectSection from '@/components/Settings/GlowEffectSection';
import { useAccentColor } from '@/contexts/AccentColorContext';

const UnifiedThemePage: React.FC = () => {
  const navigate = useNavigate();
  const { accentColor, setAccentColor } = useAccentColor();
  const [activeTab, setActiveTab] = useState('gallery');

  const handleColorChange = (color: { name: string; value: string; hsl: string }) => {
    setAccentColor(color.value, color.hsl);
  };

  const handleThemeSelect = (themeId: string) => {
    console.log('Theme selected:', themeId);
    // Theme selection is handled by the ThemeGallery component internally
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-semibold">Theme Center</h1>
                <p className="text-sm text-muted-foreground">
                  Customize your application's appearance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Theme Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Gallery
                </CardTitle>
                <p className="text-muted-foreground">
                  Browse and select from our curated collection of beautiful themes
                </p>
              </CardHeader>
              <CardContent>
                <ThemeGallery 
                  onThemeSelect={handleThemeSelect}
                  className="py-0"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <ThemePresets />
          </TabsContent>

          {/* Advanced Customization Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brush className="h-5 w-5" />
                  Advanced Customization
                </CardTitle>
                <p className="text-muted-foreground">
                  Fine-tune colors, effects, and advanced theme settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <GlowEffectSection />
                <AdvancedColorPicker 
                  currentColor={accentColor}
                  onColorChange={handleColorChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedThemePage;