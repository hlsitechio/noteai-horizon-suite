
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, hslToHslString } from '../../utils/colorUtils';
import { PredefinedColors } from './PredefinedColors';
import { ColorPickerArea } from './ColorPickerArea';
import { ColorSliders } from './ColorSliders';
import { ColorInputs } from './ColorInputs';

interface AdvancedColorPickerProps {
  currentColor: string;
  onColorChange: (color: { name: string; value: string; hsl: string }) => void;
}

export const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  currentColor,
  onColorChange
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [hue, setHue] = useState(187);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(42);
  const [hexInput, setHexInput] = useState(currentColor);
  
  // Initialize HSL values from current color
  useEffect(() => {
    const rgb = hexToRgb(currentColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setHexInput(currentColor);
      setSelectedColor(currentColor);
    }
  }, [currentColor]);

  // Update color when HSL changes
  useEffect(() => {
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
    setHexInput(hex);
  }, [hue, saturation, lightness]);

  const handleSaturationLightnessChange = (newSaturation: number, newLightness: number) => {
    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        setSelectedColor(value);
      }
    }
  };

  const handleApplyColor = () => {
    const hslString = hslToHslString(hue, saturation, lightness);
    onColorChange({
      name: 'Custom Color',
      value: selectedColor,
      hsl: hslString
    });
  };

  const handlePredefinedColorClick = (color: { name: string; value: string; hsl: string }) => {
    onColorChange(color);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Accent Color</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose from presets or create a custom accent color
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Colors */}
        <PredefinedColors onColorSelect={handlePredefinedColorClick} />

        {/* Custom Color Picker */}
        <ColorPickerArea
          hue={hue}
          saturation={saturation}
          lightness={lightness}
          onSaturationLightnessChange={handleSaturationLightnessChange}
          onHueChange={setHue}
        />

        {/* Color Values */}
        <div className="space-y-4">
          <ColorSliders
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            onHueChange={setHue}
            onSaturationChange={setSaturation}
            onLightnessChange={setLightness}
          />

          <ColorInputs
            hexInput={hexInput}
            selectedColor={selectedColor}
            onHexInputChange={handleHexInputChange}
          />
        </div>

        {/* Apply Button */}
        <Button 
          onClick={handleApplyColor}
          className="w-full"
          disabled={selectedColor === currentColor}
        >
          Apply Color
        </Button>

        {/* Current Color Display */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current color: <span className="font-medium font-mono">{currentColor}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
