
import React from 'react';
import { Label } from '@/components/ui/label';

interface ColorPickerAreaProps {
  hue: number;
  saturation: number;
  lightness: number;
  onSaturationLightnessChange: (saturation: number, lightness: number) => void;
  onHueChange: (hue: number) => void;
}

export const ColorPickerArea: React.FC<ColorPickerAreaProps> = ({
  hue,
  saturation,
  lightness,
  onSaturationLightnessChange,
  onHueChange
}) => {
  const handleSaturationLightnessClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSaturation = Math.round((x / rect.width) * 100);
    const newLightness = Math.round(100 - (y / rect.height) * 100);
    
    onSaturationLightnessChange(
      Math.max(0, Math.min(100, newSaturation)),
      Math.max(0, Math.min(100, newLightness))
    );
  };

  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newHue = Math.round((y / rect.height) * 360);
    
    onHueChange(Math.max(0, Math.min(360, newHue)));
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">Custom Color</Label>
      <div className="flex gap-4">
        {/* Main Saturation/Lightness Area */}
        <div className="relative flex-1">
          <div
            className="w-full h-32 rounded-lg border cursor-crosshair relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, 
                hsl(${hue}, 0%, 50%) 0%, 
                hsl(${hue}, 100%, 50%) 100%), 
                linear-gradient(to top, 
                hsl(${hue}, 50%, 0%) 0%, 
                transparent 50%, 
                hsl(${hue}, 50%, 100%) 100%)`
            }}
            onClick={handleSaturationLightnessClick}
          >
            {/* Saturation gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, white, transparent, hsl(${hue}, 100%, 50%))`
              }}
            />
            {/* Lightness gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, black, transparent, white)`
              }}
            />
            {/* Color picker indicator */}
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>

        {/* Hue Slider */}
        <div className="relative w-6">
          <div
            className="w-6 h-32 rounded cursor-pointer"
            style={{
              background: `linear-gradient(to bottom, 
                #ff0000 0%, 
                #ffff00 16.66%, 
                #00ff00 33.33%, 
                #00ffff 50%, 
                #0000ff 66.66%, 
                #ff00ff 83.33%, 
                #ff0000 100%)`
            }}
            onClick={handleHueClick}
          />
          {/* Hue indicator */}
          <div
            className="absolute w-8 h-2 border-2 border-white rounded-sm pointer-events-none shadow-lg -ml-1"
            style={{
              top: `${(hue / 360) * 100}%`,
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              transform: 'translateY(-50%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
