import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

const GlowEffectSection: React.FC = () => {
  const [glowIntensity, setGlowIntensity] = useState<number>(() => {
    const saved = localStorage.getItem('glow-effect-intensity');
    return saved ? parseInt(saved, 10) : 100;
  });

  useEffect(() => {
    localStorage.setItem('glow-effect-intensity', glowIntensity.toString());
    
    // Apply the glow effect intensity to the document root
    document.documentElement.style.setProperty('--glow-intensity', (glowIntensity / 100).toString());
  }, [glowIntensity]);

  const handleGlowChange = (value: number[]) => {
    setGlowIntensity(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Glow Effects
        </CardTitle>
        <CardDescription>
          Control the intensity of glowing effects across the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="glow-slider">Glow Intensity</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {glowIntensity}%
            </span>
          </div>
          <Slider
            id="glow-slider"
            min={0}
            max={100}
            step={5}
            value={[glowIntensity]}
            onValueChange={handleGlowChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimal</span>
            <span>Maximum</span>
          </div>
        </div>
        
        {/* Preview indicator */}
        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-2">Preview:</div>
          <div 
            className="w-full h-8 rounded-md border-2 border-primary/20 bg-primary/10 relative overflow-hidden"
            style={{
              boxShadow: `0 0 ${20 * (glowIntensity / 100)}px hsl(var(--primary) / ${0.3 * (glowIntensity / 100)})`
            }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
              style={{
                opacity: glowIntensity / 100
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlowEffectSection;