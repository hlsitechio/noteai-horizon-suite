
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ColorSlidersProps {
  hue: number;
  saturation: number;
  lightness: number;
  onHueChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onLightnessChange: (value: number) => void;
}

export const ColorSliders: React.FC<ColorSlidersProps> = ({
  hue,
  saturation,
  lightness,
  onHueChange,
  onSaturationChange,
  onLightnessChange
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label className="text-xs">Hue</Label>
        <Slider
          value={[hue]}
          onValueChange={(value) => onHueChange(value[0])}
          max={360}
          step={1}
          className="mt-1"
        />
        <div className="text-xs text-muted-foreground mt-1">{hue}°</div>
      </div>
      <div>
        <Label className="text-xs">Saturation</Label>
        <Slider
          value={[saturation]}
          onValueChange={(value) => onSaturationChange(value[0])}
          max={100}
          step={1}
          className="mt-1"
        />
        <div className="text-xs text-muted-foreground mt-1">{saturation}%</div>
      </div>
      <div>
        <Label className="text-xs">Lightness</Label>
        <Slider
          value={[lightness]}
          onValueChange={(value) => onLightnessChange(value[0])}
          max={100}
          step={1}
          className="mt-1"
        />
        <div className="text-xs text-muted-foreground mt-1">{lightness}%</div>
      </div>
    </div>
  );
};
