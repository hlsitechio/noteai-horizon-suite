import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

const GlowEffectSection: React.FC = () => {
  const [glowIntensity, setGlowIntensity] = useState<number>(() => {
    const saved = localStorage.getItem('glow-effect-intensity');
    return saved ? parseInt(saved, 10) : 100;
  });
  
  const [appliedIntensity, setAppliedIntensity] = useState<number>(glowIntensity);
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState<boolean>(false);

  useEffect(() => {
    // Initialize with saved intensity on mount
    const intensity = appliedIntensity / 100;
    applyGlowEffects(intensity);
  }, [appliedIntensity]);

  useEffect(() => {
    setHasUnappliedChanges(glowIntensity !== appliedIntensity);
  }, [glowIntensity, appliedIntensity]);

  const applyGlowEffects = (intensity: number) => {
    const root = document.documentElement;
    
    // Set global glow intensity variable
    root.style.setProperty('--glow-intensity', intensity.toString());
    root.style.setProperty('--glow-opacity', (intensity * 0.8).toString());
    root.style.setProperty('--glow-blur', `${intensity * 20}px`);
    root.style.setProperty('--glow-spread', `${intensity * 10}px`);
    
    // Apply to various shadow variables used across the dashboard
    root.style.setProperty('--shadow-glow', `0 0 ${intensity * 40}px hsl(var(--primary) / ${intensity * 0.3})`);
    root.style.setProperty('--shadow-elegant', `0 10px 30px -10px hsl(var(--primary) / ${intensity * 0.3})`);
    root.style.setProperty('--shadow-primary-glow', `0 0 ${intensity * 25}px hsl(var(--primary) / ${intensity * 0.4})`);
  };

  const handleGlowChange = (value: number[]) => {
    setGlowIntensity(value[0]);
  };

  const handleApplyChanges = () => {
    localStorage.setItem('glow-effect-intensity', glowIntensity.toString());
    setAppliedIntensity(glowIntensity);
    applyGlowEffects(glowIntensity / 100);
    
    toast.success('Glow effects applied successfully!', {
      description: `Glow intensity set to ${glowIntensity}%`
    });
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

        {/* Apply button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleApplyChanges}
            disabled={!hasUnappliedChanges}
            className="w-full"
            variant={hasUnappliedChanges ? "default" : "secondary"}
          >
            <Check className="mr-2 h-4 w-4" />
            {hasUnappliedChanges ? 'Apply Changes' : 'Applied'}
          </Button>
          {hasUnappliedChanges && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Changes will be applied to all dashboard glow effects
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlowEffectSection;