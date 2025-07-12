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
    
    // Core intensity variables - controls all gradient and glow effects
    root.style.setProperty('--glow-intensity', intensity.toString());
    root.style.setProperty('--gradient-intensity', intensity.toString());
    root.style.setProperty('--gradient-opacity-multiplier', intensity.toString());
    
    // Extended glow properties for fine-tuned control
    root.style.setProperty('--glow-opacity', (intensity * 0.8).toString());
    root.style.setProperty('--glow-blur', `${intensity * 20}px`);
    root.style.setProperty('--glow-spread', `${intensity * 10}px`);
    
    // Dynamic shadow system - all shadow variables now respond to intensity
    const shadowIntensityFactor = Math.max(0.1, intensity); // Prevent shadows from disappearing completely
    root.style.setProperty('--shadow-glow', `0 0 ${shadowIntensityFactor * 60}px hsl(var(--primary) / ${shadowIntensityFactor * 0.4})`);
    root.style.setProperty('--shadow-elegant', `0 ${shadowIntensityFactor * 15}px ${shadowIntensityFactor * 35}px ${-shadowIntensityFactor * 5}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.12})`);
    root.style.setProperty('--shadow-premium', `0 ${shadowIntensityFactor * 25}px ${shadowIntensityFactor * 50}px ${-shadowIntensityFactor * 12}px hsl(var(--primary) / ${shadowIntensityFactor * 0.3})`);
    root.style.setProperty('--shadow-soft', `0 ${shadowIntensityFactor * 4}px ${shadowIntensityFactor * 20}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.08})`);
    root.style.setProperty('--shadow-inner', `inset 0 ${shadowIntensityFactor * 2}px ${shadowIntensityFactor * 10}px hsl(var(--foreground) / ${shadowIntensityFactor * 0.1})`);
    root.style.setProperty('--shadow-primary-glow', `0 0 ${shadowIntensityFactor * 40}px hsl(var(--primary) / ${shadowIntensityFactor * 0.5})`);
    
    // Update special effect intensities
    updateHolographicEffects(intensity);
    updateAnimationIntensities(intensity);
  };

  const updateHolographicEffects = (intensity: number) => {
    const root = document.documentElement;
    
    // Holographic and neural effects
    const neuralIntensity = intensity * 0.6; // Slightly subdued for neural effects
    root.style.setProperty('--neural-glow-intensity', neuralIntensity.toString());
    root.style.setProperty('--holographic-opacity', (intensity * 0.8).toString());
    
    // Update neural node intensities
    const neuralNodes = document.querySelectorAll('.neural-node');
    neuralNodes.forEach(node => {
      (node as HTMLElement).style.setProperty('--node-intensity', neuralIntensity.toString());
    });
  };

  const updateAnimationIntensities = (intensity: number) => {
    const root = document.documentElement;
    
    // Pulse and glow animations
    root.style.setProperty('--pulse-intensity', intensity.toString());
    root.style.setProperty('--glow-animation-intensity', intensity.toString());
    
    // Border glow animations
    root.style.setProperty('--border-glow-intensity', (intensity * 0.7).toString());
  };

  const handleGlowChange = (value: number[]) => {
    setGlowIntensity(value[0]);
  };

  const handleApplyChanges = () => {
    localStorage.setItem('glow-effect-intensity', glowIntensity.toString());
    setAppliedIntensity(glowIntensity);
    applyGlowEffects(glowIntensity / 100);
    
    toast.success('Gradient & glow effects applied successfully!', {
      description: `Effect intensity set to ${glowIntensity}%`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Gradient & Glow Effects
            </CardTitle>
            <CardDescription className="text-sm">
              Control all gradient and glow effects across the entire dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Intensity Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="effect-intensity" className="text-sm font-medium">
              Effect Intensity
            </Label>
            <span className="text-sm text-muted-foreground font-mono">
              {glowIntensity}%
            </span>
          </div>
          
          <Slider
            id="effect-intensity"
            min={0}
            max={150}
            step={5}
            value={[glowIntensity]}
            onValueChange={handleGlowChange}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Disabled</span>
            <span>Normal</span>
            <span>Enhanced</span>
          </div>
        </div>

        {/* Effects Preview Grid */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Effect Preview</Label>
          <div className="grid grid-cols-2 gap-3">
            {/* Gradient Preview */}
            <div 
              className="relative h-16 rounded-lg border border-border/50 flex items-center justify-center transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary) / ${glowIntensity * 0.01}), hsl(var(--accent) / ${glowIntensity * 0.007}))`
              }}
            >
              <span className="text-xs font-medium text-center">Gradients</span>
            </div>

            {/* Glow Preview */}
            <div 
              className="relative h-16 rounded-lg border border-border/50 bg-card flex items-center justify-center transition-all duration-300"
              style={{
                boxShadow: `0 0 ${glowIntensity * 0.3}px hsl(var(--primary) / ${glowIntensity * 0.008})`
              }}
            >
              <Sparkles 
                className="h-5 w-5 text-primary transition-all duration-300" 
                style={{
                  filter: `drop-shadow(0 0 ${glowIntensity * 0.15}px hsl(var(--primary) / ${glowIntensity * 0.01}))`
                }}
              />
            </div>

            {/* Shadow Preview */}
            <div 
              className="relative h-16 rounded-lg bg-card border border-border/50 flex items-center justify-center transition-all duration-300"
              style={{
                boxShadow: `0 ${glowIntensity * 0.1}px ${glowIntensity * 0.2}px hsl(var(--foreground) / ${glowIntensity * 0.002})`
              }}
            >
              <span className="text-xs font-medium">Shadows</span>
            </div>

            {/* Premium Effects Preview */}
            <div 
              className="relative h-16 rounded-lg border border-primary/20 flex items-center justify-center transition-all duration-300"
              style={{
                background: `var(--gradient-glass)`,
                backdropFilter: `blur(${glowIntensity * 0.1}px)`,
                boxShadow: `0 0 ${glowIntensity * 0.2}px hsl(var(--primary) / ${glowIntensity * 0.005})`
              }}
            >
              <span className="text-xs font-medium">Premium</span>
            </div>
          </div>
        </div>

        {/* Effect Status Indicators */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-muted/50">
            <div className="font-medium text-foreground">Gradients</div>
            <div className="text-muted-foreground">
              {glowIntensity === 0 ? 'Off' : glowIntensity < 50 ? 'Subtle' : glowIntensity < 100 ? 'Normal' : 'Enhanced'}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-muted/50">
            <div className="font-medium text-foreground">Shadows</div>
            <div className="text-muted-foreground">
              {glowIntensity === 0 ? 'Minimal' : glowIntensity < 100 ? 'Active' : 'Intense'}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-muted/50">
            <div className="font-medium text-foreground">Effects</div>
            <div className="text-muted-foreground">
              {glowIntensity === 0 ? 'Disabled' : glowIntensity > 100 ? 'Premium' : 'Standard'}
            </div>
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
              Changes will affect all gradients, shadows, and glow effects across the dashboard
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlowEffectSection;